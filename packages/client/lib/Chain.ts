import { UnsupportedMethodError } from '@chainify/errors';
import {
    AddressType,
    Asset,
    BigNumber,
    Block,
    ChainProvider,
    FeeDetails,
    Network,
    Nullable,
    TokenDetails,
    Transaction,
} from '@chainify/types';
import { Fee } from '.';

/**
 * Represents a connection to a specific blockchain.
 * Used to fetch chain specific data like blocks, transactions, balances and fees.
 * @public
 * @typeParam T - type of the internal provider, e.g. {@link https://docs.ethers.io/v5/api/providers/jsonrpc-provider/ | JsonRpcProvider} for EVM chains
 * @typeParam N - type of the network. The default value of the type is {@link Network}
 */
export default abstract class Chain<T, N extends Network = Network> implements ChainProvider {
    protected feeProvider: Nullable<Fee>;
    protected network: N;
    protected provider: T;

    constructor(network: N, provider?: T, feeProvider?: Fee) {
        this.network = network;
        this.provider = provider;
        this.feeProvider = feeProvider;
    }

    /**
     * Sets the network
     */
    public setNetwork(network: N): void {
        this.network = network;
    }

    /**
     * Gets the connected network
     */
    public getNetwork(): N {
        return this.network;
    }

    /**
     * Gets the chain specific provider
     */
    public getProvider(): T {
        return this.provider;
    }

    /**
     * Sets the chain specific provider
     */
    public async setProvider(provider: T): Promise<void> {
        this.provider = provider;
    }

    /**
     * Sets the fee provider
     */
    public async setFeeProvider(feeProvider: Nullable<Fee>) {
        this.feeProvider = feeProvider;
    }

    /**
     * Gets the fee provider
     */
    public async getFeeProvider() {
        return this.feeProvider;
    }

    /**
     * Use to fetch the decimals, name & symbol of a token
     */
    public async getTokenDetails(_asset: string): Promise<TokenDetails> {
        throw new UnsupportedMethodError(`${this.network.name} does not support getTokenDetails.`);
    }

    /**
     * @virtual
     * Get a block given its hash.
     * @param blockHash - A string that represents the **hash** of the desired block.
     * @param includeTx - If true, fetches transactions in the block.
     * @throws {@link UnsupportedMethodError} - Thrown if the chain doesn't support the method
     * @throws {@link BlockNotFoundError} - Thrown if the block doesn't exist
     */
    public abstract getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block>;

    /**
     * @virtual
     * Get a block given its number.
     * @param blockNumber - The number of the desired block. If the `blockNumber` is missing, it returns the latest block
     * @param includeTx - If true, fetches transaction in the block.
     *  Resolves with a Block with the same number as the given input.
     */
    public abstract getBlockByNumber(blockNumber?: number, includeTx?: boolean): Promise<Block>;

    /**
     * @virtual
     * Get current block height of the chain.
     */
    public abstract getBlockHeight(): Promise<number>;

    /**
     * @virtual
     * Get a transaction given its hash.
     * @param txHash - A string that represents the **hash** of the
     *  desired transaction.
     *  Resolves with a {@link Transaction} with the same hash as the given input.
     */
    public abstract getTransactionByHash(txHash: string): Promise<Transaction>;

    /**
     * @virtual
     * Get the balance for list of accounts and list of assets
     */
    public abstract getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]>;

    /**
     * @virtual
     * @returns The fee details - {@link FeeDetails}
     */
    public abstract getFees(feeAsset?: Asset): Promise<FeeDetails>;

    /**
     * @virtual
     * Broadcast a signed transaction to the network.
     * @param rawTransaction - A raw transaction usually in the form of a hexadecimal string that represents the serialized transaction.
     * @throws {@link UnsupportedMethodError} - Thrown if the chain doesn't support sending of raw transactions
     * @returns the transaction hash
     */
    public abstract sendRawTransaction(rawTransaction: string): Promise<string>;

    /**
     * @virtual
     * Used to send supported RPC requests to the RPC node
     * @throws {@link UnsupportedMethodError} - Thrown if the chain provider doesn't support RPC requests
     */
    public abstract sendRpcRequest(method: string, params: Array<any>): Promise<any>;
}
