import { BigNumber } from 'bignumber.js'
import { fromPublicKey } from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'

import LedgerProvider from '@liquality/ledger-provider'
import HwAppBitcoin from '@ledgerhq/hw-app-btc'

import {
  padHexStart
} from '@liquality/crypto'
import {
  compressPubKey,
  getAddressNetwork,
  AddressTypes,
  selectCoins
} from '@liquality/bitcoin-utils'
import networks from '@liquality/bitcoin-networks'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

const ADDRESS_GAP = 20
const NONCHANGE_ADDRESS = 0
const CHANGE_ADDRESS = 1
const NONCHANGE_OR_CHANGE_ADDRESS = 2

const ADDRESS_TYPE_TO_LEDGER_PREFIX = {
  'legacy': 44,
  'p2sh-segwit': 49,
  'bech32': 84
}

export default class BitcoinLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.bitcoin }, addressType = 'bech32') {
    if (!AddressTypes.includes(addressType)) {
      throw new Error(`addressType must be one of ${AddressTypes.join(',')}`)
    }
    const derivationPath = `${ADDRESS_TYPE_TO_LEDGER_PREFIX[addressType]}'/${chain.network.coinType}'/0'/`
    super(HwAppBitcoin, derivationPath, chain.network, 'BTC')
    this._addressType = addressType
    this._derivationPath = derivationPath
    this._network = chain.network
    this._walletPublicKeyCache = {}
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    return app.signMessageNew(address.derivationPath, hex)
  }

  async _buildTransaction (_outputs) {
    const app = await this.getApp()

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change } = await this.getInputsForAmount(_outputs)
    const ledgerInputs = await this.getLedgerInputs(inputs)
    const paths = inputs.map(utxo => utxo.derivationPath)

    const outputs = _outputs.map(output => {
      const outputScript = Buffer.isBuffer(output.to) ? output.to : bitcoin.address.toOutputScript(output.to, this._network) // Allow for OP_RETURN
      return { amount: this.getAmountBuffer(output.value), script: outputScript }
    })

    if (change) {
      outputs.push({
        amount: this.getAmountBuffer(change.value),
        script: bitcoin.address.toOutputScript(addressToString(unusedAddress), this._network)
      })
    }

    const serializedOutputs = app.serializeTransactionOutputs({ outputs }).toString('hex')

    return app.createPaymentTransactionNew(
      ledgerInputs,
      paths,
      unusedAddress.derivationPath,
      serializedOutputs,
      undefined,
      undefined,
      ['bech32', 'p2sh-segwit'].includes(this._addressType),
      undefined,
      this._addressType === 'bech32' ? ['bech32'] : undefined
    )
  }

  async buildTransaction (to, value, data, from) {
    return this._buildTransaction([{ to, value }])
  }

  async buildBatchTransaction (transactions) {
    return this._buildTransaction(transactions)
  }

  async _sendTransaction (transactions) {
    const signedTransaction = await this._buildTransaction(transactions)
    return this.getMethod('sendRawTransaction')(signedTransaction)
  }

  async sendTransaction (to, value, data, from) {
    return this._sendTransaction([{ to, value }])
  }

  async sendBatchTransaction (transactions) {
    return this._sendTransaction(transactions)
  }

  async signP2SHTransaction (inputTxHex, tx, address, vout, outputScript, lockTime = 0, segwit = false) {
    const app = await this.getApp()
    const walletAddress = await this.getWalletAddress(address)

    if (!segwit) {
      tx.setInputScript(vout.n, outputScript) // TODO: is this ok for p2sh-segwit??
    }

    const ledgerInputTx = await app.splitTransaction(inputTxHex, true)
    const ledgerTx = await app.splitTransaction(tx.toHex(), true)
    const ledgerOutputs = (await app.serializeTransactionOutputs(ledgerTx)).toString('hex')
    const ledgerSig = await app.signP2SHTransaction(
      [[ledgerInputTx, vout.n, outputScript.toString('hex'), 0]],
      [walletAddress.derivationPath],
      ledgerOutputs.toString('hex'),
      lockTime,
      undefined, // SIGHASH_ALL
      segwit,
      2
    )

    const finalSig = segwit ? ledgerSig[0] : ledgerSig[0] + '01' // Is this a ledger bug? Why non segwit signs need the sighash appended?
    const sig = Buffer.from(finalSig, 'hex')

    return sig
  }

  // inputs consists of [{ inputTxHex, index, vout, outputScript }]
  async signBatchP2SHTransaction (inputs, addresses, tx, lockTime = 0, segwit = false) {
    const app = await this.getApp()

    let walletAddressDerivationPaths = []
    for (const address of addresses) {
      const walletAddress = await this.getWalletAddress(address)
      walletAddressDerivationPaths.push(walletAddress.derivationPath)
    }

    if (!segwit) {
      for (const input of inputs) {
        tx.setInputScript(input.vout.n, input.outputScript)
      }
    }

    const ledgerTx = await app.splitTransaction(tx.toHex(), true)
    const ledgerOutputs = (await app.serializeTransactionOutputs(ledgerTx)).toString('hex')

    let ledgerInputs = []
    for (const input of inputs) {
      const ledgerInputTx = await app.splitTransaction(input.inputTxHex, true)
      ledgerInputs.push([ledgerInputTx, input.index, input.outputScript.toString('hex'), 0])
    }

    const ledgerSigs = await app.signP2SHTransaction(
      ledgerInputs,
      walletAddressDerivationPaths,
      ledgerOutputs.toString('hex'),
      lockTime,
      undefined,
      segwit,
      2
    )

    let finalLedgerSigs = []
    for (const ledgerSig of ledgerSigs) {
      const finalSig = segwit ? ledgerSig : ledgerSig + '01'
      finalLedgerSigs.push(Buffer.from(finalSig, 'hex'))
    }

    return finalLedgerSigs
  }

  getAmountBuffer (amount) {
    let hexAmount = BigNumber(Math.round(amount)).toString(16)
    hexAmount = padHexStart(hexAmount, 16)
    const valueBuffer = Buffer.from(hexAmount, 'hex')
    return valueBuffer.reverse()
  }

  async getInputsForAmount (_targets, numAddressPerCall = 100) {
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

      let utxos = await this.getMethod('getUnspentTransactions')(addrList)
      utxos = utxos.map(utxo => {
        const addr = addrList.find(a => a.equals(utxo.address))
        return {
          ...utxo,
          value: BigNumber(utxo.amount).times(1e8).toNumber(),
          derivationPath: addr.derivationPath
        }
      })

      const usedAddresses = []
      // const usedAddresses = confirmedAdd.concat(utxosMempool) // TODO: USED ADDRESSES
      // utxos = utxos // TODO: Filter out utxos in the mempool that have already been used? Does the node already do this?
      //   .filter(utxo => utxosMempool.filter(mempoolUtxo => utxo.txid === mempoolUtxo.prevtxid).length === 0)

      if (feePerByte === false) feePerByte = await feePerBytePromise
      const minRelayFee = await this.getMethod('getMinRelayFee')()

      const targets = _targets.map((target, i) => ({ id: 'main', value: target.value }))

      const { inputs, outputs, fee } = selectCoins(utxos, targets, Math.ceil(feePerByte), minRelayFee)

      if (inputs && outputs) {
        let change = outputs.find(output => output.id !== 'main')

        if (change && change.length) {
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
      return [ tx, utxo.vout ]
    }))
  }

  getAddressFromPublicKey (publicKey) {
    if (this._addressType === 'legacy') {
      return bitcoin.payments.p2pkh({ pubkey: publicKey, network: this._network }).address
    } else if (this._addressType === 'p2sh-segwit') {
      return bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this._network }),
        network: this._network }).address
    } else if (this._addressType === 'bech32') {
      return bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this._network }).address
    }
  }

  async _importAddresses () {
    const change = await this.getAddresses(0, 200, true)
    const nonChange = await this.getAddresses(0, 200, false)
    const all = [...nonChange, ...change].map(addressToString)
    await this.getMethod('importAddresses')(all)
  }

  async _getWalletPublicKey (path) {
    const app = await this.getApp()
    const format = this._addressType === 'p2sh-segwit' ? 'p2sh' : this._addressType
    return app.getWalletPublicKey(path, { format: format })
  }

  async getWalletPublicKey (path) {
    if (path in this._walletPublicKeyCache) {
      return this._walletPublicKeyCache[path]
    }

    const walletPublicKey = await this._getWalletPublicKey(path)
    this._walletPublicKeyCache[path] = walletPublicKey
    return walletPublicKey
  }

  async getLedgerAddresses (startingIndex, numAddresses, change = false) {
    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const compressedPubKey = compressPubKey(walletPubKey.publicKey)
    const node = fromPublicKey(
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
      const address = this.getAddressFromPublicKey(publicKey)
      const path = this._baseDerivationPath + subPath

      addresses.push(new Address({
        address,
        publicKey: publicKey,
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

      const transactionCounts = await this.getMethod('getAddressTransactionCounts')(addrList)

      for (let address of addrList) {
        const isUsed = transactionCounts[address] > 0
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
    // Bitcoin Ledger app does not distinguish between regtest & testnet
    if (this._network.name === networks.bitcoin_regtest.name &&
      network.name === networks.bitcoin_testnet.name) {
      return networks.bitcoin_regtest
    }
    return network
  }
}

BitcoinLedgerProvider.version = version
BitcoinLedgerProvider.addressType = {
  NONCHANGE_ADDRESS,
  CHANGE_ADDRESS,
  NONCHANGE_OR_CHANGE_ADDRESS
}
