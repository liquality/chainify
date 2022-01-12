import BigNumber from 'bignumber.js'
import { Transaction } from './transaction'
import { Address } from './address'

export interface NftProvider {
  /**
   * balance of NFTs
   * @param {!string} contract - NFT contract address.
   * @return {BigNumber} Resolves with a signed transaction.
   */
  balance(contract: Address | string): Promise<BigNumber>

  /**
   * transfer NFT
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Transfer to address.
   * @param {!BigNumber} tokenId - Token ID.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  transfer(contract: Address | string, receiver: Address | string, tokenId: BigNumber): Promise<Transaction>

  /**
   * approve NFT
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Approve to address.
   * @param {!BigNumber} tokenId - Token ID.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  approve(contract: Address | string, receiver: Address | string, tokenId: BigNumber): Promise<Transaction>

  /**
   * approve all NFTs
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Approve to address.
   * @param {!boolean} state - Give (true) or take (false) approval, give approval by default.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  approveAll(contract: Address | string, receiver: Address | string, state?: boolean): Promise<Transaction>

  //   /**
  //    * Fetch all user's NFT
  //    * @param {!string} contract - NFT contract address.
  //    * @return {Promise<>} Resolves with a signed transaction.
  //    */
  //   fetch(user: Address | string): Promise<>
}
