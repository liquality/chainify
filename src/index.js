import 'regenerator-runtime/runtime'
import { find, isArray, isBoolean, isFunction, isNumber, isString } from 'lodash'
import * as Ajv from 'ajv'

import providers from './providers'
import BlockSchema from './schema/Block.json'
import TransactionSchema from './schema/Transaction.json'

export default class Client {
  /**
   * ChainAbstractionLayer client
   * @param {object} [provider] - The provider instance.
   * @param {string} [version] - Version string
   */
  constructor (provider, version) {
    if (provider) {
      this.addProvider(provider)
    }

    if (version) {
      /**
       * @type {string}
       */
      this.version = version
    }

    const ajv = new Ajv()
    this.validateTransaction = ajv.compile(TransactionSchema)
    this.validateBlock = ajv.compile(BlockSchema)
  }

  /**
   * Add a provider.
   * @param {Object} provider - The provider instance.
   * @return {Client}
   */
  addProvider (provider) {
    /**
     * @type {Object}
     */
    this.provider = provider
    return this
  }

  /**
   * Check the availability of a method.
   * @return {boolean}
   */
  _checkMethod (method) {
    if (!this.provider) {
      throw new Error('No provider provided')
    }

    if (!isFunction(this.provider[method])) {
      throw new Error(`Unimplemented method: ${method}`)
    }

    if (isFunction(this.provider._checkMethodVersionSupport)) {
      if (!this.provider._checkMethodVersionSupport(method, this.version)) {
        throw new Error(`Method "${method}" is not supported by version "${this.version}"`)
      }
    }

    if (!isFunction(this.provider[method])) {
      throw new Error(`Unimplemented method: ${method}`)
    }
  }

  /**
   * Generate a block
   * @param {!number} numberOfBlocks - Number of blocks to be generated
   * @return {Promise<string[], Error>} Returns a promise with Block hash of the
   *  generated blocks if resolved. Throws an Error if rejected.
   */
  async generateBlock (numberOfBlocks) {
    this._checkMethod('generateBlock')

    if (!isNumber(numberOfBlocks)) {
      throw new Error('Invalid number of blocks to be generated')
    }

    const blockHashes = await this.provider.generateBlock(numberOfBlocks)

    if (!isArray(blockHashes)) {
      throw new Error('Provider returned an invalid response')
    }

    const invalidBlock = find(blockHashes, blockHash => !(/^[A-Fa-f0-9]+$/.test(blockHash)))

    if (invalidBlock) {
      throw new Error('Provider returned an invalid response')
    }

    return blockHashes
  }

  /**
   * Get a block given its hash.
   * @param {!string} blockHash - A hexadecimal string that represents the *hash* of the desired block. If txHash is not a string, it will get converted through the `toString(16)` method.
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
   * @return {Promise<Client.schemas.Block, null>} Returns a Block with the same hash as the given input. Returns null if no block was found. If `includeTx` is true, the transaction property is an array of Transactions; otherwise, it is a list of transaction hashes.
   */
  async getBlockByHash (blockHash, includeTx = false) {
    this._checkMethod('getBlockByHash')

    if (!(/^(0x)?[A-Fa-f0-9]+$/.test(blockHash))) {
      throw new Error('Block hash should be a valid hex string')
    }

    if (!isBoolean(includeTx)) {
      throw new Error('Second parameter should be boolean')
    }

    const block = await this.provider.getBlockByHash(blockHash, includeTx)

    if (!this.validateBlock(block)) {
      throw new Error('Provider returned an invalid block')
    }

    return block
  }

  /**
   * Get a block given its number.
   * @param {!number} blockNumber - The number of the desired block.
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
   * @return {Promise<Client.schemas.Block, null>} Returns a Block with the same number as the given input. Returns null if no block was found. If `includeTx` is true, the transaction property is an array of Transactions; otherwise, it is a list of transaction hashes.
   */
  async getBlockByNumber (blockNumber, includeTx = false) {
    this._checkMethod('getBlockByNumber')

    if (!isNumber(blockNumber)) {
      throw new Error('Invalid Block number')
    }

    if (!isBoolean(includeTx)) {
      throw new Error('Second parameter should be boolean')
    }

    const block = await this.provider.getBlockByNumber(blockNumber, includeTx)

    if (!this.validateBlock(block)) {
      throw new Error('Provider returned an invalid block')
    }

    return block
  }

  /**
   * Get the current block height of the chain.
   * @return {Promise<number>}
   */
  async getBlockHeight () {
    this._checkMethod('getBlockHeight')

    const blockHeight = await this.provider.getBlockHeight()

    if (!isNumber(blockHeight)) {
      throw new Error('Provider returned an invalid block height')
    }

    return blockHeight
  }

  /**
   * Get a transaction given its hash.
   * @param {!string} txHash - A hexadecimal string that represents the *hash* of the desired transaction. If txHash is not a string, it will get converted through the `toString(16)` method.
   * @return {Promise<Client.schemas.Transaction, null>} Returns a Transaction with the same hash as the given input. Returns null if no transaction was found.
   */
  async getTransactionByHash (txHash) {
    this._checkMethod('getTransactionByHash')

    if (!(/^(0x)?[A-Fa-f0-9]+$/.test(txHash))) {
      throw new Error('Transaction hash should be a valid hex string')
    }

    const transaction = await this.provider.getTransactionByHash(txHash)

    if (!this.validateTransaction(transaction)) {
      throw new Error('Provider returned an invalid transaction')
    }

    return transaction
  }

  /**
   * Get a raw hexadecimal transaction given its hash.
   * @param {!string} txHash - A hexadecimal string that represents the *hash* of the desired transaction. If `hash` is not a string, it will be converted through the `toString(16)` method.
   * @return {Promise<string, null>} Returns the raw Transaction with the same hash as the given output. Returns null if no transaction was found.
   */
  async getRawTransactionByHash (txHash) {
    this._checkMethod('getRawTransactionByHash')

    if (!(/^(0x)?[A-Fa-f0-9]+$/.test(txHash))) {
      throw new Error('Transaction hash should be a valid hex string')
    }

    const transaction = await this.provider.getRawTransactionByHash(txHash)

    if (!this.validateTransaction(transaction)) {
      throw new Error('Provider returned an invalid transaction')
    }

    return transaction
  }

  async getAddresses () {
    this._checkMethod('getAddresses')

    const addresses = await this.provider.getAddresses()

    if (!isArray(addresses)) {
      throw new Error('Provider returned an invalid response')
    }

    return addresses
  }

  async signMessage (message, from) {
    this._checkMethod('signMessage')

    const signedMessage = await this.provider.signMessage(message, from)

    return signedMessage
  }

  async sendTransaction (from, to, value, data) {
    this._checkMethod('sendTransaction')

    const txHash = await this.provider.sendTransaction(from, to, value, data)

    if (!isString(txHash)) {
      throw new Error('sendTransaction method should return a transaction id string')
    }

    return txHash
  }
}

Client.providers = providers
Client.schemas = {
  Block: BlockSchema,
  Transaction: TransactionSchema
}
