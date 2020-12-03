import NodeProvider from '@liquality/node-provider'
import { decodeRawTransaction, normalizeTransactionObject } from '@liquality/bitcoin-utils'
import { addressToString } from '@liquality/utils'
import { TxNotFoundError, BlockNotFoundError } from '@liquality/errors'

import { isArray, flatten } from 'lodash'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

export default class BitcoinEsploraApiProvider extends NodeProvider {
  constructor (url, network, numberOfBlockConfirmation = 1, defaultFeePerByte = 3) {
    super({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })

    this._network = network
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte
  }

  async getFeePerByte (numberOfBlocks = this._numberOfBlockConfirmation) {
    try {
      const feeEstimates = await this.nodeGet('/fee-estimates')
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
    const data = await this.nodeGet(`/address/${addressToString(address)}/utxo`)
    return data.map(utxo => ({
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
    const data = await this.nodeGet(`/address/${addressToString(address)}`)
    return data.chain_stats.tx_count + data.mempool_stats.tx_count
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
    return this.nodeGet(`/tx/${transactionHash}/hex`)
  }

  async getTransaction (transactionHash) {
    let data

    try {
      data = await this.nodeGet(`/tx/${transactionHash}`)
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('Transaction not found')) {
        const { name, message, ...attrs } = e
        throw new TxNotFoundError(`Transaction not found: ${transactionHash}`, attrs)
      }

      throw e
    }

    const currentHeight = await this.getBlockHeight()
    return this.formatTransaction(data, currentHeight)
  }

  async formatTransaction (tx, currentHeight) {
    const hex = await this.getTransactionHex(tx.txid)
    const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0
    const decodedTx = decodeRawTransaction(hex, this._network)
    decodedTx.confirmations = confirmations
    return normalizeTransactionObject(decodedTx, tx.fee, { hash: tx.status.block_hash, number: tx.status.block_height })
  }

  async getBlockByHash (blockHash) {
    let data

    try {
      data = await this.nodeGet(`/block/${blockHash}`)
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('Block not found')) {
        const { name, message, ...attrs } = e
        throw new BlockNotFoundError(`Block not found: ${blockHash}`, attrs)
      }

      throw e
    }

    const {
      id: hash,
      height: number,
      timestamp,
      mediantime,
      size,
      previousblockhash: parentHash,
      nonce
    } = data

    return {
      hash,
      number,
      timestamp: mediantime || timestamp,
      size,
      parentHash,
      nonce
    }
  }

  async getBlockHash (blockNumber) {
    return this.nodeGet(`/block-height/${blockNumber}`)
  }

  async getBlockByNumber (blockNumber) {
    return this.getBlockByHash(await this.getBlockHash(blockNumber))
  }

  async getBlockHeight () {
    const data = await this.nodeGet('/blocks/tip/height')
    return parseInt(data)
  }

  async getTransactionByHash (transactionHash) {
    return this.getRawTransactionByHash(transactionHash, true)
  }

  async getRawTransactionByHash (transactionHash, decode = false) {
    return decode ? this.getTransaction(transactionHash) : this.getTransactionHex(transactionHash)
  }

  async sendRawTransaction (rawTransaction) {
    return this.nodePost('/tx', rawTransaction)
  }
}

BitcoinEsploraApiProvider.version = version
