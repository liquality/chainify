import { NodeProvider } from '@liquality/node-provider'
import { addressToString } from '@liquality/utils'
import { decodeRawTransaction, normalizeTransactionObject } from '@liquality/bitcoin-utils'
import { TxNotFoundError, BlockNotFoundError } from '@liquality/errors'
import { ChainProvider, Address, bitcoin, BigNumber } from '@liquality/types'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'

import { flatten } from 'lodash'

export interface EsploraApiProviderOptions {
  url: string
  network: BitcoinNetwork
  // Default 1
  numberOfBlockConfirmation?: number
  // Default 3
  defaultFeePerByte?: number
}

export default class BitcoinEsploraApiProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: BitcoinNetwork
  _numberOfBlockConfirmation: number
  _defaultFeePerByte: number
  _usedAddressCache: { [index: string]: boolean }

  constructor(options: EsploraApiProviderOptions) {
    const { url, network, numberOfBlockConfirmation = 1, defaultFeePerByte = 3 } = options
    super({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })

    this._network = network
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte
    this._usedAddressCache = {}
  }

  async getFeePerByte(numberOfBlocks = this._numberOfBlockConfirmation) {
    try {
      const feeEstimates: bitcoin.explorer.FeeEstimates = await this.nodeGet('/fee-estimates')
      const blockOptions = Object.keys(feeEstimates).map((block) => parseInt(block))
      const closestBlockOption = blockOptions.reduce((prev, curr) => {
        return Math.abs(prev - numberOfBlocks) < Math.abs(curr - numberOfBlocks) ? prev : curr
      })
      const rate = Math.round(feeEstimates[closestBlockOption])
      return rate
    } catch (e) {
      return this._defaultFeePerByte
    }
  }

  async getMinRelayFee() {
    return 1
  }

  async getBalance(_addresses: (string | Address)[]) {
    const addresses = _addresses.map(addressToString)
    const _utxos = await this.getUnspentTransactions(addresses)
    const utxos = flatten(_utxos)

    return utxos.reduce((acc, utxo) => acc.plus(utxo.value), new BigNumber(0))
  }

  async _getUnspentTransactions(address: string): Promise<bitcoin.UTXO[]> {
    const data: bitcoin.explorer.UTXO[] = await this.nodeGet(`/address/${address}/utxo`)
    return data.map((utxo) => ({
      ...utxo,
      address,
      value: utxo.value,
      blockHeight: utxo.status.block_height
    }))
  }

  async getUnspentTransactions(_addresses: (Address | string)[]): Promise<bitcoin.UTXO[]> {
    const addresses = _addresses.map(addressToString)
    const utxoSets = await Promise.all(addresses.map((addr) => this._getUnspentTransactions(addr)))
    const utxos = flatten(utxoSets)
    return utxos
  }

  async _getAddressTransactionCount(address: string) {
    const data: bitcoin.explorer.Address = await this.nodeGet(`/address/${address}`)
    return data.chain_stats.tx_count + data.mempool_stats.tx_count
  }

  async getAddressTransactionCounts(_addresses: (Address | string)[]) {
    const addresses = _addresses.map(addressToString)
    const transactionCountsArray = await Promise.all(
      addresses.map(async (addr) => {
        const txCount = await this._getAddressTransactionCount(addr)
        return { [addr]: txCount }
      })
    )
    const transactionCounts = Object.assign({}, ...transactionCountsArray)
    return transactionCounts
  }

  async getTransactionHex(transactionHash: string): Promise<string> {
    return this.nodeGet(`/tx/${transactionHash}/hex`)
  }

  async getTransaction(transactionHash: string) {
    let data: bitcoin.explorer.Transaction

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

  async formatTransaction(tx: bitcoin.explorer.Transaction, currentHeight: number) {
    const hex = await this.getTransactionHex(tx.txid)
    const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0
    const decodedTx = decodeRawTransaction(hex, this._network)
    decodedTx.confirmations = confirmations
    return normalizeTransactionObject(decodedTx, tx.fee, { hash: tx.status.block_hash, number: tx.status.block_height })
  }

  async getBlockByHash(blockHash: string) {
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
      difficulty,
      nonce
    } = data

    return {
      hash,
      number,
      timestamp: mediantime || timestamp,
      size,
      parentHash,
      difficulty,
      nonce
    }
  }

  async getBlockHash(blockNumber: number): Promise<string> {
    return this.nodeGet(`/block-height/${blockNumber}`)
  }

  async getBlockByNumber(blockNumber: number) {
    return this.getBlockByHash(await this.getBlockHash(blockNumber))
  }

  async getBlockHeight(): Promise<number> {
    const data = await this.nodeGet('/blocks/tip/height')
    return parseInt(data)
  }

  async getTransactionByHash(transactionHash: string) {
    return this.getTransaction(transactionHash)
  }

  async getRawTransactionByHash(transactionHash: string) {
    return this.getTransactionHex(transactionHash)
  }

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    return this.nodePost('/tx', rawTransaction)
  }
}
