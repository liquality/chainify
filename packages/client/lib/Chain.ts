import { AddressType, Block, Network, Transaction, BigNumberish, FeeData, Asset } from '@liquality/types';

export default abstract class Chain<T> {
    protected network: Network;
    protected provider: T;

    constructor(network: Network, provider?: T) {
        this.network = network;
        if (provider) {
            this.provider = provider;
        }
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

    public abstract getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block>;

    public abstract getBlockByNumber(blockNumber: BigNumberish, includeTx?: boolean): Promise<Block>;

    public abstract getBlockHeight(): Promise<BigNumberish>;

    public abstract getTransactionByHash(txHash: string): Promise<Transaction>;

    public abstract getBalance(addresses: AddressType[], assets: Asset[]): Promise<BigNumberish[]>;

    public abstract getFees(): Promise<FeeData>;

    public abstract sendRawTransaction(rawTransaction: string): Promise<string>;

    public abstract sendRpcRequest(method: string, params: Array<any>): Promise<any>;
}
