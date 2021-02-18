import { BigNumber } from 'bignumber.js';
export default class Chain {
    /**
     * ChainProvider
     */
    constructor(client: any);
    /**
     * Generate a block
     * @param {!number} numberOfBlocks - Number of blocks to be generated
     * @return {<Promise>}
     */
    generateBlock(numberOfBlocks: any): Promise<any>;
    /**
     * Get a block given its hash.
     * @param {!string} blockHash - A hexadecimal string that represents the
     *  *hash* of the desired block.
     * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
     * @return {Promise<ChainAbstractionLayer.schemas.Block, TypeError|InvalidProviderResponseError>}
     *  Resolves with a Block with the same hash as the given input.
     *  If `includeTx` is true, the transaction property is an array of Transactions;
     *  otherwise, it is a list of transaction hashes.
     *  Rejects with TypeError if input is invalid.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBlockByHash(blockHash: any, includeTx?: boolean): Promise<any>;
    /**
     * Get a block given its number.
     * @param {!number} blockNumber - The number of the desired block.
     * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
     * @return {Promise<ChainAbstractionLayer.schemas.Block, TypeError|InvalidProviderResponseError>}
     *  Resolves with a Block with the same number as the given input.
     *  If `includeTx` is true, the transaction property is an array of Transactions;
     *  otherwise, it is a list of transaction hashes.
     *  Rejects with TypeError if input is invalid.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBlockByNumber(blockNumber: any, includeTx?: boolean): Promise<any>;
    /**
     * Get current block height of the chain.
     * @return {Promise<number, InvalidProviderResponseError>} Resolves with
     *  chain height.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBlockHeight(): Promise<any>;
    /**
     * Get a transaction given its hash.
     * @param {!string} txHash - A hexadecimal string that represents the *hash* of the
     *  desired transaction.
     * @return {Promise<ChainAbstractionLayer.schemas.Transaction, TypeError|InvalidProviderResponseError>}
     *  Resolves with a Transaction with the same hash as the given input.
     *  Rejects with TypeError if input is invalid.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getTransactionByHash(txHash: any): Promise<any>;
    /**
     * Get the balance of an account given its addresses.
     * @param {!string|string[]|Address|Address[]} addresses - An address or a list of addresses.
     * @return {Promise<number, InvalidProviderResponseError>} If addresses is given,
     *  returns the cumulative balance of the given addresses. Otherwise returns the balance
     *  of the addresses that the signing provider controls.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBalance(addresses: any): Promise<BigNumber>;
    /**
     * Check if an address has been used or not.
     * @param {!string|Address} addresses - An address to check for.
     * @return {Promise<boolean>} Resolves to true if provided address is used
     */
    isAddressUsed(address: any): Promise<any>;
    /**
     * Create & sign a transaction.
     * @param {!string} to - Recepient address.
     * @param {!string} value - Value of transaction.
     * @param {!string} data - Data to be passed to the transaction.
     * @param {!string} from - The address from which the message is signed.
     * @return {Promise<string>} Resolves with a signed transaction object.
     */
    buildTransaction(to: any, value: any, data: any, from: any): Promise<any>;
    /**
     * Create & sign a transaction with multiple outputs.
     * @param {string[]} transactions - to, value, data, from.
     * @return {Promise<string>} Resolves with a signed transaction object.
     */
    buildBatchTransaction(transactions: any): Promise<any>;
    /**
     * Create, sign & broadcast a transaction.
     * @param {!string} to - Recepient address.
     * @param {!string} value - Value of transaction.
     * @param {!string} data - Data to be passed to the transaction.
     * @param {!string} [fee] - Fee price in native unit (e.g. sat/b, wei)
     * @return {Promise<Transaction>} Resolves with a signed transaction.
     */
    sendTransaction(to: any, value: any, data: any, fee: any): Promise<any>;
    /**
     * Create, sign & broadcast a sweep transaction.
     * @param {!string} address - External address.
     * @param {number} [fee] - Fee price in native unit (e.g. sat/b, wei)
     * @return {Promise<Transaction>} Resolves with a signed transaction.
     */
    sendSweepTransaction(address: any, fee: any): Promise<any>;
    /**
     * Update the fee of a transaction.
     * @param {(string|Transaction)} tx - Transaction object or hash of the transaction to update
     * @param {!string} newFee - New fee price in native unit (e.g. sat/b, wei)
     * @return {Promise<Transaction>} Resolves with the new transaction
     */
    updateTransactionFee(tx: any, newFee: any): Promise<any>;
    /**
     * Create, sign & broad a transaction with multiple outputs.
     * @param {string[]} transactions - to, value, data, from.
     * @return {Promise<Transaction>} Resolves with a signed transaction.
     */
    sendBatchTransaction(transactions: any): Promise<any>;
    /**
     * Broadcast a signed transaction to the network.
     * @param {!string} rawTransaction - A raw transaction usually in the form of a
     *  hexadecimal string that represents the serialized transaction.
     * @return {Promise<string, InvalidProviderResponseError>} Resolves with an
     *  identifier for the broadcasted transaction.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    sendRawTransaction(rawTransaction: any): Promise<any>;
    getConnectedNetwork(): Promise<any>;
    getFees(): Promise<any>;
}
