import { Transaction } from './transaction'
import { Address } from './address'

export interface NftProvider {
  /**
   * balance of NFTs (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {number} [tokenID] - NFT ids for ERC1155 standard.
   * @return {number} Resolves with in case of ERC721 - amount of NFTs, in case of ERC1155 - amount of copies owned from a NFT with specified id.
   */
  balance(contract: Address | string, tokenIDs: number | number[]): Promise<number | number[]>

  /**
   * transfer NFT (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Transfer to address.
   * @param {!number} tokenIDs - Token IDs.
   * @param {number[]} [values] - Amount of NFT copies to be transferred from each tokenID.
   * @param {string} [data] - Additional data (0x00 by default).
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: number | number[],
    values?: number[],
    data?: string
  ): Promise<Transaction>

  /**
   * approve NFT (ERC721)
   * @param {!string} contract - NFT contract address.
   * @param {!string} operator - Approve to address.
   * @param {!number} tokenID - Token ID.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  approve(contract: Address | string, operator: Address | string, tokenID: number): Promise<Transaction>

  /**
   * check operator of NFT (ERC721)
   * @param {!string} contract - NFT contract address.
   * @param {!number} tokenID - Token ID.
   * @return {Promise<Address>} Operator address.
   */
  isApproved(contract: Address | string, tokenID: number): Promise<Address>

  /**
   * approve all NFTs (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {!string} operator - Approve to address.
   * @param {boolean} [state] - Give (true) or take (false) approval, give approval by default.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  approveAll(contract: Address | string, operator: Address | string, state?: boolean): Promise<Transaction>

  /**
   * approve all NFTs (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {!string} operator - Approve to address.
   * @return {Promise<boolean>}
   */
  isApprovedForAll(contract: Address | string, operator: Address | string): Promise<boolean>

  // TODO:
  //   /**
  //    * Fetch all user's NFT
  //    * @param {!string} contract - NFT contract address.
  //    * @return {Promise<>} Resolves with a signed transaction.
  //    */
  //   fetch(user: Address | string): Promise<>
}
