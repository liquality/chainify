import { Asset, BigNumber } from '.';
import { Block } from './Block';
import { AddressType } from './Address';
import { Transaction } from './Transaction';

export interface ChainProvider {
    /**
     * Get a block given its hash.
     * @param {!string} blockHash - A hexadecimal string that represents the
     *  *hash* of the desired block.
     * @param {boolean} [includeTx=false] - If true, fetches transactions in the block.
     * @return {Promise<Block, TypeError|InvalidProviderResponseError>}
     *  Resolves with a Block with the same hash as the given input.
     *  If `includeTx` is true, the transaction property is an array of Transactions;
     *  otherwise, it is a list of transaction hashes.
     *  Rejects with TypeError if input is invalid.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block>;

    /**
     * Get a block given its number.
     * @param {!number} blockNumber - The number of the desired block.
     * @param {boolean} [includeTx=false] - If true, fetches transaction in the block.
     * @return {Promise<Block, TypeError|InvalidProviderResponseError>}
     *  Resolves with a Block with the same number as the given input.
     *  If `includeTx` is true, the transaction property is an array of Transactions;
     *  otherwise, it is a list of transaction hashes.
     *  Rejects with TypeError if input is invalid.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block>;

    /**
     * Get current block height of the chain.
     * @return {Promise<number, InvalidProviderResponseError>} Resolves with
     *  chain height.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBlockHeight(): Promise<number>;

    /**
     * Get a transaction given its hash.
     * @param {!string} txHash - A hexadecimal string that represents the *hash* of the
     *  desired transaction.
     * @return {Promise<Transaction, TypeError|InvalidProviderResponseError>}
     *  Resolves with a Transaction with the same hash as the given input.
     *  Rejects with TypeError if input is invalid.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getTransactionByHash(txHash: string): Promise<Transaction>;

    /**
     * Get the balance of an account given its addresses.
     * @param {AddressType[]} addresses - A list of addresses.
     * @return {Promise<BigNumber, InvalidProviderResponseError>} If addresses is given,
     *  returns the cumulative balance of the given addresses. Otherwise returns the balance
     *  of the addresses that the signing provider controls.
     *  Rejects with InvalidProviderResponseError if provider's response is invalid.
     */
    getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]>;
}
