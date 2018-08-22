import Provider from '../../Provider'

import axios from 'axios'
import Transport from '@ledgerhq/hw-transport-node-hid'
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
    this._derivationPath = `44'/${this._coinType}'/0'/0/0`
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

  async _getSpendingDetails (config = { segwit: false }) {
    const purpose = config.segwit ? '49' : '44'
    let unspentOutputs = []
    let unusedAddress
    let addressIndex = 0
    let addressHasTransactions = true
    while (addressHasTransactions) {
      const path = `${purpose}'/${this._coinType}'/0'/0/${addressIndex}`
      const address = {
        ...(await this._ledgerBtc.getWalletPublicKey(path, false, config.segwit)),
        path
      }
      const addressDetails = await this._getAddressDetails(address.bitcoinAddress)
      addressHasTransactions = addressDetails.n_tx > 0
      if (addressHasTransactions) {
        const utxos = (await this._getUnspentTransactions(address.bitcoinAddress)).map(utxo => ({
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
      ++addressIndex
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
    let numOutputsOffset = 0
    unspentOutputs.every((utxo) => {
      amountAccumulated += utxo.value
      unspentOutputsToUse.push(utxo)

      const fees = this._getFee(unspentOutputsToUse.length, numOutputs + numOutputsOffset, 3) // TODO: hardcoded satoshi per byte
      let totalCost = amount + fees

      if (numOutputsOffset === 0 && amountAccumulated > totalCost) {
        totalCost -= fees
        totalCost += this._getFee(unspentOutputsToUse.length, numOutputs + 1, 3) // TODO: hardcoded satoshi per byte
        numOutputsOffset = 1
      }

      return amountAccumulated < totalCost
    })
    return unspentOutputsToUse
  }

  async _getLedgerInputs (unspentOutputs) {
    const ledgerInputs = unspentOutputs.map(async utxo => {
      const transactionHex = await this._getTransactionHex(utxo.tx_hash_big_endian)
      const tx = await this._ledgerBtc.splitTransaction(transactionHex)
      return [tx, utxo.tx_output_n]
    })
    return Promise.all(ledgerInputs)
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

  async getAddresses (config = { segwit: false }) {
    await this._connectToLedger()

    let addresses = []
    const { unusedAddress, unspentOutputs } = await this._getSpendingDetails(config)

    const unspentAddresses = unspentOutputs.reduce((acc, detail) => (
      acc[acc.length - 1] === detail.address ? acc : acc.concat(detail.address)
    ), [])
    addresses.push(...unspentAddresses, unusedAddress.address)

    return addresses
  }

  async signMessage (message) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    return this._ledgerBtc.signMessageNew(this._derivationPath, hex)
  }

  async sendTransaction (from, to, value, data) {
    await this._connectToLedger()

    const { unusedAddress, unspentOutputs } = await this._getSpendingDetails()
    const unspentOutputsToUse = this._getUnspentOutputsForAmount(unspentOutputs, value, to.length)
    const totalAmount = unspentOutputsToUse.reduce((acc, utxo) => acc + utxo.value, 0)
    const fee = this._getFee(unspentOutputsToUse.length, to.length, 3) // TODO: satoshi per byte fee
    let totalCost = value + fee
    let hasChange = false

    if (totalAmount > totalCost) {
      totalCost -= fee
      totalCost += this._getFee(unspentOutputsToUse.length, to.length + 1, 3) // TODO: satoshi per byte fee
      hasChange = true
    }

    if (totalAmount < totalCost) {
      throw new Error('Not enough balance')
    }

    const ledgerInputs = await this._getLedgerInputs(unspentOutputsToUse)
    const paths = unspentOutputsToUse.map(utxo => utxo.path)

    const sendAmount = value
    const changeAmount = totalAmount - totalCost

    const sendPubKeyHash = addressToPubKeyHash(to)
    const changePubKeyHash = addressToPubKeyHash(unusedAddress.address)

    const sendP2PKHScript = [
      '76', // OP_DUP
      'a9', // OP_HASH160
      '14', // data size to be pushed
      sendPubKeyHash, // <PUB_KEY_HASH>
      '88', // OP_EQUALVERIFY
      'ac' // OP_CHECKSIG
    ].join('')

    const changeP2PKHScript = [
      '76', // OP_DUP
      'a9', // OP_HASH160
      '14', // data size to be pushed
      changePubKeyHash, // <PUB_KEY_HASH>
      '88', // OP_EQUALVERIFY
      'ac' // OP_CHECKSIG
    ].join('')

    let outputs = [{ amount: this._getAmountBuffer(sendAmount), script: Buffer.from(sendP2PKHScript, 'hex') }]
    if (hasChange) {
      outputs.push({ amount: this._getAmountBuffer(changeAmount), script: Buffer.from(changeP2PKHScript, 'hex') })
    }

    const serializedOutputs = this._ledgerBtc.serializeTransactionOutputs({ outputs })

    const signedTransaction = await this._ledgerBtc.createPaymentTransactionNew(ledgerInputs, paths, unusedAddress.path, serializedOutputs)

    return this.getMethod('sendRawTransaction')(signedTransaction)
  }
}
