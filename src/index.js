import 'regenerator-runtime/runtime'
import { find, findLast, findLastIndex, isArray, isBoolean, isFunction, isNumber, isString } from 'lodash'
import * as Ajv from 'ajv'

import Provider from './Provider'
import providers from './providers'
import crypto from './crypto'
import * as errors from './errors'
import BlockSchema from './schema/Block.json'
import TransactionSchema from './schema/Transaction.json'

export default class ChainAbstractionLayer {
  /**
   * ChainAbstractionLayer client
   * @param {Provider} [provider] - Data source/provider for the instance
   * @param {string} [version] - Minimum blockchain node version to support
   */
  constructor (provider, version) {
    const ajv = new Ajv()
    this.validateTransaction = ajv.compile(TransactionSchema)
    this.validateBlock = ajv.compile(BlockSchema)

    /**
     * @type {Array}
     */
    this._providers = []

    /**
     * @type {string}
     */
    this.version = version

    if (provider) {
      this.addProvider(provider)
    }
  }

  /**
   * Add a provider
   * @param {!Provider} provider - The provider instance
   * @return {ChainAbstractionLayer} Returns instance of ChainAbstractionLayer
   * @throws {InvalidProviderError} When invalid provider is provider
   * @throws {DuplicateProviderError} When same provider is added again
   */
  addProvider (provider) {
    if (!isFunction(provider.setClient)) {
      throw new errors.InvalidProviderError('Provider should have "setClient" method')
    }

    const duplicate = find(
      this._providers,
      _provider => provider.constructor === _provider.constructor
    )

    if (duplicate) {
      throw new errors.DuplicateProviderError('Duplicate provider')
    }

    provider.setClient(this)
    this._providers.push(provider)
    return this
  }

  /**
   * Check the availability of a method.
   * @param {!string} method - Name of the method to look for in the provider stack
   * @param {boolean} [requestor=false] - If provided, it returns providers only
   *  above the requestor in the stack.
   * @return {Provider} Returns a provider instance associated with the requested method
   * @throws {NoProviderError} When no provider is available in the stack.
   * @throws {UnimplementedMethodError} When the requested method is not provided
   *  by any provider above requestor in the provider stack
   * @throws {UnsupportedMethodError} When requested method is not supported by
   *  version specified
   */
  getProviderForMethod (method, requestor = false) {
    if (this._providers.length === 0) {
      throw new errors.NoProviderError('No provider provided. Add a provider to the client')
    }

    const indexOfRequestor = requestor
      ? findLastIndex(
        this._providers,
        provider => requestor.constructor === provider.constructor
      ) : this._providers.length

    const provider = findLast(
      this._providers,
      provider => isFunction(provider[method]), indexOfRequestor - 1
    )

    if (provider == null) {
      throw new errors.UnimplementedMethodError(`Unimplemented method "${method}"`)
    }

    if (isFunction(provider._checkMethodVersionSupport)) {
      if (!provider._checkMethodVersionSupport(method, this.version)) {
        throw new errors.UnsupportedMethodError(`Method "${method}" is not supported by version "${this.version}"`)
      }
    }

    return provider
  }

  /**
   * Generate a block
   * @param {!number} numberOfBlocks - Number of blocks to be generated
   * @return {Promise<string[], TypeError|InvalidProviderResponseError>} Resolves
   *  with Block hash of the generated blocks.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async generateBlock (numberOfBlocks) {
    const provider = this.getProviderForMethod('generateBlock')

    if (!isNumber(numberOfBlocks)) {
      throw new TypeError('First argument should be a number')
    }

    const blockHashes = await provider.generateBlock(numberOfBlocks)

    if (!isArray(blockHashes)) {
      throw new errors.InvalidProviderResponseError('Response should be an array')
    }

    const invalidBlock = find(blockHashes, blockHash => !(/^[A-Fa-f0-9]+$/.test(blockHash)))

    if (invalidBlock) {
      throw new errors.InvalidProviderResponseError('Invalid block(s) found in provider\'s reponse')
    }

    return blockHashes
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
    const provider = this.getProviderForMethod('getBlockByHash')

    if (!isString(blockHash)) {
      throw new TypeError('Block hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(blockHash))) {
      throw new TypeError('Block hash should be a valid hex string')
    }

    if (!isBoolean(includeTx)) {
      throw new TypeError('Second parameter should be boolean')
    }

    const block = await provider.getBlockByHash(blockHash, includeTx)

    if (!this.validateBlock(block)) {
      throw new errors.InvalidProviderResponseError('Provider returned an invalid block')
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
    const provider = this.getProviderForMethod('getBlockByNumber')

    if (!isNumber(blockNumber)) {
      throw new TypeError('Invalid Block number')
    }

    if (!isBoolean(includeTx)) {
      throw new TypeError('Second parameter should be boolean')
    }

    const block = await provider.getBlockByNumber(blockNumber, includeTx)

    const valid = this.validateBlock(block)

    if (!valid) {
      const errors = this.validateBlock.errors
      throw new errors.InvalidProviderResponseError(`Provider returned an invalid block, ${errors[0].dataPath} ${errors[0].message}`)
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
    const provider = this.getProviderForMethod('getBlockHeight')

    const blockHeight = await provider.getBlockHeight()

    if (!isNumber(blockHeight)) {
      throw new errors.InvalidProviderResponseError('Provider returned an invalid block height')
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
    const provider = this.getProviderForMethod('getTransactionByHash')

    if (!isString(txHash)) {
      throw new TypeError('Transaction hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(txHash))) {
      throw new TypeError('Transaction hash should be a valid hex string')
    }

    const transaction = await provider.getTransactionByHash(txHash)

    const valid = this.validateTransaction(transaction)

    if (!valid) {
      const errors = this.validateTransaction.errors
      throw new errors.InvalidProviderResponseError(`Provider returned an invalid transaction: ${errors[0].dataPath} ${errors[0].message}`)
    }

    return transaction
  }

  /**
   * Get a raw hexadecimal transaction given its hash.
   * @param {!string} txHash - A hexadecimal string that represents the *hash* of the
   *  desired transaction.
   * @return {Promise<string, TypeError|InvalidProviderResponseError>} Resolves with the raw Transaction with
   *  the same hash as the given output.
   *  Rejects with TypeError if input is invalid.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getRawTransactionByHash (txHash) {
    const provider = this.getProviderForMethod('getRawTransactionByHash')

    if (!isString(txHash)) {
      throw new TypeError('Transaction hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(txHash))) {
      throw new TypeError('Transaction hash should be a valid hex string')
    }

    const transaction = await provider.getRawTransactionByHash(txHash)

    if (!this.validateTransaction(transaction)) {
      throw new errors.InvalidProviderResponseError('Provider returned an invalid transaction')
    }

    return transaction
  }

  /**
   * Get addresses/accounts of the user.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with a list
   *  of accounts.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getAddresses () {
    const provider = this.getProviderForMethod('getAddresses')

    const addresses = await provider.getAddresses()

    if (!isArray(addresses)) {
      throw new errors.InvalidProviderResponseError('Provider returned an invalid response')
    }

    return addresses
  }

  /**
   * Sign a message.
   * @param {!string} message - Message to be signed.
   * @param {!string} from - The address from which the message is signed.
   * @return {Promise<string, null>} Resolves with a signed message.
   */
  async signMessage (message, from) {
    const provider = this.getProviderForMethod('signMessage')

    const signedMessage = await provider.signMessage(message, from)

    return signedMessage
  }

  /**
   * Send a transaction to the chain
   * @param {!string} from - The address identifier for the sender.
   * @param {!string} to - The address identifier for the receiver.
   * @param {!number} value - Number representing the amount associated with.
   *  the transaction.
   * @param {!string} [data] - Optional data to send with the transaction.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with an identifier for
   *  the broadcasted transaction.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async sendTransaction (from, to, value, data) {
    const provider = this.getProviderForMethod('sendTransaction')

    const txHash = await provider.sendTransaction(from, to, value, data)

    if (!isString(txHash)) {
      throw new errors.InvalidProviderResponseError('sendTransaction method should return a transaction id string')
    }

    return txHash
  }

  /**
   * Broadcast a transaction to the network using it's raw seriealized transaction.
   * @param {!string} rawTransaction - A raw transaction usually in the form of a
   *  hexadecimal string that represents the serialized transaction.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with an
   *  identifier for the broadcasted transaction.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async sendRawTransaction (rawTransaction) {
    const provider = this.getProviderForMethod('sendRawTransaction')

    const txHash = await provider.sendRawTransaction(rawTransaction)

    if (!isString(txHash)) {
      throw new errors.InvalidProviderResponseError('sendRawTransaction method should return a transaction id string')
    }

    return txHash
  }

  /**
   * Generate a secret.
   * @param {!string} message - Message to be used for generating secret.
   * @return {Promise<string, null>} Resolves with a secret.
   */
  async generateSecret (message) {
    const addresses = await this.getAddresses()
    const from = addresses[0]
    const signedMessage = await this.signMessage(message, from)
    const secret = crypto.hash160(signedMessage)
    return secret
  }

  /**
   * Generate swap transaction data
   */
  generateSwap (recipientAddress, refundAddress, secretHash, expiration) {
    this._checkMethod('generateSwap')

    if (!isString(recipientAddress)) {
      throw new Error('Recipient address should be a string')
    }

    if (!isString(refundAddress)) {
      throw new Error('Refund address should be a string')
    }

    if (!isString(secretHash)) {
      throw new Error('Secret hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(recipientAddress))) {
      throw new Error('Recipient address should be a valid hex string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(refundAddress))) {
      throw new Error('Refund address should be a valid hex string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(secretHash))) {
      throw new Error('Secret hash should be a valid hex string')
    }

    if (!isNumber(expiration)) {
      throw new Error('Invalid expiration time')
    }

    return this.provider.generateSwap(recipientAddress, refundAddress, secretHash, expiration)
  }
}

ChainAbstractionLayer.Provider = Provider
ChainAbstractionLayer.providers = providers
ChainAbstractionLayer.crypto = crypto
ChainAbstractionLayer.errors = errors
ChainAbstractionLayer.schemas = {
  Block: BlockSchema,
  Transaction: TransactionSchema
}
