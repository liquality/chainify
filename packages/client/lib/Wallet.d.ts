export default class Wallet {
    constructor(client: any);
    /**
     * Get addresses/accounts of the user.
     * @return {Promise<Address, InvalidProviderResponseError>} Resolves with a list
     *  of accounts.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<any>;
    /**
     * Get used addresses/accounts of the user.
     * @return {Promise<string, InvalidProviderResponseError>} Resolves with a address
     *  object.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getUsedAddresses(numAddressPerCall: any): Promise<any>;
    /**
     * Get unused address/account of the user.
     * @return {Promise<string, InvalidProviderResponseError>} Resolves with a address
     *  object.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getUnusedAddress(change: any, numAddressPerCall: any): Promise<any>;
    /**
     * Sign a message.
     * @param {!string} message - Message to be signed.
     * @param {!string} from - The address from which the message is signed.
     * @return {Promise<string>} Resolves with a signed message.
     */
    signMessage(message: any, from: any): Promise<any>;
    /**
     * Retrieve the availability status of the wallet
     * @return {Promise<Boolean>} True if the wallet is available to use
     */
    isWalletAvailable(): Promise<any>;
    /**
     * Retrieve the network id of the connected network
     * @return {Promise<Number>} The network id of the connected network
     */
    getWalletNetworkId(): Promise<any>;
    /**
     * Flag indicating if the wallet allows apps to update transaction fees
     * @return {Promise<Boolean>} True if wallet accepts fee updating
     */
    get canUpdateFee(): any;
}
