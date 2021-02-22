import { sha256 } from '@liquality/crypto'
import { UnimplementedMethodError } from '@liquality/errors'
import { SwapParams, SwapProvider, Transaction } from '@liquality/types'

export default class Swap implements SwapProvider {
  client: any

  constructor (client: any) {
    this.client = client
  }

  /**
   * Find swap transaction from parameters
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {number} [blockNumber] - The block number to find the transaction in
   * @return {Promise<Transaction>} Resolves with the initiation transaction if found, otherwise null.
   */
  async findInitiateSwapTransaction (swapParams: SwapParams, blockNumber?: number) : Promise<Transaction> {
    return this.client.getMethod('findInitiateSwapTransaction')(swapParams, blockNumber)
  }

  /**
   * Find swap claim transaction from parameters
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - Swap initiation transaction hash/identifier
   * @param {number} [blockNumber] - The block number to find the transaction in
   * @return {Promise<string>} Resolves with the claim transaction if found, otherwise null.
   */
  async findClaimSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('findClaimSwapTransaction')(swapParams, initiationTxHash, blockNumber)
  }

  /**
   * Refund the swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!number} blockNumber - The block number to find the transaction in
   * @return {Promise<string, TypeError>} Resolves with the refund transaction if found, otherwise null.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async findRefundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('findRefundSwapTransaction')(swapParams, initiationTxHash, blockNumber)
  }

  /**
   * Find funding transaction
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!number} blockNumber - The block number to find the transaction in
   * @return {Promise<string, TypeError>} Resolves with the funding transaction if found, otherwise null.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async findFundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('findFundSwapTransaction')(swapParams, initiationTxHash, blockNumber)
  }

  /**
   * Generate a secret.
   * @param {!string} message - Message to be used for generating secret.
   * @param {!string} address - can pass address for async claim and refunds to get deterministic secret
   * @return {Promise<string>} Resolves with a 32 byte secret
   */
  async generateSecret (message: string) : Promise<string> {
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
  async getSwapSecret (claimTxHash: string) : Promise<string> {
    return this.client.getMethod('getSwapSecret')(claimTxHash)
  }

  /**
   * Initiate a swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!number} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<Transaction, TypeError>} Resolves with swap initiation transaction.
   * Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async initiateSwap (swapParams: SwapParams, fee: number) : Promise<Transaction> {
    const transaction = await this.client.getMethod('initiateSwap')(swapParams, fee)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /**
   * Funds a swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!string} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<Transaction, TypeError>} Resolves with the funding transaction if found, otherwise null.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async fundSwap (swapParams: SwapParams, initiationTxHash: string, fee: number) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('fundSwap')(swapParams, initiationTxHash, fee)
  }

  /**
   * Verifies that the given initiation transaction matches the given swap params
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @return {Promise<boolean, TypeError>} Resolves with true if verification has passed.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  verifyInitiateSwapTransaction (swapParams: SwapParams, initiationTxHash: string) : Promise<boolean> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    } 

    return this.client.getMethod('verifyInitiateSwapTransaction')(swapParams, initiationTxHash)
  }

  /**
   * Claim the swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!string} secret - 32 byte secret for the swap in hex.
   * @param {!number} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<Transaction, TypeError>} Resolves with swap claim transaction.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async claimSwap (swapParams: SwapParams, initiationTxHash: string, secret: string, fee: number) : Promise <Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    if (!(/[A-Fa-f0-9]{64}/.test(secret))) {
      throw new TypeError('Secret should be a 32 byte hex string')
    }

    const transaction = await this.client.getMethod('claimSwap')(swapParams, initiationTxHash, secret, fee)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /**
   * Refund the swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!number} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<string, TypeError>} Resolves with refund swap transaction hash.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async refundSwap (swapParams: SwapParams, initiationTxHash: string, fee: number) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    const transaction = await this.client.getMethod('refundSwap')(swapParams, initiationTxHash, fee)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /**
   * True if the client must provide block numbers to find swap transactions
   */
  get doesBlockScan () : boolean {
    try {
      return this.client.getMethod('doesBlockScan')()
    } catch (e) {
      if (!(e instanceof UnimplementedMethodError)) throw e
    }
    return true
  }
}
