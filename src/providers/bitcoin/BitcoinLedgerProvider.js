import Provider from '../../Provider'

import axios from 'axios'
import Transport from '@alias/ledger-transport'
import LedgerBtc from '@ledgerhq/hw-app-btc'
import { BigNumber } from 'bignumber.js'

import crypto from '../../crypto'

// TODO: Abstract out non signing methods into another provider?
export default class BitcoinLedgerProvider extends Provider {
  /**
   * @param {boolean} testnet True if the testnet network is being used
   */
  constructor (testnet = false) {
    super()
    this._ledgerBtc = false
    this._derivationPath = `44'/0'/0'/0`
    this._blockChainInfoBaseUrl = testnet ? 'https://testnet.blockchain.info' : 'https://blockchain.info'
  }

  async _connectToLedger () {
    if (!this._ledgerBtc) {
      const transport = await Transport.create()
      this._ledgerBtc = new LedgerBtc(transport)
    }
  }

  async _updateDerivationPath (path) {
    this._derivationPath = path
  }

  async _getAddressDetails (address) {
    return (await axios.get(`${this._blockChainInfoBaseUrl}/balance?active=${address}&cors=true`)).data[address]
  }

  async _getUnspentTransactions (address) {
    return (await axios.get(`${this._blockChainInfoBaseUrl}/unspent?active=${address}&cors=true`)).data.unspent_outputs
  }

  async _getTransactionHex (transactionHash) {
    return (await axios.get(`${this._blockChainInfoBaseUrl}/rawtx/${transactionHash}?format=hex&cors=true`)).data
  }

  async _getSpendingDetails () {
    let unspentInputs = []
    let unusedAddress
    let addressIndex = 0
    for (let addressHasTransactions = true; addressHasTransactions; ++addressIndex) {
      const path = `44'/0'/0'/${addressIndex}`
      const address = {
        ...(await this._ledgerBtc.getWalletPublicKey(path)),
        path
      }
      const addressDetails = await this._getAddressDetails(address.bitcoinAddress)
      addressHasTransactions = addressDetails.n_tx > 0
      if (addressHasTransactions) {
        let utxos = await this._getUnspentTransactions(address.bitcoinAddress)
        utxos = utxos.map((utxo) => ({
          ...utxo,
          path,
          address: address.bitcoinAddress
        }))
        unspentInputs.push(...utxos)
      } else {
        unusedAddress = address
      }
    }

    return {
      unusedAddress,
      unspentInputs
    }
  }

  _getFee (numInputs, numOutputs, pricePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * pricePerByte
  }

  _getUnspentInputsForAmount (unspentInputs, amount, numOutputs) {
    let unspentInputsToUse = []
    let amountAccumulated = 0
    unspentInputs.every((utxo) => {
      amountAccumulated += utxo.value
      unspentInputsToUse.push(utxo)
      return amountAccumulated < (amount + this._getFee(unspentInputsToUse.length, numOutputs, 3)) // TODO: hardcoded satoshi per byte
    })
    return unspentInputsToUse
  }

  async _getLedgerInputs (unspentInputs) {
    const ledgerInputs = []
    for (let unspentInput of unspentInputs) {
      const transactionHex = await this._getTransactionHex(unspentInput.tx_hash_big_endian)
      const tx = await this._ledgerBtc.splitTransaction(transactionHex)
      ledgerInputs.push([tx, unspentInput.tx_output_n])
    }
    return ledgerInputs
  }

  _getAmountBuffer (amount) {
    let hexAmount = BigNumber(amount).toString(16)
    if (hexAmount.length % 2 === 1) { // Pad with 0 if required
      hexAmount = '0' + hexAmount
    }
    const valueBuffer = Buffer.from(hexAmount, 'hex')
    const buffer = Buffer.alloc(8)
    valueBuffer.copy(buffer, 8 - valueBuffer.length) // Pad to 8 bytes
    return buffer.reverse() // Amount needs to be little endian
  }

  _addressToPubKeyHash (address) {
    return crypto.base58.decode(address).toString('hex').substring(2, 42)
  }

  async getAddresses () {
    await this._connectToLedger()

    const { bitcoinAddress } = await this._ledgerBtc.getWalletPublicKey(this._derivationPath)

    return [ bitcoinAddress ]
  }

  async signMessage (message, from) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    return this._ledgerBtc.signMessageNew(this._derivationPath, hex)
  }

  async sendTransaction (from, to, value, data) {
    await this._connectToLedger()

    const {unusedAddress, unspentInputs} = await this._getSpendingDetails()
    const unspentInputsToUse = this._getUnspentInputsForAmount(unspentInputs, value, 2)
    const fee = this._getFee(unspentInputsToUse.length, 2, 3) // TODO: hardcoded num outputs + satoshi per byte fee
    const totalAmount = unspentInputsToUse.reduce((acc, input) => acc + input.value, 0)

    if (totalAmount < value + fee) {
      throw new Error('Not enough balance')
    }

    const ledgerInputs = await this._getLedgerInputs(unspentInputsToUse)
    const paths = unspentInputsToUse.map(input => input.path)

    const sendAmount = value
    const changeAmount = totalAmount - value - fee

    const sendPubKeyHash = this._addressToPubKeyHash(to)
    const changePubKeyHash = this._addressToPubKeyHash(unusedAddress.bitcoinAddress)

    const sendP2PKHScript = [
      '76', // OP_DUP
      'a9', // OP_HASH160
      '14', // data size to be pushed
      sendPubKeyHash, // <PUB_KEY_HASH>
      '88', // OP_EQUAL_VERIFY
      'ac' // OP_CHECKSIG
    ].join('')

    const changeP2PKHScript = [
      '76', // OP_DUP
      'a9', // OP_HASH160
      '14', // data size to be pushed
      changePubKeyHash, // <PUB_KEY_HASH>
      '88', // OP_EQUAL_VERIFY
      'ac' // OP_CHECKSIG
    ].join('')

    const outputs = [
      {amount: this._getAmountBuffer(sendAmount), script: Buffer.from(sendP2PKHScript, 'hex')},
      {amount: this._getAmountBuffer(changeAmount), script: Buffer.from(changeP2PKHScript, 'hex')}
    ]

    const serializedOutputs = this._ledgerBtc.serializeTransactionOutputs({ outputs })

    const signedTransaction = await this._ledgerBtc.createPaymentTransactionNew(ledgerInputs, paths, unusedAddress.path, serializedOutputs)

    return this.getMethod('sendRawTransaction')(signedTransaction)
  }
}
