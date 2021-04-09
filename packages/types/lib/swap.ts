import BigNumber from 'bignumber.js'
import { Transaction } from "./transaction"
import { Address } from './address'

export interface SwapParams {
  /**
   * The amount of native value locked in the swap
   */
  value: BigNumber,
  /**
   * Recepient address of the swap
   */
  recipientAddress: Address | string,
  /**
   * Refund address of the swap
   */
  refundAddress: Address | string,
  /**
   * Secret Hash
   */
  secretHash: string,
  /**
   * Expiration of the swap
   */
  expiration: number
}

export interface SwapProvider {
  /**
   * Find swap transaction from parameters
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {number} [blockNumber] - The block number to find the transaction in
   * @return {Promise<Transaction>} Resolves with the initiation transaction if found, otherwise null.
   */
  findInitiateSwapTransaction (swapParams: SwapParams, blockNumber?: number) : Promise<Transaction>

  /**
   * Find swap claim transaction from parameters
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - Swap initiation transaction hash/identifier
   * @param {number} [blockNumber] - The block number to find the transaction in
   * @return {Promise<string>} Resolves with the claim transaction if found, otherwise null.
   */
  findClaimSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction>

  /**
   * Refund the swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!number} blockNumber - The block number to find the transaction in
   * @return {Promise<string, TypeError>} Resolves with the refund transaction if found, otherwise null.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  findRefundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction>

  /**
   * Find funding transaction
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!number} blockNumber - The block number to find the transaction in
   * @return {Promise<string, TypeError>} Resolves with the funding transaction if found, otherwise null.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  findFundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction>

  /**
   * Generate a secret.
   * @param {!string} message - Message to be used for generating secret.
   * @return {Promise<string>} Resolves with a 32 byte secret
   */
  generateSecret (message: string) : Promise<string>

  /**
   * Get secret from claim transaction hash.
   * @param {!string} transaction hash - transaction hash of claim.
   * @return {Promise<string>} Resolves with secret
   */
  getSwapSecret (claimTxHash: string) : Promise<string>

  /**
   * Initiate a swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!BigNumber} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<Transaction, TypeError>} Resolves with swap initiation transaction.
   * Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  initiateSwap (swapParams: SwapParams, fee: BigNumber) : Promise<Transaction>

  /**
   * Funds a swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!BigNumber} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<Transaction, TypeError>} Resolves with the funding transaction if found, otherwise null.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  fundSwap (swapParams: SwapParams, initiationTxHash: string, fee: BigNumber) : Promise<Transaction>

  /**
   * Verifies that the given initiation transaction matches the given swap params
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @return {Promise<boolean, TypeError>} Resolves with true if verification has passed.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  verifyInitiateSwapTransaction (swapParams: SwapParams, initiationTxHash: string) : Promise<boolean>

  /**
   * Claim the swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!string} secret - 32 byte secret for the swap in hex.
   * @param {!BigNumber} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<Transaction, TypeError>} Resolves with swap claim transaction.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  claimSwap (swapParams: SwapParams, initiationTxHash: string, secret: string, fee: BigNumber) : Promise <Transaction>

  /**
   * Refund the swap
   * @param {!SwapParams} swapParams - The parameters of the swap
   * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
   * @param {!BigNumber} [fee] - Fee price in native unit (e.g. sat/b, gwei)
   * @return {Promise<string, TypeError>} Resolves with refund swap transaction hash.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  refundSwap (swapParams: SwapParams, initiationTxHash: string, fee: BigNumber) : Promise<Transaction>

  /**
   * True if the client must provide block numbers to find swap transactions
   */
  doesBlockScan: boolean | (() => boolean)
}
