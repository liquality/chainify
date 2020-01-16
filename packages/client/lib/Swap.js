import { isNumber, isString } from 'lodash'

import { sha256 } from '@liquality/crypto'
import { UnimplementedMethodError } from '@liquality/errors'

export default class Swap {
  constructor (client) {
    this.client = client
  }

  /**
   * Find swap transaction from parameters
   * @param {!number} value - The amount of native value locked in the swap
   * @param {!string} recipientAddress - Recepient address
   * @param {!string} refundAddress - Refund address
   * @param {!string} secretHash - Secret hash
   * @param {!string} expiration - Expiration time
   * @param {!number} blockNumber - The block number to find the transaction in
   * @return {Promise<string>} Resolves with a transaction identifier.
   */
  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.client.getMethod('findInitiateSwapTransaction')(value, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  /**
   * Find swap claim transaction from parameters
   * @param {!string} initiationTxHash - Swap initiation transaction hash/identifier
   * @param {!string} recipientAddress - Recepient address
   * @param {!string} refundAddress - Refund address
   * @param {!string} secretHash - Secret hash
   * @param {!string} expiration - Expiration time
   * @param {!number} blockNumber - The block number to find the transaction in
   * @return {Promise<string>} Resolves with a transaction identifier.
   */
  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.client.getMethod('findClaimSwapTransaction')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  /**
   * Refund the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!string} recipientAddress - Recepient address for the swap in hex.
   * @param {!string} refundAddress - Refund address for the swap in hex.
   * @param {!string} secretHash - Secret hash for the swap in hex.
   * @param {!number} expiration - Expiration time for the swap.
   * @param {!number} blockNumber - The block number to find the transaction in
   * @return {Promise<string, TypeError>} Resolves with refund swap transaction hash.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('findRefundSwapTransaction')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  /**
   * Generate a secret.
   * @param {!string} message - Message to be used for generating secret.
   * @param {!string} address - can pass address for async claim and refunds to get deterministic secret
   * @return {Promise<string>} Resolves with a 32 byte secret
   */
  async generateSecret (message) {
    try {
      return this.client.getMethod('generateSecret')(message)
    } catch (e) {
      if (!(e instanceof UnimplementedMethodError)) throw e
    }
    const address = (await this.client.getMethod('getAddresses')())[0]
    const signedMessage = await this.client.getMethod('signMessage')(message, address)
    const secret = sha256(signedMessage)
    return secret
  }

  /**
   * Get secret from claim transaction hash.
   * @param {!string} transaction hash - transaction hash of claim.
   * @return {Promise<string>} Resolves with secret
   */
  async getSwapSecret (claimTxHash) {
    return this.client.getMethod('getSwapSecret')(claimTxHash)
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
    return this.client.getMethod('initiateSwap')(value, recipientAddress, refundAddress, secretHash, expiration)
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

    return this.client.getMethod('createSwapScript')(recipientAddress, refundAddress, secretHash, expiration)
  }

  /**
   * Verifies that the given initiation transaction matches the given swap params
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!number} value - The amount of native value locked in the swap.
   * @param {!string} recipientAddress - Recepient address for the swap in hex.
   * @param {!string} refundAddress - Refund address for the swap in hex.
   * @param {!string} secretHash - Secret hash for the swap in hex.
   * @param {!number} expiration - Expiration time for the swap.
   * @return {Promise<boolean, TypeError>} Resolves with true if verification has passed.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('verifyInitiateSwapTransaction')(initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  /**
   * Claim the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!string} recipientAddress - Recepient address for the swap in hex.
   * @param {!string} refundAddress - Refund address for the swap in hex.
   * @param {!string} secret - 32 byte secret for the swap in hex.
   * @param {!number} expiration - Expiration time for the swap.
   * @return {Promise<string, TypeError>} Resolves with redeem swap contract bytecode.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    if (!(/[A-Fa-f0-9]{64}/.test(secret))) {
      throw new TypeError('Secret should be a 32 byte hex string')
    }

    return this.client.getMethod('claimSwap')(initiationTxHash, recipientAddress, refundAddress, secret, expiration)
  }

  /**
   * Refund the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!string} recipientAddress - Recepient address for the swap in hex.
   * @param {!string} refundAddress - Refund address for the swap in hex.
   * @param {!string} secretHash - Secret hash for the swap in hex.
   * @param {!number} expiration - Expiration time for the swap.
   * @return {Promise<string, TypeError>} Resolves with refund swap transaction hash.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('refundSwap')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration)
  }

  get doesBlockScan () {
    try {
      return this.client.getMethod('doesBlockScan')()
    } catch (e) {
      if (!(e instanceof UnimplementedMethodError)) throw e
    }
    return true
  }
}
