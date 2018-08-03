import 'regenerator-runtime/runtime'
import { find, findLast, findLastIndex, isArray, isBoolean, isFunction, isNumber, isString } from 'lodash'
import * as Ajv from 'ajv'

import Provider from './Provider'
import providers from './providers'
import crypto from './crypto'
import BlockSchema from './schema/Block.json'
import TransactionSchema from './schema/Transaction.json'

export default class ChainAbstractionLayer {
  /**
   * ChainAbstractionLayer client
   * @param {object} [provider] - The provider instance.
   * @param {string} [version] - Version string
   */
  constructor (provider, version) {
    this.version = version
    this._providers = []

    const ajv = new Ajv()
    this.validateTransaction = ajv.compile(TransactionSchema)
    this.validateBlock = ajv.compile(BlockSchema)

    if (provider) {
      this.addProvider(provider)
    }
  }

  /**
   * Add a provider.
   * @param {Object} provider - The provider instance.
   * @return {Client}
   */
  addProvider (provider) {
    if (!isFunction(provider.setClient)) {
      throw new Error(`Invalid provider`)
    }

    const duplicate = find(this._providers, _provider => provider.constructor === _provider.constructor)

    if (duplicate) {
      throw new Error('Duplicate provider')
    }

    provider.setClient(this)
    this._providers.push(provider)
    return this
  }

  /**
   * Check the availability of a method.
   * @return {boolean}
   */
  getProviderForMethod (method, requestor = false) {
    if (this._providers.length === 0) {
      throw new Error('No provider provided')
    }

    const indexOfRequestor = requestor
      ? findLastIndex(this._providers, provider => requestor.constructor === provider.constructor)
      : this._providers.length

    const provider = findLast(this._providers, provider => isFunction(provider[method]), indexOfRequestor - 1)

    if (provider == null) {
      throw new Error(`Unimplemented method: ${method}`)
    }

    if (isFunction(provider._checkMethodVersionSupport)) {
      if (!provider._checkMethodVersionSupport(method, this.version)) {
        throw new Error(`Method "${method}" is not supported by version "${this.version}"`)
      }
    }

    return provider
  }

  /**
   * Generate a block
   * @param {!number} numberOfBlocks - Number of blocks to be generated
   * @return {Promise<string[], Error>} Returns a promise with Block hash of the
   *  generated blocks if resolved. Throws an Error if rejected.
   */
  async generateBlock (numberOfBlocks) {
    const provider = this.getProviderForMethod('generateBlock')

    if (!isNumber(numberOfBlocks)) {
      throw new Error('Invalid number of blocks to be generated')
    }

    const blockHashes = await provider.generateBlock(numberOfBlocks)

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
   * @param {!string} blockHash - A hexadecimal string that represents the *hash* of the
   *  desired block.
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
   * @return {Promise<Client.schemas.Block, Error>} Returns a Block with the same hash as
   *  the given input. Throws an Error if no block was found. If `includeTx` is true, the
   *  transaction property is an array of Transactions; otherwise, it is a list of
   *  transaction hashes.
   */
  async getBlockByHash (blockHash, includeTx = false) {
    const provider = this.getProviderForMethod('getBlockByHash')

    if (!isString(blockHash)) {
      throw new Error('Block hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(blockHash))) {
      throw new Error('Block hash should be a valid hex string')
    }

    if (!isBoolean(includeTx)) {
      throw new Error('Second parameter should be boolean')
    }

    const block = await provider.getBlockByHash(blockHash, includeTx)

    if (!this.validateBlock(block)) {
      throw new Error('Provider returned an invalid block')
    }

    return block
  }

  /**
   * Get a block given its number.
   * @param {!number} blockNumber - The number of the desired block.
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
   * @return {Promise<Client.schemas.Block, Error>} Returns a Block with the same number as
   *  the given input. Throws an Error if no block was found. If `includeTx` is true, the
   *  transaction property is an array of Transactions; otherwise, it is a list of
   *  transaction hashes.
   */
  async getBlockByNumber (blockNumber, includeTx = false) {
    const provider = this.getProviderForMethod('getBlockByNumber')

    if (!isNumber(blockNumber)) {
      throw new Error('Invalid Block number')
    }

    if (!isBoolean(includeTx)) {
      throw new Error('Second parameter should be boolean')
    }

    const block = await provider.getBlockByNumber(blockNumber, includeTx)

    const valid = this.validateBlock(block)

    if (!valid) {
      const errors = this.validateBlock.errors
      throw new Error(`Provider returned an invalid block, ${errors[0].dataPath} ${errors[0].message}`)
    }

    return block
  }

  /**
   * Get the current block height of the chain.
   * @return {Promise<number, Error>}
   */
  async getBlockHeight () {
    const provider = this.getProviderForMethod('getBlockHeight')

    const blockHeight = await provider.getBlockHeight()

    if (!isNumber(blockHeight)) {
      throw new Error('Provider returned an invalid block height')
    }

    return blockHeight
  }

  /**
   * Get a transaction given its hash.
   * @param {!string} txHash - A hexadecimal string that represents the *hash* of the
   *  desired transaction.
   * @return {Promise<Client.schemas.Transaction, Error>} Returns a Transaction with the
   *  same hash as the given input. Throws an Error if no transaction was found.
   */
  async getTransactionByHash (txHash) {
    const provider = this.getProviderForMethod('getTransactionByHash')

    if (!isString(txHash)) {
      throw new Error('Transaction hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(txHash))) {
      throw new Error('Transaction hash should be a valid hex string')
    }

    const transaction = await provider.getTransactionByHash(txHash)

    const valid = this.validateTransaction(transaction)

    if (!valid) {
      const errors = this.validateTransaction.errors
      throw new Error(`Provider returned an invalid transaction, ${errors[0].dataPath} ${errors[0].message}`)
    }

    return transaction
  }

  /**
   * Get a raw hexadecimal transaction given its hash.
   * @param {!string} txHash - A hexadecimal string that represents the *hash* of the
   *  desired transaction.
   * @return {Promise<string, Error>} Returns the raw Transaction with the same hash as the
   *  given output. Throws an Error if no transaction was found.
   */
  async getRawTransactionByHash (txHash) {
    const provider = this.getProviderForMethod('getRawTransactionByHash')

    if (!isString(txHash)) {
      throw new Error('Transaction hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(txHash))) {
      throw new Error('Transaction hash should be a valid hex string')
    }

    const transaction = await provider.getRawTransactionByHash(txHash)

    if (!this.validateTransaction(transaction)) {
      throw new Error('Provider returned an invalid transaction')
    }

    return transaction
  }

  async getAddresses () {
    const provider = this.getProviderForMethod('getAddresses')

    const addresses = await provider.getAddresses()

    if (!isArray(addresses)) {
      throw new Error('Provider returned an invalid response')
    }

    return addresses
  }

  async signMessage (message, from) {
    const provider = this.getProviderForMethod('signMessage')

    const signedMessage = await provider.signMessage(message, from)

    return signedMessage
  }

  async sendTransaction (from, to, value, data) {
    const provider = this.getProviderForMethod('sendTransaction')

    const txHash = await provider.sendTransaction(from, to, value, data)

    if (!isString(txHash)) {
      throw new Error('sendTransaction method should return a transaction id string')
    }

    return txHash
  }

  async generateSecret (message) {
    const addresses = await this.getAddresses()
    const from = addresses[0]
    const signedMessage = await this.signMessage(message, from)
    const secret = crypto.hash160(signedMessage)
    return secret
  }
}

ChainAbstractionLayer.Provider = Provider
ChainAbstractionLayer.providers = providers
ChainAbstractionLayer.schemas = {
  Block: BlockSchema,
  Transaction: TransactionSchema
}
ChainAbstractionLayer.crypto = crypto
