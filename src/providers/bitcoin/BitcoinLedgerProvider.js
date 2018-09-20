import Provider from '../../Provider'

import Transport from '@ledgerhq/hw-transport-node-hid'
import LedgerBtc from '@ledgerhq/hw-app-btc'
import { BigNumber } from 'bignumber.js'
import { base58, padHexStart } from '../../crypto'
import { addressToPubKeyHash } from './BitcoinUtil'

import networks from '../../networks'

export default class BitcoinLedgerProvider extends Provider {
  /**
   * @param {boolean} testnet True if the testnet network is being used
   */
  constructor (chain = { network: networks.bitcoin, segwit: false }) {
    super()
    this._ledgerBtc = false
    this._network = chain.network
    this._segwit = chain.segwit
    this._blockChainInfoBaseUrl = chain.network.explorerUrl
    this._coinType = chain.network.coinType
    this._derivationPath = `44'/${this._coinType}'/0'/0/0`
    this._unusedAddressCountdown = 10
  }

  async _connectToLedger () {
    if (!this._ledgerBtc) {
      const transport = await Transport.create()
      this._ledgerBtc = new LedgerBtc(transport)
    }
  }

  async _getPubKey () {
    return this._ledgerBtc.getWalletPublicKey(this._derivationPath)
  }

  async _getSpendingDetails (addresses) {
    return Promise.all(addresses.map(async address => {
      const utxos = (await this.getMethod('getUnspentTransactions')(address.address)).map(utxo => ({
        ...utxo,
        ...address
      }))
      return {
        ...address,
        utxos,
        value: utxos.reduce((acc, utxo) => acc + utxo.value, 0)
      }
    }))
  }

  _getFee (numInputs, numOutputs, pricePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * pricePerByte
  }

  _getUnspentOutputsForAmount (unspentOutputs, amount, numOutputs) {
    let unspentOutputsToUse = []
    let amountAccumulated = 0
    let numOutputsOffset = 0
    unspentOutputs.every((utxo) => {
      amountAccumulated += utxo.value
      unspentOutputsToUse.push(utxo)

      const fees = this._getFee(unspentOutputsToUse.length, numOutputs + numOutputsOffset, 3) // TODO: hardcoded satoshi per byte
      let totalCost = amount + fees

      if (numOutputsOffset === 0 && amountAccumulated > totalCost) {
        numOutputsOffset = 1
        totalCost -= fees
        totalCost += this._getFee(unspentOutputsToUse.length, numOutputs + 1, 3) // TODO: hardcoded satoshi per byte
      }

      return amountAccumulated < totalCost
    })
    return unspentOutputsToUse
  }

  async _getLedgerInputs (unspentOutputs) {
    const ledgerInputs = unspentOutputs.map(async utxo => {
      const transactionHex = await this.getMethod('getTransactionHex')(utxo.tx_hash_big_endian)
      const tx = await this._ledgerBtc.splitTransaction(transactionHex, true)
      return [tx, utxo.tx_output_n]
    })
    return Promise.all(ledgerInputs)
  }

  _getAmountBuffer (amount) {
    // let hexAmount = BigNumber(amount).toString(16)
    // if (hexAmount.length % 2 === 1) { // Pad with 0 if required
    //   hexAmount = '0' + hexAmount
    // }
    // const valueBuffer = Buffer.from(hexAmount, 'hex')
    // const buffer = Buffer.alloc(8)
    // valueBuffer.copy(buffer, 8 - valueBuffer.length) // Pad to 8 bytes
    // return buffer.reverse() // Amount needs to be little endian

    let hexAmount = BigNumber(amount).toString(16)
    hexAmount = padHexStart(hexAmount, 16)
    const valueBuffer = Buffer.from(hexAmount, 'hex')
    return valueBuffer.reverse()
  }

  async _getAddressFromPath (path, segwit) {
    return (await this._ledgerBtc.getWalletPublicKey(path, false, segwit)).bitcoinAddress
  }

  async getAddresses (startingIndex = 0, numAddresses = 5, config = { segwit: false }) {
    await this._connectToLedger()

    const basePath = `${config.segwit ? '49' : '44'}'/${this._coinType}'/0'/0`
    const finalIndex = startingIndex + numAddresses

    const addresses = []
    let currentIndex = startingIndex

    while (currentIndex < finalIndex) {
      const path = `${basePath}/${currentIndex++}`
      addresses.push(await this._getAddressFromPath(path, config.segwit))
    }

    return addresses
  }

  async _getDerivationPathFromAddress (address, config) {
    let path = false
    let index = 0

    while (!path) {
      const addr = await this.getAddresses(index, 1)
      if (addr === address) path = `${config.segwit ? '49' : '44'}'/${this._coinType}'/0'/0/${index}`
      index++
    }

    return path
  }

  async signMessage (message, from, derivationPath, config = { segwit: false }) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    if (!derivationPath) {
      derivationPath = await this._getDerivationPathFromAddress(from, config)
    }

    return this._ledgerBtc.signMessageNew(derivationPath, hex)
  }

  async _splitTransaction (transactionHex, isSegwitSupported) {
    await this._connectToLedger()

    return this._ledgerBtc.splitTransaction(transactionHex, isSegwitSupported)
  }

  async _serializeTransactionOutputs (transactionHex) {
    await this._connectToLedger()

    return this._ledgerBtc.serializeTransactionOutputs(transactionHex)
  }

  async _signP2SHTransaction (inputs, associatedKeysets, changePath, outputScriptHex) {
    await this._connectToLedger()

    return this._ledgerBtc.signP2SHTransaction(inputs, associatedKeysets, changePath, outputScriptHex)
  }

  generateScript (address) {
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

  async sendTransaction (to, value, data, from) {
    await this._connectToLedger()

    const { unusedAddresses, usedAddresses } = await this._getAddresses()
    const unusedAddress = unusedAddresses[0]
    const utxosUsedAddresses = await this._getSpendingDetails(usedAddresses)
    const unspentOutputs = [].concat(...utxosUsedAddresses.map(detail => detail.utxos))
    const unspentOutputsToUse = this._getUnspentOutputsForAmount(unspentOutputs, value, 1)
    const totalAmount = unspentOutputsToUse.reduce((acc, utxo) => acc + utxo.value, 0)
    const fee = this._getFee(unspentOutputsToUse.length, 1, 3) // TODO: satoshi per byte fee
    let totalCost = value + fee
    let hasChange = false

    if (totalAmount > totalCost) {
      hasChange = true

      totalCost -= fee
      totalCost += this._getFee(unspentOutputsToUse.length, 2, 3) // TODO: satoshi per byte fee
    }

    if (totalAmount < totalCost) {
      throw new Error('Not enough balance')
    }

    const ledgerInputs = await this._getLedgerInputs(unspentOutputsToUse)
    const paths = unspentOutputsToUse.map(utxo => utxo.path)

    const sendAmount = value
    const changeAmount = totalAmount - totalCost

    const sendScript = this.generateScript(to)

    let outputs = [{ amount: this._getAmountBuffer(sendAmount), script: Buffer.from(sendScript, 'hex') }]

    if (hasChange) {
      const changeScript = this.generateScript(unusedAddress.address)
      outputs.push({ amount: this._getAmountBuffer(changeAmount), script: Buffer.from(changeScript, 'hex') })
    }

    const serializedOutputs = this._ledgerBtc.serializeTransactionOutputs({ outputs }).toString('hex')
    const signedTransaction = await this._ledgerBtc.createPaymentTransactionNew(ledgerInputs, paths, unusedAddress.path, serializedOutputs)

    return this.getMethod('sendRawTransaction')(signedTransaction)
  }
}
