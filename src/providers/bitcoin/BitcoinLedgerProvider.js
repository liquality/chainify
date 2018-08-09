import Provider from '../../Provider'

import axios from 'axios'
import Transport from '@alias/ledger-transport'
import LedgerBtc from '@ledgerhq/hw-app-btc'
import { BigNumber } from 'bignumber.js'

import { addressToPubKeyHash } from './BitcoinUtil'
import networks from '../../networks'

// TODO: Abstract out non signing methods into another provider?
export default class BitcoinLedgerProvider extends Provider {
  /**
   * @param {boolean} testnet True if the testnet network is being used
   */
  constructor (chain = { network: networks.bitcoin }) {
    super()
    this._ledgerBtc = false
    this._blockChainInfoBaseUrl = chain.network.explorerUrl
    this._coinType = chain.network.coinType
  }

  async _connectToLedger () {
    if (!this._ledgerBtc) {
      const transport = await Transport.create()
      this._ledgerBtc = new LedgerBtc(transport)
    }
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

  async _getSpendingDetails (segwit = false) {
    const purpose = segwit ? '49' : '44'
    let unspentOutputs = []
    let unusedAddress
    let addressIndex = 0
    for (let addressHasTransactions = true; addressHasTransactions; ++addressIndex) {
      const path = `${purpose}'/${this._coinType}'/0'/0/${addressIndex}`
      const address = {
        ...(await this._ledgerBtc.getWalletPublicKey(path, false, segwit)),
        path
      }
      const addressDetails = await this._getAddressDetails(address.bitcoinAddress)
      addressHasTransactions = addressDetails.n_tx > 0
      if (addressHasTransactions) {
        let utxos = await this._getUnspentTransactions(address.bitcoinAddress)
        utxos = utxos.map((utxo) => ({
          ...utxo,
          address: address.bitcoinAddress,
          path
        }))
        unspentOutputs.push(...utxos)
      } else {
        unusedAddress = {
          address: address.bitcoinAddress,
          path
        }
      }
    }

    return {
      unusedAddress,
      unspentOutputs
    }
  }

  _getFee (numInputs, numOutputs, pricePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * pricePerByte
  }

  _getUnspentOutputsForAmount (unspentOutputs, amount, numOutputs) {
    let unspentOutputsToUse = []
    let amountAccumulated = 0
    unspentOutputs.every((utxo) => {
      amountAccumulated += utxo.value
      unspentOutputsToUse.push(utxo)
      return amountAccumulated < (amount + this._getFee(unspentOutputsToUse.length, numOutputs, 3)) // TODO: hardcoded satoshi per byte
    })
    return unspentOutputsToUse
  }

  async _getLedgerInputs (unspentOutputs) {
    const ledgerInputs = []
    for (let unspentOutput of unspentOutputs) {
      const transactionHex = await this._getTransactionHex(unspentOutput.tx_hash_big_endian)
      const tx = await this._ledgerBtc.splitTransaction(transactionHex)
      ledgerInputs.push([tx, unspentOutput.tx_output_n])
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

  async getAddresses (segwit = false) {
    await this._connectToLedger()

    const addresses = []
    const { unusedAddress, unspentOutputs } = await this._getSpendingDetails(segwit)

    const unspentAddresses = unspentOutputs.reduce((acc, detail) => (
      acc[acc.length - 1] === detail.address ? acc : acc.concat(detail.address)
    ), [])
    addresses.push(...unspentAddresses, unusedAddress.address)

    return addresses
  }

  async signMessage (message, path) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    return this._ledgerBtc.signMessageNew(path, hex)
  }

  async sendTransaction (from, to, value, data) {
    await this._connectToLedger()

    const { unusedAddress, unspentOutputs } = await this._getSpendingDetails()
    const unspentOutputsToUse = this._getUnspentOutputsForAmount(unspentOutputs, value, 2)
    const fee = this._getFee(unspentOutputsToUse.length, 2, 3) // TODO: hardcoded num outputs + satoshi per byte fee
    const totalAmount = unspentOutputsToUse.reduce((acc, utxo) => acc + utxo.value, 0)

    if (totalAmount < value + fee) {
      throw new Error('Not enough balance')
    }

    const ledgerInputs = await this._getLedgerInputs(unspentOutputsToUse)
    const paths = unspentOutputsToUse.map(utxo => utxo.path)

    const sendAmount = value
    const changeAmount = totalAmount - value - fee

    const sendPubKeyHash = addressToPubKeyHash(to)
    const changePubKeyHash = addressToPubKeyHash(unusedAddress.address)

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
      { amount: this._getAmountBuffer(sendAmount), script: Buffer.from(sendP2PKHScript, 'hex') },
      { amount: this._getAmountBuffer(changeAmount), script: Buffer.from(changeP2PKHScript, 'hex') }
    ]

    const serializedOutputs = this._ledgerBtc.serializeTransactionOutputs({ outputs })

    const signedTransaction = await this._ledgerBtc.createPaymentTransactionNew(ledgerInputs, paths, unusedAddress.path, serializedOutputs)

    return this.getMethod('sendRawTransaction')(signedTransaction)
  }
}
