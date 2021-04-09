import { InvalidProviderResponseError, UnimplementedMethodError } from '@liquality/errors'
import { Address, WalletProvider } from '@liquality/types'
import { isArray } from 'lodash'

export default class Wallet implements WalletProvider {
  client: any

  constructor (client: any) {
    this.client = client
  }

  /**
   * Get addresses/accounts of the user.
   * @param {number} [startingIndex] - Index to start
   * @param {number} [numAddresses] - Number of addresses to retrieve
   * @param {boolean} [change] - True for change addresses
   * @return {Promise<Address[], InvalidProviderResponseError>} Resolves with a list
   *  of addresses.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getAddresses (startingIndex?: number, numAddresses?: number, change?: boolean) : Promise<Address[]> {
    const addresses = await this.client.getMethod('getAddresses')(startingIndex, numAddresses, change)

    if (!isArray(addresses)) {
      throw new InvalidProviderResponseError('Provider returned an invalid response')
    }

    return addresses
  }

  /**
   * Get used addresses/accounts of the user.
   * @param {number} [numAddressPerCall] - Number of addresses to retrieve per call
   * @return {Promise<Address[], InvalidProviderResponseError>} Resolves with a list
   *  of addresses.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getUsedAddresses (numAddressPerCall?: number) : Promise<Address[]> {
    return this.client.getMethod('getUsedAddresses')(numAddressPerCall)
  }

  /**
   * Get unused address/account of the user.
   * @param {boolean} [change] - True for change addresses
   * @param {number} [numAddressPerCall] - Number of addresses to retrieve per call
   * @return {Promise<Address, InvalidProviderResponseError>} Resolves with a address
   *  object.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getUnusedAddress (change?: boolean, numAddressPerCall?: number) : Promise<Address> {
    return this.client.getMethod('getUnusedAddress')(change, numAddressPerCall)
  }

  /**
   * Sign a message.
   * @param {!string} message - Message to be signed.
   * @param {!string} from - The address from which the message is signed.
   * @return {Promise<string>} Resolves with a signed message.
   */
  async signMessage (message: string, from: string) : Promise<string> {
    return this.client.getMethod('signMessage')(message, from)
  }

  /**
   * Retrieve the network connected to by the wallet
   * @return {Promise<any>} Resolves with the network object
   */
  async getConnectedNetwork () : Promise<any> {
    return this.client.getMethod('getConnectedNetwork')()
  }

  /**
   * Retrieve the availability status of the wallet
   * @return {Promise<Boolean>} True if the wallet is available to use
   */
  async isWalletAvailable () : Promise<boolean> {
    return this.client.getMethod('isWalletAvailable')()
  }

  /**
   * Flag indicating if the wallet allows apps to update transaction fees
   * @return {Promise<Boolean>} True if wallet accepts fee updating
   */
  get canUpdateFee () : boolean {
    try {
      return this.client.getMethod('canUpdateFee')()
    } catch (e) {
      if (!(e instanceof UnimplementedMethodError)) throw e
    }
    return true
  }
}
