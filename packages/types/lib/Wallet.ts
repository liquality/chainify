import { Address, AddressType } from './Address';
import { Asset } from './Asset';
import { FeeType } from './Fees';
import { Transaction, TransactionRequest } from './Transaction';

export interface WalletOptions {
    mnemonic: string;
    derivationPath: string;
    index: string;
    data?: Record<string, any>;
}

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
    getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<Address[]>;

    /**
     * Get used addresses/accounts of the user.
     * @param {number} [numAddressPerCall] - Number of addresses to retrieve per call
     * @return {Promise<Address[], InvalidProviderResponseError>} Resolves with a list
     *  of addresses.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getUsedAddresses(numAddressPerCall?: number): Promise<Address[]>;

    /**
     * Create, sign & broadcast a transaction.
     * @param {!string} to - Recepient address.
     * @param {!number} value - Value of transaction.
     * @param {!string} data - Data to be passed to the transaction.
     * @param {!Fee} [fee] - Fee price in native unit (e.g. sat/b, wei)
     * @return {Promise<Transaction>} Resolves with a signed transaction.
     */
    sendTransaction(options: TransactionRequest): Promise<Transaction>;

    /**
     * Create, sign & broadcast a sweep transaction.
     * @param {!string} address - External address.
     * @param {Fee} [fee] - Fee price in native unit (e.g. sat/b, wei)
     * @return {Promise<Transaction>} Resolves with a signed transaction.
     */
    sendSweepTransaction(address: AddressType, asset: Asset, fee?: FeeType): Promise<Transaction>;

    /**
     * Update the fee of a transaction.
     * @param {(string|Transaction)} tx - Transaction object or hash of the transaction to update
     * @param {!Fee} newFee - New fee price in native unit (e.g. sat/b, wei)
     * @return {Promise<Transaction>} Resolves with the new transaction
     */
    updateTransactionFee(tx: string | Transaction, newFee: FeeType): Promise<Transaction>;

    /**
     * Create, sign & broad a transaction with multiple outputs.
     * @param {string[]} transactions - to, value, data
     * @return {Promise<Transaction>} Resolves with a signed transaction.
     */
    sendBatchTransaction(transactions: TransactionRequest[]): Promise<Transaction[]>;

    /**
     * Get unused address/account of the user.
     * @param {boolean} [change] - True for change addresses
     * @param {number} [numAddressPerCall] - Number of addresses to retrieve per call
     * @return {Promise<Address, InvalidProviderResponseError>} Resolves with a address
     *  object.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address>;

    /**
     * Sign a message.
     * @param {!string} message - Message to be signed.
     * @param {!string} from - The address from which the message is signed.
     * @return {Promise<string>} Resolves with a signed message.
     */
    signMessage(message: string, from: string): Promise<string>;

    /**
     * Retrieve the network connected to by the wallet
     * @return {Promise<any>} Resolves with the network object
     */
    getConnectedNetwork(): Promise<any>;

    /**
     * Retrieve the availability status of the wallet
     * @return {Promise<Boolean>} True if the wallet is available to use
     */
    isWalletAvailable(): Promise<boolean>;

    /**
     * Flag indicating if the wallet allows apps to update transaction fees
     * @return {Promise<Boolean>} True if wallet accepts fee updating
     */
    canUpdateFee?: boolean | (() => boolean);

    /**
     * Exports the private key for the account
     * for BTC, https://en.bitcoin.it/wiki/Wallet_import_format
     * for ETH, the privateKey
     * for NEAR, the secretKey
     * @return {Promise<string>} Resolves with the key as a string
     */
    exportPrivateKey?: () => Promise<string>;
}
