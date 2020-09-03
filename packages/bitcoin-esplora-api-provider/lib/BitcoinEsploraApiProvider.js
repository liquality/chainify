import axios from 'axios'
import Provider from '@liquality/provider'
import { isArray, flatten } from 'lodash'
import { decodeRawTransaction, normalizeTransactionObject } from '@liquality/bitcoin-utils'
import BigNumber from 'bignumber.js'

import { addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class BitcoinEsploraApiProvider extends Provider {
  constructor (url, network, numberOfBlockConfirmation = 1, defaultFeePerByte = 3) {
    super()
    this.url = url
    this._network = network
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte

    this._axios = axios.create({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  async getFeePerByte (numberOfBlocks = this._numberOfBlockConfirmation) {
    try {
      const feeEstimates = (await this._axios('/fee-estimates')).data
      const blockOptions = Object.keys(feeEstimates)
      const closestBlockOption = blockOptions.reduce((prev, curr) => {
        return Math.abs(prev - numberOfBlocks) < Math.abs(curr - numberOfBlocks) ? prev : curr
      })
      const rate = Math.round(feeEstimates[closestBlockOption])
      return rate
    } catch (e) {
      return this._defaultFeePerByte
    }
  }

  async getMinRelayFee () {
    return 1
  }

  async isAddressUsed (address) {
    const amountReceived = await this.getReceivedByAddress(address)

    return amountReceived > 0
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

  async _getUnspentTransactions (address) {
    const response = await this._axios.get(`/address/${addressToString(address)}/utxo`)
    return response.data.map(utxo => ({
      ...utxo,
      address: addressToString(address),
      satoshis: utxo.value,
      amount: BigNumber(utxo.value).dividedBy(1e8).toNumber(),
      blockHeight: utxo.status.block_height
    }))
  }

  async getUnspentTransactions (addresses) {
    const utxoSets = await Promise.all(addresses.map(addr => this._getUnspentTransactions(addr)))
    const utxos = flatten(utxoSets)
    return utxos
  }

  async _getAddressTransactionCount (address) {
    const response = await this._axios.get(`/address/${addressToString(address)}`)
    return response.data.chain_stats.tx_count + response.data.mempool_stats.tx_count
  }

  async getAddressTransactionCounts (addresses) {
    const transactionCountsArray = await Promise.all(addresses.map(async (addr) => {
      const txCount = await this._getAddressTransactionCount(addr)
      return { [addr]: txCount }
    }))
    const transactionCounts = Object.assign({}, ...transactionCountsArray)
    return transactionCounts
  }

  async getTransactionHex (transactionHash) {
    const response = await this._axios.get(`/tx/${transactionHash}/hex`)
    return response.data
  }

  async getTransaction (transactionHash) {
    const response = await this._axios.get(`/tx/${transactionHash}`)
    const currentHeight = await this.getBlockHeight()
    return this.formatTransaction(response.data, currentHeight)
  }

  async formatTransaction (tx, currentHeight) {
    const hex = await this.getTransactionHex(tx.txid)
    const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0
    const decodedTx = decodeRawTransaction(hex, this._network)
    decodedTx.confirmations = confirmations
    return normalizeTransactionObject(decodedTx, tx.fee, { hash: tx.status.block_hash, number: tx.status.block_height })
  }

  async getBlockByHash (blockHash) {
    const response = await this._axios.get(`/block/${blockHash}`)
    const data = response.data
    const {
      id: hash,
      height: number,
      timestamp,
      // difficulty,
      size,
      previousblockhash: parentHash,
      nonce
    } = data

    return {
      hash,
      number,
      timestamp,
      size,
      parentHash,
      nonce
    }
  }

  async getBlockHash (blockNumber) {
    const response = await this._axios.get(`/block-height/${blockNumber}`)
    return response.data
  }

  async getBlockByNumber (blockNumber) {
    return this.getBlockByHash(await this.getBlockHash(blockNumber))
  }

  async getBlockHeight () {
    const response = await this._axios.get('/blocks/tip/height')
    return parseInt(response.data)
  }

  async getTransactionByHash (transactionHash) {
    return this.getRawTransactionByHash(transactionHash, true)
  }

  async getRawTransactionByHash (transactionHash, decode = false) {
    return decode ? this.getTransaction(transactionHash) : this.getTransactionHex(transactionHash)
  }

  async sendRawTransaction (rawTransaction) {
    const response = await this._axios.post('/tx', rawTransaction)
    return response.data
  }
}

BitcoinEsploraApiProvider.version = version
