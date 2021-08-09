import { Address } from './address'

export interface WalletProvider {
  /**
   * Get addresses/accounts of the user.
   * @param {number} [startingIndex] - Index to start
   * @param {number} [numAddresses] - Number of addresses to retrieve
   * @param {boolean} [change] - True for change addresses
   * @return {Promise<Address[], InvalidProviderResponseError>} Resolves with a list
   *  of addresses.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<Address[]>

  /**
   * Get used addresses/accounts of the user.
   * @param {number} [numAddressPerCall] - Number of addresses to retrieve per call
   * @return {Promise<Address[], InvalidProviderResponseError>} Resolves with a list
   *  of addresses.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getUsedAddresses(numAddressPerCall?: number): Promise<Address[]>

  /**
   * Get unused address/account of the user.
   * @param {boolean} [change] - True for change addresses
   * @param {number} [numAddressPerCall] - Number of addresses to retrieve per call
   * @return {Promise<Address, InvalidProviderResponseError>} Resolves with a address
   *  object.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address>

  /**
   * Sign a message.
   * @param {!string} message - Message to be signed.
   * @param {!string} from - The address from which the message is signed.
   * @return {Promise<string>} Resolves with a signed message.
   */
  signMessage(message: string, from: string): Promise<string>

  /**
   * Retrieve the network connected to by the wallet
   * @return {Promise<any>} Resolves with the network object
   */
  getConnectedNetwork(): Promise<any>

  /**
   * Retrieve the availability status of the wallet
   * @return {Promise<Boolean>} True if the wallet is available to use
   */
  isWalletAvailable(): Promise<boolean>

  /**
   * Flag indicating if the wallet allows apps to update transaction fees
   * @return {Promise<Boolean>} True if wallet accepts fee updating
   */
  canUpdateFee?: boolean | (() => boolean)

  signAmino?(signerAddr: string, signDoc: any): Promise<any>

  sendInjectionTx?(tx: any): Promise<any>
}
