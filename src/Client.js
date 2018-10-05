import { get, upperFirst, find, findLast, findLastIndex, isArray, isBoolean, isFunction, isNumber, isString } from 'lodash'
import * as Ajv from 'ajv'

import * as providers from './providers'
import DNSParser from './DsnParser'
import { Block, Transaction } from './schema'
import { sha256 } from './crypto'
import {
  DuplicateProviderError,
  InvalidProviderError,
  InvalidProviderResponseError,
  NoProviderError,
  UnimplementedMethodError,
  UnsupportedMethodError,
  ProviderNotFoundError
} from './errors'

export default class Client {
  /**
   * Client
   * @param {string|Provider} [provider] - Data source/provider for the instance
   * @param {string} [version] - Minimum blockchain node version to support
   */
  constructor (provider, version) {
    const ajv = new Ajv()
    this.validateTransaction = ajv.compile(Transaction)
    this.validateBlock = ajv.compile(Block)

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
   * @param {!string|Provider} provider - The provider instance or RPC connection string
   * @return {Client} Returns instance of Client
   * @throws {InvalidProviderError} When invalid provider is provider
   * @throws {DuplicateProviderError} When same provider is added again
   */
  addProvider (provider) {
    if (isString(provider)) {
      const {
        baseUrl,
        driverName,
        auth
      } = DNSParser(provider)

      const rpcProviderName = `${upperFirst(driverName)}RPCProvider`
      const pathToProvider = `${driverName}.${rpcProviderName}`
      const ProviderClass = get(providers, pathToProvider)

      if (!ProviderClass) {
        throw new ProviderNotFoundError(`${pathToProvider} not found`)
      }

      const args = [ baseUrl ]

      if (auth) {
        args.push(auth.username, auth.password)
      }

      return this.addProvider(new ProviderClass(...args))
    }

    if (!isFunction(provider.setClient)) {
      throw new InvalidProviderError('Provider should have "setClient" method')
    }

    const duplicate = find(
      this._providers,
      _provider => provider.constructor === _provider.constructor
    )

    if (duplicate) {
      throw new DuplicateProviderError('Duplicate provider')
    }

    provider.setClient(this)
    this._providers.push(provider)
    return this
  }

  /**
   * Check the availability of a method.
   * @param {!string} method - Name of the method to look for in the provider stack
   * @param {boolean|object} [requestor=false] - If provided, it returns providers only
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
      throw new NoProviderError('No provider provided. Add a provider to the client')
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
      throw new UnimplementedMethodError(`Unimplemented method "${method}"`)
    }

    if (isFunction(provider._checkMethodVersionSupport)) {
      if (!provider._checkMethodVersionSupport(method, this.version)) {
        throw new UnsupportedMethodError(`Method "${method}" is not supported by version "${this.version}"`)
      }
    }

    return provider
  }

  /**
   * Helper method that returns method from a provider.
   * @param {!string} method - Name of the method to look for in the provider stack
   * @param {object} [requestor] - If provided, it returns method from providers only
   *  above the requestor in the stack.
   * @return {function} Returns method from provider instance associated with the requested method
   */
  getMethod (method, requestor) {
    const provider = this.getProviderForMethod(method, requestor)
    return provider[method].bind(provider)
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
    if (!isNumber(numberOfBlocks)) {
      throw new TypeError('First argument should be a number')
    }

    const blockHashes = await this.getMethod('generateBlock')(numberOfBlocks)

    if (!isArray(blockHashes)) {
      throw new InvalidProviderResponseError('Response should be an array')
    }

    const invalidBlock = find(blockHashes, blockHash => !(/^[A-Fa-f0-9]+$/.test(blockHash)))

    if (invalidBlock) {
      throw new InvalidProviderResponseError('Invalid block(s) found in provider\'s reponse')
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
    if (!isString(blockHash)) {
      throw new TypeError('Block hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(blockHash))) {
      throw new TypeError('Block hash should be a valid hex string')
    }

    if (!isBoolean(includeTx)) {
      throw new TypeError('Second parameter should be boolean')
    }

    const block = await this.getMethod('getBlockByHash')(blockHash, includeTx)

    if (!this.validateBlock(block)) {
      throw new InvalidProviderResponseError('Provider returned an invalid block')
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

    const block = await this.getMethod('getBlockByNumber')(blockNumber, includeTx)

    const valid = this.validateBlock(block)

    if (!valid) {
      const errors = this.validateBlock.errors
      throw new InvalidProviderResponseError(`Provider returned an invalid block, ${errors[0].dataPath} ${errors[0].message}`)
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
    const blockHeight = await this.getMethod('getBlockHeight')()

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

    const transaction = await this.getMethod('getTransactionByHash')(txHash)

    const valid = this.validateTransaction(transaction)

    if (!valid) {
      const errors = this.validateTransaction.errors
      throw new InvalidProviderResponseError(`Provider returned an invalid transaction: ${errors[0].dataPath} ${errors[0].message}`)
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
    if (!isString(txHash)) {
      throw new TypeError('Transaction hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(txHash))) {
      throw new TypeError('Transaction hash should be a valid hex string')
    }

    const transaction = await this.getMethod('getRawTransactionByHash')(txHash)

    if (!this.validateTransaction(transaction)) {
      throw new InvalidProviderResponseError('Provider returned an invalid transaction')
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

    const balance = await this.getMethod('getBalance')(addresses)

    if (!isNumber(balance)) {
      throw new InvalidProviderResponseError('Provider returned an invalid response')
    }

    return balance
  }

  /**
   * Get addresses/accounts of the user.
   * @return {Promise<Address, InvalidProviderResponseError>} Resolves with a list
   *  of accounts.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getAddresses (startingIndex = 0, numAddresses = 1) {
    const addresses = await this.getMethod('getAddresses')(startingIndex, numAddresses)

    if (!isArray(addresses)) {
      throw new InvalidProviderResponseError('Provider returned an invalid response')
    }

    return addresses
  }

  /**
   * Check if an address has been used or not.
   * @param {!string|Address} addresses - An address to check for.
   * @return {Promise<boolean>} Resolves to true if provided address is used
   */
  async isAddressUsed (address) {
    return this.getMethod('isAddressUsed')(address)
  }

  /**
   * Get unused address/account of the user.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with a address
   *  object.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getUnusedAddress (from = {}) {
    return this.getMethod('getUnusedAddress')(from)
  }

  /**
   * Sign a message.
   * @param {!string} message - Message to be signed.
   * @param {!string} from - The address from which the message is signed.
   * @return {Promise<string>} Resolves with a signed message.
   */
  async signMessage (message, from) {
    return this.getMethod('signMessage')(message, from)
  }

  /**
   * Create, sign & broadcast a transaction.
   * @param {!string} to - Recepient address.
   * @param {!string} value - Value of transaction.
   * @param {!string} data - Data to be passed to the transaction.
   * @param {!string} from - The address from which the message is signed.
   * @return {Promise<string>} Resolves with a signed transaction.
   */
  async sendTransaction (to, value, data, from) {
    return this.getMethod('sendTransaction')(to, value, data, from)
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
    const txHash = await this.getMethod('sendRawTransaction')(rawTransaction)

    if (!isString(txHash)) {
      throw new InvalidProviderResponseError('sendRawTransaction method should return a transaction id string')
    }

    return txHash
  }

  /**
   * Decode Transaction from Hex
   * @param {!string} rawTransaction - A raw transaction usually in the form of a
   *  hexadecimal string that represents the serialized transaction.
   * @return {Promise<string>} Resolves with an
   *  decoded transaction object.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async decodeRawTransaction (rawTransaction) {
    return this.getMethod('decoderawtransaction')(rawTransaction)
  }

  /**
   * Find swap transaction from parameters
   * @param {!string} blockNumber - Block number in which transaction was mined
   * @param {!string} recipientAddress - Recepient address
   * @param {!string} refundAddress - Refund address
   * @param {!string} expiration - Expiration time
   * @return {Promise<string>} Resolves with a transaction identifier.
   */
  async getSwapTransaction (blockNumber, recipientAddress, refundAddress, secretHash, expiration) {
    return this.getMethod('getSwapTransaction')(blockNumber, recipientAddress, refundAddress, secretHash, expiration)
  }

  /**
   * Find swap confirmation transaction from parameters
   * @param {!string} blockNumber - Block number in which transaction was mined
   * @param {!string} initiationTxHash - Swap initiation transaction hash/identifier
   * @param {!string} secretHash - Secret hash
   * @return {Promise<string>} Resolves with a transaction identifier.
   */
  async getSwapConfirmTransaction (blockNumber, initiationTxHash, secretHash) {
    return this.getMethod('getSwapConfirmTransaction')(blockNumber, initiationTxHash, secretHash)
  }

  /**
   * Generate a secret.
   * @param {!string} message - Message to be used for generating secret.
   * @return {Promise<string>} Resolves with secret
   */
  async generateSecret (message) {
    const unusedAddress = await this.getMethod('getUnusedAddress')()
    const signedMessage = await this.signMessage(message, unusedAddress)
    const secret = sha256(signedMessage)
    return secret
  }

  /**
   * Get secret from claim transaction hash.
   * @param {!string} transaction hash - transaction hash of claim.
   * @return {Promise<string>} Resolves with secret
   */
  async getSecret (claimTxHash) {
    return this.getMethod('getSecret')(claimTxHash)
  }

  /**
   * Initiate a swap
   * @param {!number} value - The amount of native value to lock for the swap.
   * @param {!string} recipientAddress - Recepient address for the swap in hex.
   * @param {!string} refundAddress - Refund address for the swap in hex.
   * @param {!string} secretHash - Secret hash for the swap in hex.
   * @param {!number} expiration - Expiration time for the swap.
   * @return {Promise<string, TypeError>} Resolves with the transaction ID for the swap.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.getMethod('initiateSwap')(value, recipientAddress, refundAddress, secretHash, expiration)
  }

  /**
   * Create swap script.
   * @param {!string} bytecode - Bytecode to be used for swap.
   * @return {Promise<string, null>} Resolves with swap bytecode.
   */
  async createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    if (!isString(recipientAddress)) {
      throw new TypeError('Recipient address should be a string')
    }

    if (!isString(refundAddress)) {
      throw new TypeError('Refund address should be a string')
    }

    if (!isString(secretHash)) {
      throw new TypeError('Secret hash should be a string')
    }

    if (!(/^[A-Fa-f0-9]+$/.test(secretHash))) {
      throw new TypeError('Secret hash should be a valid hex string')
    }

    if (!isNumber(expiration)) {
      throw new TypeError('Invalid expiration time')
    }

    return this.getMethod('createSwapScript')(recipientAddress, refundAddress, secretHash, expiration)
  }

  /**
   * Generate redeem swap transaction data
   * @param {!string} secret - Secret for the swap in hex.
   * @param {string} [pubKey] - PubKey for the swap in hex.
   * @param {string} [signature] - Signature for the swap in hex.
   * @return {Promise<string, TypeError>} Resolves with redeem swap contract bytecode.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.getMethod('claimSwap')(initiationTxHash, recipientAddress, refundAddress, secret, expiration)
  }

  /**
   * Generate refund swap transaction data
   * @param {string} [pubKey] - PubKey for the swap in hex.
   * @param {string} [signature] - Signature for the swap in hex.
   * @return {Promise<string, TypeError>} Resolves with refund swap contract bytecode.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async refundSwap (pubKey = '', signature = '') {
    if (!isString(pubKey)) {
      throw new TypeError('PubKey should be a string')
    }

    if (!(/^[A-Fa-f0-9]*$/.test(pubKey))) {
      throw new TypeError('PubKey should be a valid hex string')
    }

    if (!isString(signature)) {
      throw new TypeError('Signature should be a string')
    }

    if (!(/^[A-Fa-f0-9]*$/.test(signature))) {
      throw new TypeError('Signature should be a valid hex string')
    }

    return this.getMethod('refundSwap')(pubKey, signature)
  }

  /**
   * Check if counterparty transaction has been confirmed
   * @param {!number} blockNumber - The number of the desired block.
   * @param {!string} recipientAddress - Recepient address for the swap in hex.
   * @param {!string} refundAddress - Refund address for the swap in hex.
   * @param {!string} secretHash - Secret hash for the swap in hex.
   * @param {!number} expiration - Expiration time for the swap.
   * @return {Promise<string, TypeError>} Resolves with txHash of desired swap or false if not found.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async checkBlockSwap (blockNumber, recipientAddress, refundAddress, secretHash, expiration) {
    return this.getMethod('checkBlockSwap')(blockNumber, recipientAddress, refundAddress, secretHash, expiration)
  }
}
