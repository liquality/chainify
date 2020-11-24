import { InvalidProviderResponseError, UnimplementedMethodError } from '@liquality/errors'

import { isArray } from 'lodash'

export default class Wallet {
  constructor (client) {
    this.client = client
  }

  /**
   * Get addresses/accounts of the user.
   * @return {Promise<Address, InvalidProviderResponseError>} Resolves with a list
   *  of accounts.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    const addresses = await this.client.getMethod('getAddresses')(startingIndex, numAddresses, change)

    if (!isArray(addresses)) {
      throw new InvalidProviderResponseError('Provider returned an invalid response')
    }

    return addresses
  }

  /**
   * Get used addresses/accounts of the user.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with a address
   *  object.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getUsedAddresses (numAddressPerCall) {
    return this.client.getMethod('getUsedAddresses')(numAddressPerCall)
  }

  /**
   * Get unused address/account of the user.
   * @return {Promise<string, InvalidProviderResponseError>} Resolves with a address
   *  object.
   *  Rejects with InvalidProviderResponseError if provider's response is invalid.
   */
  async getUnusedAddress (change, numAddressPerCall) {
    return this.client.getMethod('getUnusedAddress')(change, numAddressPerCall)
  }

  /**
   * Sign a message.
   * @param {!string} message - Message to be signed.
   * @param {!string} from - The address from which the message is signed.
   * @return {Promise<string>} Resolves with a signed message.
   */
  async signMessage (message, from) {
    return this.client.getMethod('signMessage')(message, from)
  }

  /**
   * Retrieve the availability status of the wallet
   * @return {Promise<Boolean>} True if the wallet is available to use
   */
  async isWalletAvailable () {
    return this.client.getMethod('isWalletAvailable')()
  }

  /**
   * Retrieve the network id of the connected network
   * @return {Promise<Number>} The network id of the connected network
   */
  async getWalletNetworkId () {
    return this.client.getMethod('getWalletNetworkId')()
  }

  /**
   * Flag indicating if the wallet allows apps to update transaction fees
   * @return {Promise<Boolean>} True if wallet accepts fee updating
   */
  get canUpdateFee () {
    try {
      return this.client.getMethod('canUpdateFee')()
    } catch (e) {
      if (!(e instanceof UnimplementedMethodError)) throw e
    }
    return true
  }
}
