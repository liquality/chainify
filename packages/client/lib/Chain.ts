import { InvalidProviderResponseError } from '@liquality/errors'
import {
  SendOptions,
  Block,
  Transaction,
  FeeDetails,
  ChainProvider,
  FeeProvider,
  BigNumber,
  Address
} from '@liquality/types'
import { isBoolean, isNumber, isString, isObject } from 'lodash'

export default class Chain implements ChainProvider, FeeProvider {
  client: any

  constructor(client: any) {
    this.client = client
  }

  /** @inheritdoc */
  async generateBlock(numberOfBlocks: number): Promise<void> {
    if (!isNumber(numberOfBlocks)) {
      throw new TypeError('First argument should be a number')
    }

    return this.client.getMethod('generateBlock')(numberOfBlocks)
  }

  /** @inheritdoc */
  async getBlockByHash(blockHash: string, includeTx = false): Promise<Block> {
    if (!isString(blockHash)) {
      throw new TypeError('Block hash should be a string')
    }

    if (!/^[A-Fa-f0-9]+$/.test(blockHash)) {
      throw new TypeError('Block hash should be a valid hex string')
    }

    if (!isBoolean(includeTx)) {
      throw new TypeError('Second parameter should be boolean')
    }

    const block = await this.client.getMethod('getBlockByHash')(blockHash, includeTx)
    this.client.assertValidBlock(block)
    return block
  }

  /** @inheritdoc */
  async getBlockByNumber(blockNumber: number, includeTx = false): Promise<Block> {
    if (!isNumber(blockNumber)) {
      throw new TypeError('Invalid Block number')
    }

    if (!isBoolean(includeTx)) {
      throw new TypeError('Second parameter should be boolean')
    }

    const block = await this.client.getMethod('getBlockByNumber')(blockNumber, includeTx)
    this.client.assertValidBlock(block)
    return block
  }

  /** @inheritdoc */
  async getBlockHeight(): Promise<number> {
    const blockHeight = await this.client.getMethod('getBlockHeight')()

    if (!isNumber(blockHeight)) {
      throw new InvalidProviderResponseError('Provider returned an invalid block height')
    }

    return blockHeight
  }

  /** @inheritdoc */
  async getTransactionByHash(txHash: string): Promise<Transaction> {
    if (!isString(txHash)) {
      throw new TypeError('Transaction hash should be a string')
    }

    if (!/^[A-Fa-f0-9]+$/.test(txHash)) {
      throw new TypeError('Transaction hash should be a valid hex string')
    }

    const transaction = await this.client.getMethod('getTransactionByHash')(txHash)
    if (transaction) {
      this.client.assertValidTransaction(transaction)
    }

    return transaction
  }

  /** @inheritdoc */
  async getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
    const balance = await this.client.getMethod('getBalance')(addresses)

    if (!BigNumber.isBigNumber(balance)) {
      throw new InvalidProviderResponseError('Provider returned an invalid response')
    }

    return balance
  }

  /** @inheritdoc */
  async sendTransaction(options: SendOptions): Promise<Transaction> {
    const transaction = await this.client.getMethod('sendTransaction')(options)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async sendSweepTransaction(address: Address | string, fee?: number): Promise<Transaction> {
    return this.client.getMethod('sendSweepTransaction')(address, fee)
  }

  /** @inheritdoc */
  async updateTransactionFee(tx: string | Transaction, newFee: number): Promise<Transaction> {
    if (isString(tx)) {
      if (!/^[A-Fa-f0-9]+$/.test(tx)) {
        throw new TypeError('Transaction hash should be a valid hex string')
      }
    } else if (isObject(tx)) {
      this.client.assertValidTransaction(tx)
    } else {
      throw new TypeError('Transaction should be a string or object')
    }

    const transaction = await this.client.getMethod('updateTransactionFee')(tx, newFee)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async sendBatchTransaction(transactions: SendOptions[]): Promise<Transaction> {
    return this.client.getMethod('sendBatchTransaction')(transactions)
  }

  /** @inheritdoc */
  async sendRawTransaction(rawTransaction: string): Promise<string> {
    const txHash = await this.client.getMethod('sendRawTransaction')(rawTransaction)

    if (!isString(txHash)) {
      throw new InvalidProviderResponseError('sendRawTransaction method should return a transaction id string')
    }

    return txHash
  }

  /** @inheritdoc */
  async getFees(): Promise<FeeDetails> {
    return this.client.getMethod('getFees')()
  }
}
