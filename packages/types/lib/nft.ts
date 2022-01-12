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
  balance(contract: Address | string, tokenIDs?: BigNumber | BigNumber[]): Promise<BigNumber | BigNumber[]>

  /**
   * transfer NFT (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Transfer to address.
   * @param {!BigNumber} tokenIds - Token IDs.
   * @param {BigNumber[]} [values] - Amount of NFT copies to be transferred from each tokenID
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIds: BigNumber | BigNumber[],
    values?: BigNumber[]
  ): Promise<Transaction>

  /**
   * approve NFT (ERC721)
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Approve to address.
   * @param {!BigNumber} tokenId - Token IDs.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  approve(contract: Address | string, receiver: Address | string, tokenId: BigNumber): Promise<Transaction>

  /**
   * approve all NFTs (ERC721 & ERC1155)
   * @param {!string} contract - NFT contract address.
   * @param {!string} receiver - Approve to address.
   * @param {boolean} [state] - Give (true) or take (false) approval, give approval by default.
   * @return {Promise<Transaction>} Resolves with a signed transaction.
   */
  approveAll(contract: Address | string, receiver: Address | string, state?: boolean): Promise<Transaction>

  // TODO:
  //   /**
  //    * Fetch all user's NFT
  //    * @param {!string} contract - NFT contract address.
  //    * @return {Promise<>} Resolves with a signed transaction.
  //    */
  //   fetch(user: Address | string): Promise<>
}
