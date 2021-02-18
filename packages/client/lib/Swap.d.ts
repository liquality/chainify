export default class Swap {
    constructor(client: any);
    /**
     * Find swap transaction from parameters
     * @param {!number} value - The amount of native value locked in the swap
     * @param {!string} recipientAddress - Recepient address
     * @param {!string} refundAddress - Refund address
     * @param {!string} secretHash - Secret hash
     * @param {!string} expiration - Expiration time
     * @param {!number} blockNumber - The block number to find the transaction in
     * @return {Promise<Transaction>} Resolves with the initiation transaction if found, otherwise null.
     */
    findInitiateSwapTransaction(value: any, recipientAddress: any, refundAddress: any, secretHash: any, expiration: any, blockNumber: any): Promise<any>;
    /**
     * Find swap claim transaction from parameters
     * @param {!string} initiationTxHash - Swap initiation transaction hash/identifier
     * @param {!string} recipientAddress - Recepient address
     * @param {!string} refundAddress - Refund address
     * @param {!string} secretHash - Secret hash
     * @param {!string} expiration - Expiration time
     * @param {!number} blockNumber - The block number to find the transaction in
     * @return {Promise<string>} Resolves with the claim transaction if found, otherwise null.
     */
    findClaimSwapTransaction(initiationTxHash: any, recipientAddress: any, refundAddress: any, secretHash: any, expiration: any, blockNumber: any): Promise<any>;
    /**
     * Refund the swap
     * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
     * @param {!string} recipientAddress - Recepient address for the swap in hex.
     * @param {!string} refundAddress - Refund address for the swap in hex.
     * @param {!string} secretHash - Secret hash for the swap in hex.
     * @param {!number} expiration - Expiration time for the swap.
     * @param {!number} blockNumber - The block number to find the transaction in
     * @return {Promise<string, TypeError>} Resolves with the refund transaction if found, otherwise null.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    findRefundSwapTransaction(initiationTxHash: any, recipientAddress: any, refundAddress: any, secretHash: any, expiration: any, blockNumber: any): Promise<any>;
    /**
     * Find funding transaction
     * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
     * @param {!number} value - The amount of native value locked in the swap.
     * @param {!string} recipientAddress - Recepient address for the swap in hex.
     * @param {!string} refundAddress - Refund address for the swap in hex.
     * @param {!string} secretHash - Secret hash for the swap in hex.
     * @param {!number} expiration - Expiration time for the swap.
     * @param {!number} blockNumber - The block number to find the transaction in
     * @return {Promise<string, TypeError>} Resolves with the funding transaction if found, otherwise null.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    findFundSwapTransaction(initiationTxHash: any, value: any, recipientAddress: any, refundAddress: any, secretHash: any, expiration: any, blockNumber: any): Promise<any>;
    /**
     * Generate a secret.
     * @param {!string} message - Message to be used for generating secret.
     * @param {!string} address - can pass address for async claim and refunds to get deterministic secret
     * @return {Promise<string>} Resolves with a 32 byte secret
     */
    generateSecret(message: any): Promise<any>;
    /**
     * Get secret from claim transaction hash.
     * @param {!string} transaction hash - transaction hash of claim.
     * @return {Promise<string>} Resolves with secret
     */
    getSwapSecret(claimTxHash: any): Promise<any>;
    /**
     * Initiate a swap
     * @param {!number} value - The amount of native value to lock for the swap.
     * @param {!string} recipientAddress - Recepient address for the swap in hex.
     * @param {!string} refundAddress - Refund address for the swap in hex.
     * @param {!string} secretHash - Secret hash for the swap in hex.
     * @param {!number} expiration - Expiration time for the swap.
     * @param {!string} [fee] - Fee price in native unit (e.g. sat/b, gwei)
     * @return {Promise<Transaction, TypeError>} Resolves with swap initiation transaction.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    initiateSwap(value: any, recipientAddress: any, refundAddress: any, secretHash: any, expiration: any, fee: any): Promise<any>;
    /**
     * Create swap script.
     * @param {!string} bytecode - Bytecode to be used for swap.
     * @return {Promise<string, null>} Resolves with swap bytecode.
     */
    createSwapScript(recipientAddress: any, refundAddress: any, secretHash: any, expiration: any): Promise<any>;
    /**
     * Verifies that the given initiation transaction matches the given swap params
     * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
     * @param {!number} value - The amount of native value locked in the swap.
     * @param {!string} recipientAddress - Recepient address for the swap in hex.
     * @param {!string} refundAddress - Refund address for the swap in hex.
     * @param {!string} secretHash - Secret hash for the swap in hex.
     * @param {!number} expiration - Expiration time for the swap.
     * @return {Promise<boolean, TypeError>} Resolves with true if verification has passed.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    verifyInitiateSwapTransaction(initiationTxHash: any, value: any, recipientAddress: any, refundAddress: any, secretHash: any, expiration: any): Promise<any>;
    /**
     * Claim the swap
     * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
     * @param {!string} recipientAddress - Recepient address for the swap in hex.
     * @param {!string} refundAddress - Refund address for the swap in hex.
     * @param {!string} secret - 32 byte secret for the swap in hex.
     * @param {!number} expiration - Expiration time for the swap.
     * @param {!string} [fee] - Fee price in native unit (e.g. sat/b, gwei)
     * @return {Promise<Transaction, TypeError>} Resolves with swap claim transaction.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    claimSwap(initiationTxHash: any, recipientAddress: any, refundAddress: any, secret: any, expiration: any, fee: any): Promise<any>;
    /**
     * Refund the swap
     * @param {!string} initiationTxHash - The transaction hash of the swap initiation.
     * @param {!string} recipientAddress - Recepient address for the swap in hex.
     * @param {!string} refundAddress - Refund address for the swap in hex.
     * @param {!string} secretHash - Secret hash for the swap in hex.
     * @param {!number} expiration - Expiration time for the swap.
     * @param {!string} [fee] - Fee price in native unit (e.g. sat/b, gwei)
     * @return {Promise<string, TypeError>} Resolves with refund swap transaction hash.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    refundSwap(initiationTxHash: any, recipientAddress: any, refundAddress: any, secretHash: any, expiration: any, fee: any): Promise<any>;
    get doesBlockScan(): any;
}
