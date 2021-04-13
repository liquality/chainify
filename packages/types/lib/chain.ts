import BigNumber from 'bignumber.js'
import { Block } from './block'
import { Transaction } from './transaction'
import { Address } from './address'

export interface SendOptions {
  to: Address | string
  value: BigNumber
  data?: string
  fee?: number
}

export interface ChainProvider {
  /**
   * Generate a block
   * @param {!number} numberOfBlocks - Number of blocks to be generated
   * @return {<Promise>}
   */
  generateBlock(numberOfBlocks: number): Promise<void>

  /**
   * Get a block given its hash.
   * @param {!string} blockHash - A hexadecimal string that represents the
   *  *hash* of the desired block.
   * @param {boolean} [includeTx=false] - If true, fetches transactions in the block.
   * @return {Promise<Block, TypeError|InvalidProviderResponseError>}
   *  Resolves with a Block with the same hash as the given input.
   *  If `includeTx` is true, the transaction property is an array of Transactions;
   *  otherwise, it is a list of transaction hashes.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block>

  /**
   * Get a block given its number.
   * @param {!number} blockNumber - The number of the desired block.
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
   * @return {Promise<Block, TypeError|InvalidProviderResponseError>}
   *  Resolves with a Block with the same number as the given input.
   *  If `includeTx` is true, the transaction property is an array of Transactions;
   *  otherwise, it is a list of transaction hashes.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block>

  /**
   * Get current block height of the chain.
   * @return {Promise<number, InvalidProviderResponseError>} Resolves with
   *  chain height.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getBlockHeight(): Promise<number>

  /**
   * Get a transaction given its hash.
   * @param {!string} txHash - A hexadecimal string that represents the *hash* of the
   *  desired transaction.
   * @return {Promise<Transaction, TypeError|InvalidProviderResponseError>}
   *  Resolves with a Transaction with the same hash as the given input.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getTransactionByHash(txHash: string): Promise<Transaction>

  /**
   * Get the balance of an account given its addresses.
   * @param {(string | Address)[]} addresses - A list of addresses.
   * @return {Promise<BigNumber, InvalidProviderResponseError>} If addresses is given,
   *  returns the cumulative balance of the given addresses. Otherwise returns the balance
   *  of the addresses that the signing provider controls.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getBalance(addresses: (Address | string)[]): Promise<BigNumber>

  /**
   * Create, sign & broadcast a transaction.
   * @param {!string} to - Recepient address.
   * @param {!number} value - Value of transaction.
   * @param {!string} data - Data to be passed to the transaction.
   * @param {!number} [fee] - Fee price in native unit (e.g. sat/b, wei)
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  sendTransaction(options: SendOptions): Promise<Transaction>

  /**
   * Create, sign & broadcast a sweep transaction.
   * @param {!string} address - External address.
   * @param {number} [fee] - Fee price in native unit (e.g. sat/b, wei)
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  sendSweepTransaction(address: Address | string, fee?: number): Promise<Transaction>

  /**
   * Update the fee of a transaction.
   * @param {(string|Transaction)} tx - Transaction object or hash of the transaction to update
   * @param {!number} newFee - New fee price in native unit (e.g. sat/b, wei)
   * @return {Promise<Transaction>} Resolves with the new transaction
   */
  updateTransactionFee(tx: string | Transaction, newFee: number): Promise<Transaction>

  /**
   * Create, sign & broad a transaction with multiple outputs.
   * @param {string[]} transactions - to, value, data
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  sendBatchTransaction(transactions: SendOptions[]): Promise<Transaction>

  /**
   * Broadcast a signed transaction to the network.
   * @param {!string} rawTransaction - A raw transaction usually in the form of a
   *  hexadecimal string that represents the serialized transaction.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with an
   *  identifier for the broadcasted transaction.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  sendRawTransaction(rawTransaction: string): Promise<string>
}
