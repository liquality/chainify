import 'regenerator-runtime/runtime'
import { find, isArray, isBoolean, isFunction, isNumber } from 'lodash'
import * as Ajv from 'ajv'

import providers from './providers'
import BlockSchema from './schema/Block.json'
import TransactionSchema from './schema/Transaction.json'
import { isString } from 'util';

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
   * @param {object} provider - The provider instance.
   */
  addProvider (provider) {
    /**
     * @type {object}
     */
    this.provider = provider
  }

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
   * Get block by number
   * @param {!number} blockNumber - Number of the block to be fetched
   * @param {boolean} [includeTx=false] - If true, fetches transaction in the block
   * @return {Client.schemas.Block} Returns a Block
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

  async getBlockHeight () {
    this._checkMethod('getBlockHeight')

    const blockHeight = await this.provider.getBlockHeight()

    if (!isNumber(blockHeight)) {
      throw new Error('Provider returned an invalid block height')
    }

    return blockHeight
  }

  async getTransactionByHash (txHash) {
    this._checkMethod('getTransactionByHash')

    if (!(/^[A-Fa-f0-9]$/.test(txHash))) {
      throw new Error('Transaction hash should be a valid hex string')
    }

    const transaction = await this.provider.getTransactionByHash(txHash)

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
