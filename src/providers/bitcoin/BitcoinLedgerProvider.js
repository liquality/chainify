import LedgerProvider from '../LedgerProvider'
import Bitcoin from '@ledgerhq/hw-app-btc'

import { find } from 'lodash'
import { BigNumber } from 'bignumber.js'
import { base58, padHexStart } from '../../crypto'
import { pubKeyToAddress, addressToPubKeyHash, compressPubKey, getAddressNetwork } from './BitcoinUtil'
import networks from './networks'
import bip32 from 'bip32'
import coinselect from 'coinselect'

const ADDRESS_GAP = 20

export default class BitcoinLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.bitcoin, segwit: false }, numberOfBlockConfirmation = 1) {
    super(Bitcoin, `${chain.segwit ? '49' : '44'}'/${chain.network.coinType}'/0'/`, chain.network, 'BTC')
    this._derivationPath = `${chain.segwit ? '49' : '44'}'/${chain.network.coinType}'/0'/`
    this._network = chain.network
    this._bjsnetwork = chain.network.name.replace('bitcoin_', '') // for bitcoin js
    this._segwit = chain.segwit
    this._coinType = chain.network.coinType
    this._walletPublicKeyCache = {}
  }

  async _getWalletPublicKey (path) {
    const app = await this.getApp()
    return app.getWalletPublicKey(path, undefined, this._segwit)
  }

  async getWalletPublicKey (path) {
    if (path in this._walletPublicKeyCache) {
      return this._walletPublicKeyCache[path]
    }

    const walletPublicKey = await this._getWalletPublicKey(path)
    this._walletPublicKeyCache[path] = walletPublicKey
    return walletPublicKey
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    return app.signMessageNew(address.derivationPath, hex)
  }

  getAmountBuffer (amount) {
    let hexAmount = BigNumber(Math.round(amount)).toString(16)
    hexAmount = padHexStart(hexAmount, 16)
    const valueBuffer = Buffer.from(hexAmount, 'hex')
    return valueBuffer.reverse()
  }

  async splitTransaction (transactionHex, isSegwitSupported) {
    const app = await this.getApp()

    return app.splitTransaction(transactionHex, isSegwitSupported)
  }

  async serializeTransactionOutputs (transactionHex) {
    const app = await this.getApp()

    return app.serializeTransactionOutputs(transactionHex)
  }

  async signP2SHTransaction (inputs, associatedKeysets, changePath, outputScriptHex) {
    const app = await this.getApp()

    return app.signP2SHTransaction(inputs, associatedKeysets, changePath, outputScriptHex)
  }

  createScript (address) {
    const type = base58.decode(address).toString('hex').substring(0, 2).toUpperCase()
    const pubKeyHash = addressToPubKeyHash(address)
    if (type === this._network.pubKeyHash) {
      return [
        '76', // OP_DUP
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '88', // OP_EQUALVERIFY
        'ac' // OP_CHECKSIG
      ].join('')
    } else if (type === this._network.scriptHash) {
      return [
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '87' // OP_EQUAL
      ].join('')
    } else {
      throw new Error('Not a valid address:', address)
    }
  }

  async getInputsForAmount (amount, numAddressPerCall = 100) {
    let globalUtxoSet = []
    let addressIndex = 0
    let changeAddresses = []
    let plainChangeAddresses = []
    let nonChangeAddresses = []
    let addressCountMap = {
      change: 0,
      nonChange: 0
    }

    const feePerBytePromise = this.getMethod('getFeePerByte')()
    let feePerByte = false

    while (addressCountMap.change < ADDRESS_GAP || addressCountMap.nonChange < ADDRESS_GAP) {
      let addrList = []

      if (addressCountMap.change < ADDRESS_GAP) {
        // Scanning for change addr
        changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        plainChangeAddresses = changeAddresses.map(a => a.address)
        addrList = addrList.concat(changeAddresses)
      } else {
        plainChangeAddresses = []
      }

      if (addressCountMap.nonChange < ADDRESS_GAP) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      const stringAddresses = addrList.map(a => a.address)
      let [ confirmedAdd, utxosMempool, utxos ] = await Promise.all([
        this.getMethod('getAddressBalances')(stringAddresses),
        this.getMethod('getAddressMempool')(stringAddresses),
        this.getMethod('getAddressUtxos')(stringAddresses)
      ])

      const usedAddresses = confirmedAdd.concat(utxosMempool).map(address => address.address)
      utxos = utxos
        .filter(utxo => utxosMempool.filter(mempoolUtxo => utxo.txid === mempoolUtxo.prevtxid).length === 0)

      utxosMempool = utxosMempool
        .filter(utxo => utxosMempool.filter(mempoolUtxo => utxo.txid === mempoolUtxo.prevtxid).length === 0)
        .filter(utxo => utxo.prevtxid === undefined)
        .map(utxo => {
          utxo.outputIndex = utxo.index
          return utxo
        })

      utxos = utxos
        .concat(utxosMempool)
        .map(utxo => {
          const addr = find(addrList, addr => addr.address === utxo.address)

          utxo.value = utxo.satoshis
          utxo.derivationPath = addr.derivationPath

          return utxo
        })

      globalUtxoSet = globalUtxoSet.concat(utxos)
      if (feePerByte === false) feePerByte = await feePerBytePromise

      const { inputs, outputs, fee } = coinselect(globalUtxoSet, [{ id: 'main', value: amount }], feePerByte)

      if (inputs && outputs) {
        let change = outputs.filter(output => output.id !== 'main')

        if (change) {
          change = change[0].value
        }

        return {
          inputs,
          change,
          fee
        }
      }

      for (let i = 0; i < stringAddresses.length; i++) {
        const address = stringAddresses[i]
        const isUsed = usedAddresses.indexOf(address) !== -1
        const isChangeAddress = plainChangeAddresses.indexOf(address) !== -1
        const key = isChangeAddress ? 'change' : 'nonChange'

        if (isUsed) {
          addressCountMap[key] = 0
        } else {
          addressCountMap[key]++
        }
      }

      addressIndex += numAddressPerCall
    }

    throw new Error('Not enough balance')
  }

  async getLedgerInputs (unspentOutputs) {
    const app = await this.getApp()

    return Promise.all(unspentOutputs.map(async utxo => {
      const hex = await this.getMethod('getTransactionHex')(utxo.txid)
      const tx = app.splitTransaction(hex, true)
      const vout = ('vout' in utxo) ? utxo.vout : utxo.outputIndex

      return [ tx, vout ]
    }))
  }

  async getWalletInfo (numAddressPerCall = 10, from = {}) {
    let addressIndex = from.index || 0
    let unusedAddress = false
    let usedAddresses = []
    let balance = 0

    while (!unusedAddress) {
      let addresses = await this.getAddresses(addressIndex, numAddressPerCall)
      const addressList = addresses.map(addr => addr.address)

      const addressDeltas = await this.getMethod('getAddressDeltas')(addressList)

      addressDeltas.forEach((delta) => {
        const addressIndex = addresses.findIndex(address => address.address === delta.address)
        if (addresses[addressIndex].balance === undefined) { addresses[addressIndex].balance = 0 }
        addresses[addressIndex].balance += delta.satoshis
        balance += delta.satoshis
      })

      addresses.forEach((address) => {
        if (!unusedAddress) {
          if (address.balance === undefined) {
            unusedAddress = address.address
          } else {
            usedAddresses.push(address.address)
          }
        }
      })

      addressIndex += numAddressPerCall
    }
    return { balance, unusedAddress, usedAddresses }
  }

  async sendTransaction (to, value, data, from) {
    const app = await this.getApp()

    if (data) {
      const scriptPubKey = padHexStart(data)
      to = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    }

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change } = await this.getInputsForAmount(value)

    const ledgerInputs = await this.getLedgerInputs(inputs)
    const paths = inputs.map(utxo => utxo.derivationPath)

    const sendScript = this.createScript(to)
    const outputs = [{ amount: this.getAmountBuffer(value), script: Buffer.from(sendScript, 'hex') }]

    if (change) {
      const changeScript = this.createScript(unusedAddress.address)
      outputs.push({ amount: this.getAmountBuffer(change), script: Buffer.from(changeScript, 'hex') })
    }

    const serializedOutputs = app.serializeTransactionOutputs({ outputs }).toString('hex')
    const signedTransaction = await app.createPaymentTransactionNew(ledgerInputs, paths, unusedAddress.derivationPath, serializedOutputs)
    return this.getMethod('sendRawTransaction')(signedTransaction)
  }

  async getLedgerAddresses (startingIndex, numAddresses, change = false) {
    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const compressedPubKey = compressPubKey(walletPubKey.publicKey)
    const node = bip32.fromPublicKey(
      Buffer.from(compressedPubKey, 'hex'),
      Buffer.from(walletPubKey.chainCode, 'hex'),
      this._network
    )

    const addresses = []
    const lastIndex = startingIndex + numAddresses
    const changeVal = change ? '1' : '0'
    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const subPath = changeVal + '/' + currentIndex
      const publicKey = node.derivePath(subPath).publicKey
      const address = pubKeyToAddress(publicKey, this._network.name, 'pubKeyHash')
      const path = this._baseDerivationPath + subPath
      addresses.push({
        address,
        publicKey: publicKey.toString('hex'),
        derivationPath: path,
        index: currentIndex
      })
    }

    return addresses
  }

  // addressType
  // nonChange: 0
  // change: 1
  // both: 2
  async _getUsedUnusedAddresses (numAddressPerCall = 100, addressType) {
    const usedAddresses = []
    const addressCountMap = { change: 0, nonChange: 0 }
    let unusedAddresses = []
    let addressIndex = 0
    let changeAddresses = []
    let plainChangeAddresses = []
    let nonChangeAddresses = []

    /* eslint-disable no-unmodified-loop-condition */
    while ((addressType === 2 && (addressCountMap.change < ADDRESS_GAP || addressCountMap.nonChange < ADDRESS_GAP)) ||
           (addressType === 0 && addressCountMap.nonChange < ADDRESS_GAP) ||
           (addressType === 1 && addressCountMap.change < ADDRESS_GAP)) {
      /* eslint-enable no-unmodified-loop-condition */
      let addrList = []

      if ((addressType === 2 || addressType === 1) && addressCountMap.change < ADDRESS_GAP) {
        // Scanning for change addr
        changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        plainChangeAddresses = changeAddresses.map(a => a.address)
        addrList = addrList.concat(changeAddresses)
      } else {
        plainChangeAddresses = []
      }

      if ((addressType === 2 || addressType === 0) && addressCountMap.nonChange < ADDRESS_GAP) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      const stringAddresses = addrList.map(a => a.address)
      const [ confirmedAdd, utxosMempool ] = await Promise.all([
        this.getMethod('getAddressBalances')(stringAddresses),
        this.getMethod('getAddressMempool')(stringAddresses)
      ])
      const totalUsedAddresses = confirmedAdd.concat(utxosMempool).map(address => address.address)
      for (let i = 0; i < addrList.length; i++) {
        const address = stringAddresses[i]
        const isUsed = totalUsedAddresses.indexOf(address) !== -1
        const isChangeAddress = plainChangeAddresses.indexOf(address) !== -1
        const key = isChangeAddress ? 'change' : 'nonChange'

        if (isUsed) {
          usedAddresses.push(addrList[i])
          addressCountMap[key] = 0
          unusedAddresses = []
        } else {
          addressCountMap[key]++
          unusedAddresses.push(addrList[i])
        }
      }

      addressIndex += numAddressPerCall
    }

    return {
      usedAddresses,
      unusedAddresses
    }
  }

  async getUsedAddresses (numAddressPerCall = 100) {
    return this._getUsedUnusedAddresses(numAddressPerCall, 2)
      .then(({ usedAddresses }) => usedAddresses)
  }

  async getUnusedAddress (change = false, numAddressPerCall = 100) {
    const addressType = change ? 1 : 0
    return this._getUsedUnusedAddresses(numAddressPerCall, addressType)
      .then(({ unusedAddresses }) => unusedAddresses[0])
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this.getLedgerAddresses(startingIndex, numAddresses, change)
  }

  async getConnectedNetwork () {
    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const network = getAddressNetwork(walletPubKey.bitcoinAddress)
    return network
  }
}
