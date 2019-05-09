import '@babel/polyfill/noConflict'

import { BigNumber } from 'bignumber.js'
import bip32 from 'bip32'
import coinselect from 'coinselect'

import Bitcoin from '@ledgerhq/hw-app-btc'

import LedgerProvider from '@liquality/ledger-provider'
import {
  base58,
  padHexStart
} from '@liquality/crypto'
import {
  pubKeyToAddress,
  addressToPubKeyHash,
  compressPubKey,
  getAddressNetwork
} from '@liquality/bitcoin-utils'
import networks from '@liquality/bitcoin-networks'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

const ADDRESS_GAP = 20
const NONCHANGE_ADDRESS = 0
const CHANGE_ADDRESS = 1
const NONCHANGE_OR_CHANGE_ADDRESS = 2

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
    address = addressToString(address)

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
        addrList = addrList.concat(changeAddresses)
      } else {
        changeAddresses = []
      }

      if (addressCountMap.nonChange < ADDRESS_GAP) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      let [ confirmedAdd, utxosMempool, utxos ] = await Promise.all([
        this.getMethod('getAddressBalances')(addrList),
        this.getMethod('getAddressMempool')(addrList),
        this.getMethod('getAddressUtxos')(addrList)
      ])

      const usedAddresses = confirmedAdd.concat(utxosMempool)
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
          const addr = addrList.find(a => a.equals(utxo.address))

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

      for (let address of addrList) {
        const isUsed = usedAddresses.find(a => address.equals(a))
        const isChangeAddress = changeAddresses.find(a => address.equals(a))
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
      const addresses = await this.getAddresses(addressIndex, numAddressPerCall)
      const addressDeltas = await this.getMethod('getAddressDeltas')(addresses)

      addressDeltas.forEach((delta) => {
        const addressIndex = addresses.findIndex(address => address.equals(delta.address))
        if (addresses[addressIndex].balance === undefined) { addresses[addressIndex].balance = 0 }
        addresses[addressIndex].balance += delta.satoshis
        balance += delta.satoshis
      })

      addresses.forEach((address) => {
        if (!unusedAddress) {
          if (address.balance === undefined) {
            unusedAddress = addressToString(address)
          } else {
            usedAddresses.push(addressToString(address))
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
      const changeScript = this.createScript(unusedAddress)
      outputs.push({ amount: this.getAmountBuffer(change), script: Buffer.from(changeScript, 'hex') })
    }

    const serializedOutputs = app.serializeTransactionOutputs({ outputs }).toString('hex')
    const signedTransaction = await app.createPaymentTransactionNew(
      ledgerInputs,
      paths,
      unusedAddress.derivationPath,
      serializedOutputs
    )
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

      addresses.push(new Address({
        address,
        publicKey: publicKey.toString('hex'),
        derivationPath: path,
        index: currentIndex
      }))
    }

    return addresses
  }

  async _getUsedUnusedAddresses (numAddressPerCall = 100, addressType) {
    const usedAddresses = []
    const addressCountMap = { change: 0, nonChange: 0 }
    const unusedAddressMap = { change: null, nonChange: null }

    let addrList
    let addressIndex = 0
    let changeAddresses = []
    let nonChangeAddresses = []

    /* eslint-disable no-unmodified-loop-condition */
    while (
      (addressType === NONCHANGE_OR_CHANGE_ADDRESS && (
        addressCountMap.change < ADDRESS_GAP || addressCountMap.nonChange < ADDRESS_GAP)
      ) ||
      (addressType === NONCHANGE_ADDRESS && addressCountMap.nonChange < ADDRESS_GAP) ||
      (addressType === CHANGE_ADDRESS && addressCountMap.change < ADDRESS_GAP)
    ) {
      /* eslint-enable no-unmodified-loop-condition */
      addrList = []

      if ((addressType === NONCHANGE_OR_CHANGE_ADDRESS || addressType === CHANGE_ADDRESS) &&
           addressCountMap.change < ADDRESS_GAP) {
        // Scanning for change addr
        changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        addrList = addrList.concat(changeAddresses)
      } else {
        changeAddresses = []
      }

      if ((addressType === NONCHANGE_OR_CHANGE_ADDRESS || addressType === NONCHANGE_ADDRESS) &&
           addressCountMap.nonChange < ADDRESS_GAP) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      const [ confirmedAdd, utxosMempool ] = await Promise.all([
        this.getMethod('getAddressBalances')(addrList),
        this.getMethod('getAddressMempool')(addrList)
      ])
      const totalUsedAddresses = confirmedAdd.concat(utxosMempool)

      for (let address of addrList) {
        const isUsed = totalUsedAddresses.find(a => address.equals(a))
        const isChangeAddress = changeAddresses.find(a => address.equals(a))
        const key = isChangeAddress ? 'change' : 'nonChange'

        if (isUsed) {
          usedAddresses.push(address)
          addressCountMap[key] = 0
          unusedAddressMap[key] = null
        } else {
          addressCountMap[key]++

          if (!unusedAddressMap[key]) {
            unusedAddressMap[key] = address
          }
        }
      }

      addressIndex += numAddressPerCall
    }

    let firstUnusedAddress
    const indexNonChange = unusedAddressMap.nonChange ? unusedAddressMap.nonChange.index : Infinity
    const indexChange = unusedAddressMap.change ? unusedAddressMap.change.index : Infinity

    if (indexNonChange <= indexChange) firstUnusedAddress = unusedAddressMap.nonChange
    else firstUnusedAddress = unusedAddressMap.change

    return {
      usedAddresses,
      unusedAddress: unusedAddressMap,
      firstUnusedAddress
    }
  }

  async getUsedAddresses (numAddressPerCall = 100) {
    return this._getUsedUnusedAddresses(numAddressPerCall, NONCHANGE_OR_CHANGE_ADDRESS)
      .then(({ usedAddresses }) => usedAddresses)
  }

  async getUnusedAddress (change = false, numAddressPerCall = 100) {
    const addressType = change ? CHANGE_ADDRESS : NONCHANGE_ADDRESS
    const key = change ? 'change' : 'nonChange'
    return this._getUsedUnusedAddresses(numAddressPerCall, addressType)
      .then(({ unusedAddress }) => unusedAddress[key])
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

BitcoinLedgerProvider.version = version
BitcoinLedgerProvider.addressType = {
  NONCHANGE_ADDRESS,
  CHANGE_ADDRESS,
  NONCHANGE_OR_CHANGE_ADDRESS
}
