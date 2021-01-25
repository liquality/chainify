import JsonRpcProvider from '@liquality/jsonrpc-provider'
import { addressToString } from '@liquality/utils'
import { normalizeTransactionObject, decodeRawTransaction } from '@liquality/bitcoin-utils'
import { TxNotFoundError, BlockNotFoundError } from '@liquality/errors'

import { isArray, flatten } from 'lodash'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

export default class BitcoinRpcProvider extends JsonRpcProvider {
  constructor (uri, username, password, numberOfBlockConfirmation = 1, defaultFeePerByte = 3) {
    super(uri, username, password)
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte
    this._usedAddressCache = {}
  }

  async decodeRawTransaction (rawTransaction) {
    const data = await this.jsonrpc('decoderawtransaction', rawTransaction)
    const { txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)
    const output = { hash, value, _raw: { hex: rawTransaction, ...data } }
    return output
  }

  async getFeePerByte (numberOfBlocks = this._numberOfBlockConfirmation) {
    try {
      const { feerate } = await this.jsonrpc('estimatesmartfee', numberOfBlocks)

      if (feerate && feerate > 0) {
        return Math.ceil((feerate * 1e8) / 1000)
      }

      throw new Error('Invalid estimated fee')
    } catch (e) {
      return this._defaultFeePerByte
    }
  }

  async getMinRelayFee () {
    const { relayfee } = await this.jsonrpc('getnetworkinfo')
    return relayfee * 1e8 / 1000
  }

  async isAddressUsed (address) {
    address = addressToString(address)

    if (this._usedAddressCache[address]) return true

    const amountReceived = await this.getReceivedByAddress(address)
    const isUsed = amountReceived > 0

    if (isUsed) this._usedAddressCache[address] = true

    return isUsed
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [ addresses ]
    }

    const _utxos = await this.getUnspentTransactions(addresses)
    const utxos = flatten(_utxos)

    return utxos
      .reduce((acc, utxo) => acc.plus(utxo.satoshis), new BigNumber(0))
  }

  async getUnspentTransactions (addresses) {
    addresses = addresses.map(addressToString)
    const utxos = await this.jsonrpc('listunspent', 0, 9999999, addresses)
    return utxos.map(utxo => ({ ...utxo, satoshis: BigNumber(utxo.amount).times(1e8).toNumber() }))
  }

  async getAddressTransactionCounts (addresses) {
    const receivedAddresses = await this.jsonrpc('listreceivedbyaddress', 0, false, true)
    return addresses.reduce((acc, addr) => {
      const receivedAddress = receivedAddresses.find(receivedAddress => receivedAddress.address === addressToString(addr))
      const transactionCount = receivedAddress ? receivedAddress.txids.length : 0
      acc[addressToString(addr)] = transactionCount
      return acc
    }, {})
  }

  async getReceivedByAddress (address) {
    address = addressToString(address)
    return this.jsonrpc('getreceivedbyaddress', address)
  }

  async importAddresses (addresses) {
    const request = addresses.map(address => ({ scriptPubKey: { address }, timestamp: 0 }))
    return this.jsonrpc('importmulti', request)
  }

  async getTransactionHex (transactionHash) {
    return this.jsonrpc('getrawtransaction', transactionHash)
  }

  async generateBlock (numberOfBlocks) {
    const miningAddressLabel = 'miningAddress'
    let address
    try { // Avoid creating 100s of addresses for mining
      const labelAddresses = await this._rpc.jsonrpc('getaddressesbylabel', miningAddressLabel)
      address = Object.keys(labelAddresses)[0]
    } catch (e) { // Label does not exist
      address = await this.jsonrpc('getnewaddress', miningAddressLabel)
    }
    return this.jsonrpc('generatetoaddress', numberOfBlocks, address)
  }

  async getBlockByHash (blockHash, includeTx = false) {
    let data

    try {
      data = await this.jsonrpc('getblock', blockHash)
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('Block not found')) {
        const { name, message, ...attrs } = e
        throw new BlockNotFoundError(`Block not found: ${blockHash}`, attrs)
      }

      throw e
    }

    const {
      hash,
      height: number,
      mediantime: timestamp,
      difficulty,
      size,
      previousblockhash: parentHash,
      nonce,
      confirmations
    } = data
    let { tx: transactions } = data

    if (includeTx) {
      const txs = transactions.map(this.getMethod('getTransactionByHash'))
      transactions = await Promise.all(txs)
    }

    return {
      hash,
      number,
      timestamp,
      difficulty: parseFloat(BigNumber(difficulty).toFixed()),
      size,
      parentHash,
      nonce,
      transactions,
      confirmations
    }
  }

  async getBlockByNumber (blockNumber, includeTx) {
    let blockHash

    try {
      blockHash = await this.jsonrpc('getblockhash', blockNumber)
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('Block height out of range')) {
        const { name, message, ...attrs } = e
        throw new BlockNotFoundError(`Block not found: ${blockNumber}`, attrs)
      }

      throw e
    }

    return this.getBlockByHash(blockHash, includeTx)
  }

  async getBlockHeight () {
    return this.jsonrpc('getblockcount')
  }

  async getTransactionByHash (transactionHash) {
    try {
      const tx = await this.getRawTransactionByHash(transactionHash, true, true)
      return tx
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('No such mempool transaction')) {
        const { name, message, ...attrs } = e
        throw new TxNotFoundError(`Transaction not found: ${transactionHash}`, attrs)
      }

      throw e
    }
  }

  async getTransactionFee (tx) {
    const isCoinbaseTx = tx.vin.find(vin => vin.coinbase)
    if (isCoinbaseTx) return // Coinbase transactions do not have a fee

    const inputs = tx.vin.map((vin) => ({ txid: vin.txid, vout: vin.vout }))
    const inputTransactions = await Promise.all(
      inputs.map(input => this.jsonrpc('getrawtransaction', input.txid, 1))
    )

    const inputValues = inputTransactions.map((inputTx, index) => {
      const vout = inputs[index].vout
      const output = inputTx.vout[vout]
      return output.value * 1e8
    })
    const inputValue = inputValues.reduce((a, b) => a.plus(BigNumber(b)), BigNumber(0))
    const outputValue = tx.vout.reduce((a, b) => a.plus(BigNumber(b.value).times(BigNumber(1e8))), BigNumber(0))
    const feeValue = inputValue.minus(outputValue)
    return feeValue.toNumber()
  }

  async getRawTransactionByHash (transactionHash, decode = false, addFees = false) {
    const tx = await this.jsonrpc('getrawtransaction', transactionHash, decode ? 1 : 0)
    if (!decode) return tx

    return normalizeTransactionObject(
      tx,
      addFees ? (await this.getTransactionFee(tx)) : undefined,
      tx.confirmations > 0 ? (await this.getBlockByHash(tx.blockhash)) : undefined
    )
  }

  async sendRawTransaction (rawTransaction) {
    return this.jsonrpc('sendrawtransaction', rawTransaction)
  }

  async sendBatchTransaction (transactions) {
    let outputs = {}
    for (const tx of transactions) {
      outputs[addressToString(tx.to)] = BigNumber(tx.value).dividedBy(1e8).toNumber()
    }
    const rawTxOutputs = await this.createRawTransaction([], outputs)
    const rawTxFunded = await this.fundRawTransaction(rawTxOutputs)
    const rawTxSigned = await this.signRawTransaction(rawTxFunded.hex)
    const fee = BigNumber(rawTxFunded.fee).times(1e8).toNumber()
    await this.sendRawTransaction(rawTxSigned.hex)
    return normalizeTransactionObject(decodeRawTransaction(rawTxSigned.hex), fee)
  }

  async signRawTransaction (hexstring, prevtxs, privatekeys, sighashtype) {
    return this.jsonrpc('signrawtransactionwithwallet', hexstring, prevtxs, privatekeys)
  }

  async createRawTransaction (transactions, outputs) {
    return this.jsonrpc('createrawtransaction', transactions, outputs)
  }

  async fundRawTransaction (hexstring) {
    return this.jsonrpc('fundrawtransaction', hexstring)
  }
}

BitcoinRpcProvider.version = version
