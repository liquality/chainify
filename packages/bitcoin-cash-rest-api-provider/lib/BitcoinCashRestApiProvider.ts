import { NodeProvider } from '@liquality/node-provider'
import { addressToString } from '@liquality/utils'
import { decodeRawTransaction, normalizeTransactionObject } from '../../bitcoin-cash-utils' //'@liquality/bitcoin-cash-utils'
import { TxNotFoundError, BlockNotFoundError } from '@liquality/errors'
import { ChainProvider, Address, bitcoin, BigNumber } from '@liquality/types'
import * as explorer from './types'
import { BitcoinCashNetwork } from '../../bitcoin-cash-networks' //'@liquality/bitcoin-cash-networks'
import BCHJS from '@psf/bch-js'

import { flatten } from 'lodash'

export interface RestApiProviderOptions {
  url: string
  network: BitcoinCashNetwork
  // Default 1
  numberOfBlockConfirmation?: number
  // Default 1
  defaultFeePerByte?: number
}

export default class BitcoinCashRestApiProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: BitcoinCashNetwork
  _numberOfBlockConfirmation: number
  _defaultFeePerByte: number
  _usedAddressCache: { [index: string]: boolean }
  bchjs: any

  constructor(options: RestApiProviderOptions) {
    const { url, network, numberOfBlockConfirmation = 1, defaultFeePerByte = 1 } = options
    super({
      // URLs https://github.com/Permissionless-Software-Foundation/bch-js#quick-notes
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })

    this._network = network
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte
    this._usedAddressCache = {}
    this.bchjs = new BCHJS({ restURL: url })
  }

  async getFeePerByte(numberOfBlocks = this._numberOfBlockConfirmation) {
    numberOfBlocks as any
    // BCH fees are fairly stable
    return this._defaultFeePerByte
  }

  async getMinRelayFee() {
    return 1
  }

  async getBalance(_addresses: (string | Address)[]) {
    const addresses = _addresses.map(addressToString)
    const response = await this.bchjs.Electrumx.balance(addresses)['balances']
    const sum = new BigNumber(0)

    response.reduce((acc: BigNumber, balance: any) => acc.plus(balance['confirmed']).plus(balance['unconfirmed']), sum)

    return sum
  }

  async _getUnspentTransactions(address: string): Promise<bitcoin.UTXO[]> {
    const data = await this.bchjs.Electrumx.utxo(address)

    return data['utxos'].map((utxo: any) => ({
      address,
      txid: utxo['tx_hash'],
      vout: utxo['tx_pos'],
      value: utxo['value'],
      blockHeight: utxo['height']
    }))
  }

  async getUnspentTransactions(_addresses: (Address | string)[]): Promise<bitcoin.UTXO[]> {
    const addresses = _addresses.map(addressToString)
    const utxoSets = await Promise.all(addresses.map((addr) => this._getUnspentTransactions(addr)))
    const utxos = flatten(utxoSets)
    return utxos
  }

  async _getAddressTransactionCount(address: string) {
    const transactions = await this.bchjs.Electrumx.transactions(address)
    return transactions['transactions'].length
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
    return await this.bchjs.RawTransactions.getRawTransaction(transactionHash)
  }

  async getTransaction(transactionHash: string) {
    const currentHeight = await this.getBlockHeight()

    let rawTx = await this.bchjs.RawTransactions.getRawTransaction([transactionHash], true)
    rawTx = rawTx[0]
    const status: explorer.TxStatus = { confirmed: rawTx['confirmations'] > 0 }
    if (status.confirmed) {
      status.block_height = currentHeight - rawTx['confirmations'] + 1
      status.block_hash = await this.getBlockHash(status.block_height)
    }

    const tx: explorer.Transaction = {
      txid: rawTx['txid'],
      version: rawTx['version'],
      locktime: rawTx['locktime'],
      vin: rawTx['vin'],
      fee: 0, // TODO
      vout: rawTx['vout'],
      size: rawTx['size'],
      status
    }
    return this.formatTransaction(tx, currentHeight, rawTx['hex'])
  }

  async formatTransaction(tx: explorer.Transaction, currentHeight: number, hex?: string) {
    try {
      if (!hex) hex = await this.getTransactionHex(tx.txid)
    } catch (e) {
      const { name, message, ...attrs } = e
      throw new TxNotFoundError(`Transaction not found: ${tx.txid}`, attrs)
    }
    const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0
    const decodedTx = decodeRawTransaction(hex, this._network)
    decodedTx.confirmations = confirmations
    return normalizeTransactionObject(decodedTx, tx.fee, { hash: tx.status.block_hash, number: tx.status.block_height })
  }

  async getBlockByHash(blockHash: string) {
    let data

    try {
      data = await this.bchjs.Blockchain.getBlock(blockHash)
    } catch (e) {
      const { name, message, ...attrs } = e
      throw new BlockNotFoundError(`Block not found: ${blockHash}`, attrs)
    }

    const {
      hash,
      height: number,
      time: timestamp,
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
    return await this.bchjs.Blockchain.getBlockHash([blockNumber])[0]
  }

  async getBlockByNumber(blockNumber: number) {
    return this.getBlockByHash(await this.getBlockHash(blockNumber))
  }

  async getBlockHeight(): Promise<number> {
    const data = await this.bchjs.Blockchain.getBlockCount()
    return parseInt(data) - 1
  }

  async getTransactionByHash(transactionHash: string) {
    return this.getTransaction(transactionHash)
  }

  async getRawTransactionByHash(transactionHash: string) {
    return this.getTransactionHex(transactionHash)
  }

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    return await this.bchjs.RawTransactions.sendRawTransaction(rawTransaction)
  }
}
