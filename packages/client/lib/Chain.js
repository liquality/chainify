import { isArray, isBoolean, isNumber, isString } from 'lodash'
import Ajv from 'ajv'
import { BigNumber } from 'bignumber.js'

import { InvalidProviderResponseError } from '@liquality/errors'
import { Block, Transaction } from '@liquality/schema'

export default class Chain {
  /**
   * ChainProvider
   */
  constructor (client) {
    const ajv = new Ajv()
    this.validateTransaction = ajv.compile(Transaction)
    this.validateBlock = ajv.compile(Block)
    this.client = client
  }

  /**
   * Generate a block
   * @param {!number} numberOfBlocks - Number of blocks to be generated
   * @return {<Promise>}
   */
  async generateBlock (numberOfBlocks) {
    if (!isNumber(numberOfBlocks)) {
      throw new TypeError('First argument should be a number')
    }

    return this.client.getMethod('generateBlock')(numberOfBlocks)
  }

  /**
   * Get a block given its hash.
   * @param {!string} blockHash - A hexadecimal string that represents the
   *  *hash* of the desired block.
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
   * @return {Promise<ChainAbstractionLayer.schemas.Block, TypeError|InvalidProviderResponseError>}
   *  Resolves with a Block with the same hash as the given input.
   *  If `includeTx` is true, the transaction property is an array of Transactions;
   *  otherwise, it is a list of transaction hashes.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getBlockByHash (blockHash, includeTx = false) {
    if (!isString(blockHash)) {
      throw new TypeError('Block hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(blockHash))) {
      throw new TypeError('Block hash should be a valid hex string')
    }

    if (!isBoolean(includeTx)) {
      throw new TypeError('Second parameter should be boolean')
    }

    const block = await this.client.getMethod('getBlockByHash')(blockHash, includeTx)

    if (!this.validateBlock(block)) {
      const { errors } = this.validateBlock
      throw new InvalidProviderResponseError(`Provider returned an invalid block, "${errors[0].dataPath}" ${errors[0].message}`)
    }

    return block
  }

  /**
   * Get a block given its number.
   * @param {!number} blockNumber - The number of the desired block.
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
   * @return {Promise<ChainAbstractionLayer.schemas.Block, TypeError|InvalidProviderResponseError>}
   *  Resolves with a Block with the same number as the given input.
   *  If `includeTx` is true, the transaction property is an array of Transactions;
   *  otherwise, it is a list of transaction hashes.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getBlockByNumber (blockNumber, includeTx = false) {
    if (!isNumber(blockNumber)) {
      throw new TypeError('Invalid Block number')
    }

    if (!isBoolean(includeTx)) {
      throw new TypeError('Second parameter should be boolean')
    }

    const block = await this.client.getMethod('getBlockByNumber')(blockNumber, includeTx)

    if (!this.validateBlock(block)) {
      const { errors } = this.validateBlock
      throw new InvalidProviderResponseError(`Provider returned an invalid block, "${errors[0].dataPath}" ${errors[0].message}`)
    }

    return block
  }

  /**
   * Get current block height of the chain.
   * @return {Promise<number, InvalidProviderResponseError>} Resolves with
   *  chain height.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getBlockHeight () {
    const blockHeight = await this.client.getMethod('getBlockHeight')()

    if (!isNumber(blockHeight)) {
      throw new InvalidProviderResponseError('Provider returned an invalid block height')
    }

    return blockHeight
  }

  /**
   * Get a transaction given its hash.
   * @param {!string} txHash - A hexadecimal string that represents the *hash* of the
   *  desired transaction.
   * @return {Promise<ChainAbstractionLayer.schemas.Transaction, TypeError|InvalidProviderResponseError>}
   *  Resolves with a Transaction with the same hash as the given input.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getTransactionByHash (txHash) {
    if (!isString(txHash)) {
      throw new TypeError('Transaction hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(txHash))) {
      throw new TypeError('Transaction hash should be a valid hex string')
    }

    const transaction = await this.client.getMethod('getTransactionByHash')(txHash)

    if (transaction) {
      const valid = this.validateTransaction(transaction)

      if (!valid) {
        const { errors } = this.validateTransaction
        throw new InvalidProviderResponseError(`Provider returned an invalid transaction, "${errors[0].dataPath}" ${errors[0].message}`)
      }
    }

    return transaction
  }

  /**
   * Get the balance of an account given its addresses.
   * @param {!string|string[]|Address|Address[]} addresses - An address or a list of addresses.
   * @return {Promise<number, InvalidProviderResponseError>} If addresses is given,
   *  returns the cumulative balance of the given addresses. Otherwise returns the balance
   *  of the addresses that the signing provider controls.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [ addresses ]
    }

    const balance = await this.client.getMethod('getBalance')(addresses)

    if (!BigNumber.isBigNumber(balance)) {
      throw new InvalidProviderResponseError('Provider returned an invalid response')
    }

    return balance
  }

  /**
   * Check if an address has been used or not.
   * @param {!string|Address} addresses - An address to check for.
   * @return {Promise<boolean>} Resolves to true if provided address is used
   */
  async isAddressUsed (address) {
    return this.client.getMethod('isAddressUsed')(address)
  }

  /**
   * Create & sign a transaction.
   * @param {!string} to - Recepient address.
   * @param {!string} value - Value of transaction.
   * @param {!string} data - Data to be passed to the transaction.
   * @param {!string} from - The address from which the message is signed.
   * @return {Promise<string>} Resolves with a signed transaction object.
   */
  async buildTransaction (to, value, data, from) {
    return this.client.getMethod('buildTransaction')(to, value, data, from)
  }

  /**
   * Create & sign a transaction with multiple outputs.
   * @param {string[]} transactions - to, value, data, from.
   * @return {Promise<string>} Resolves with a signed transaction object.
   */
  async buildBatchTransaction (transactions) {
    return this.client.getMethod('buildBatchTransaction')(transactions)
  }

  /**
   * Create, sign & broadcast a transaction.
   * @param {!string} to - Recepient address.
   * @param {!string} value - Value of transaction.
   * @param {!string} data - Data to be passed to the transaction.
   * @param {!string} [fee] - Fee price in native unit (e.g. sat/b, wei)
   * @return {Promise<string>} Resolves with a signed transaction.
   */
  async sendTransaction (to, value, data, fee) {
    return this.client.getMethod('sendTransaction')(to, value, data, fee)
  }

  /**
   * Update the fee of a transaction.
   * @param {!string} txHash - Hash of the transaction to update
   * @param {!string} fee - New fee price in native unit (e.g. sat/b, wei)
   * @return {Promise<string>} Resolves with the new transaction hash
   */
  async updateTransactionFee (txHash, newFee) { // TODO: txHash or Tx Object
    if (!isString(txHash)) {
      throw new TypeError('Transaction hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(txHash))) {
      throw new TypeError('Transaction hash should be a valid hex string')
    }

    return this.client.getMethod('updateTransactionFee')(txHash, newFee)
  }

  /**
   * Create, sign & broad a transaction with multiple outputs.
   * @param {string[]} transactions - to, value, data, from.
   * @return {Promise<string>} Resolves with a signed transaction.
   */
  async sendBatchTransaction (transactions) {
    return this.client.getMethod('sendBatchTransaction')(transactions)
  }

  /**
   * Broadcast a signed transaction to the network.
   * @param {!string} rawTransaction - A raw transaction usually in the form of a
   *  hexadecimal string that represents the serialized transaction.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with an
   *  identifier for the broadcasted transaction.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async sendRawTransaction (rawTransaction) {
    const txHash = await this.client.getMethod('sendRawTransaction')(rawTransaction)

    if (!isString(txHash)) {
      throw new InvalidProviderResponseError('sendRawTransaction method should return a transaction id string')
    }

    return txHash
  }

  async getConnectedNetwork () {
    return this.client.getMethod('getConnectedNetwork')()
  }

  async getAddressMempool (addresses) {
    return this.client.getMethod('getAddressMempool')(addresses)
  }

  async getTransactionReceipt (txHash) {
    return this.client.getMethod('getTransactionReceipt')(txHash)
  }

  async getFees () {
    return this.client.getMethod('getFees')()
  }
}
