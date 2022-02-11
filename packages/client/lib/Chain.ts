import { AddressType, Asset, BigNumber, Block, ChainProvider, FeeDetails, Network, Transaction } from '@liquality/types';
import { Fee } from '.';

export default abstract class Chain<T> implements ChainProvider {
    protected feeProvider: Fee;
    protected network: Network;
    protected provider: T;

    constructor(network: Network, provider?: T, feeProvider?: Fee) {
        this.network = network;
        this.provider = provider;
        this.feeProvider = feeProvider;
    }

    public setNetwork(network: Network): void {
        this.network = network;
    }

    public getNetwork() {
        return this.network;
    }

    public getProvider(): T {
        return this.provider;
    }

    public async setProvider(provider: T): Promise<void> {
        this.provider = provider;
    }

    public async setFeeProvider(feeProvider: Fee) {
        this.feeProvider = feeProvider;
    }

    public async getFeeProvider() {
        return this.feeProvider;
    }

    public abstract getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block>;

    public abstract getBlockByNumber(blockNumber?: number, includeTx?: boolean): Promise<Block>;

    public abstract getBlockHeight(): Promise<number>;

    public abstract getTransactionByHash(txHash: string): Promise<Transaction>;

    public abstract getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumber[]>;

    public abstract getFees(): Promise<FeeDetails>;

    public abstract sendRawTransaction(rawTransaction: string): Promise<string>;

    public abstract sendRpcRequest(method: string, params: Array<any>): Promise<any>;
}
