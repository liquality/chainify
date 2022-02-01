import { AddressType, Asset, BigNumberish, FeeData, Transaction, TransactionRequest } from '@liquality/types';
import Chain from './Chain';

export default abstract class Wallet<T, S> {
    protected chainProvider: Chain<T>;

    constructor(chainProvider?: Chain<T>) {
        this.chainProvider = chainProvider;
    }

    setChainProvider(chainProvider: Chain<T>): void {
        this.chainProvider = chainProvider;
    }

    getChainProvider(): Chain<T> {
        return this.chainProvider;
    }

    public abstract getSigner(): S;

    public abstract getAddress(): Promise<AddressType>;

    public abstract getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<AddressType>;

    public abstract getUsedAddresses(numAddressPerCall?: number): Promise<AddressType[]>;

    public abstract getAddresses(start?: number, numAddresses?: number, change?: boolean): Promise<AddressType[]>;

    public abstract signMessage(message: string, from: AddressType): Promise<string>;

    public abstract sendTransaction(txRequest: TransactionRequest): Promise<Transaction>;

    public abstract sendBatchTransaction(txRequests: TransactionRequest[]): Promise<Transaction[]>;

    public abstract sendSweepTransaction(address: AddressType, asset: Asset, fee?: FeeData): Promise<Transaction>;

    public abstract updateTransactionFee(tx: string | Transaction, newFee: FeeData): Promise<Transaction>;

    public abstract getBalance(assets: Asset[]): Promise<BigNumberish[]>;

    public abstract exportPrivateKey(): Promise<string>;

    public abstract isWalletAvailable(): Promise<boolean>;

    public abstract canUpdateFee(): boolean;
}
