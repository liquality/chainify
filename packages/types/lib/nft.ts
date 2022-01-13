import BigNumber from 'bignumber.js'
import { Transaction } from './transaction'
import { Address } from './address'

export interface NftProvider {
  /**
   * balance of NFTs (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {BigNumber} [tokenIDs] - NFT ids for ERC1155 standard.
   * @return {BigNumber | BigNumber[]} Resolves with in case of ERC721 - amount of NFTs, in case of ERC1155 - amount of copies owned from a NFT with specified id.
   */
  balance(contract: Address | string, tokenIDs?: BigNumber[]): Promise<BigNumber | BigNumber[]>

  /**
   * transfer NFT (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Transfer to address.
   * @param {!BigNumber} tokenIDs - Token IDs.
   * @param {BigNumber[]} [values] - Amount of NFT copies to be transferred from each tokenID
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: BigNumber | BigNumber[],
    values?: BigNumber[]
  ): Promise<Transaction>

  /**
   * approve NFT (ERC721)
   * @param {!string} contract - NFT contract address.
   * @param {!string} operator - Approve to address.
   * @param {!BigNumber} tokenID - Token IDs.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  approve(contract: Address | string, operator: Address | string, tokenID: BigNumber): Promise<Transaction>

  /**
   * check operator of NFT (ERC721)
   * @param {!string} contract - NFT contract address.
   * @param {!BigNumber} tokenID - Token IDs.
   * @return {Promise<Address>} Operator address.
   */
  isApproved(contract: Address | string, tokenID: BigNumber): Promise<Address>

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
   * @param {!string} owner - Approve to address.
   * @param {!string} operator - Approve to address.
   * @return {Promise<boolean>}
   */
  isApprovedForAll(contract: Address | string, owner: Address | string, operator: Address | string): Promise<boolean>

  // TODO:
  //   /**
  //    * Fetch all user's NFT
  //    * @param {!string} contract - NFT contract address.
  //    * @return {Promise<>} Resolves with a signed transaction.
  //    */
  //   fetch(user: Address | string): Promise<>
}
