import { UnsupportedMethodError } from '@chainify/errors';
import { Address, AddressType, Asset, BigNumber, FeeType, Network, Transaction, TransactionRequest, WalletProvider } from '@chainify/types';
import Chain from './Chain';

export default abstract class Wallet<T, S> implements WalletProvider {
    protected chainProvider: Chain<T>;

    constructor(chainProvider?: Chain<T>) {
        this.chainProvider = chainProvider;
    }

    setChainProvider(chainProvider: Chain<T>): void {
        this.chainProvider = chainProvider;
        this.onChainProviderUpdate(chainProvider);
    }

    getChainProvider(): Chain<T> {
        return this.chainProvider;
    }

    public signTypedData(_data: any): Promise<string> {
        throw new UnsupportedMethodError('Method not supported');
    }

    public abstract getConnectedNetwork(): Promise<Network>;

    public abstract getSigner(): S;

    public abstract getAddress(): Promise<AddressType>;

    public abstract getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address>;

    public abstract getUsedAddresses(numAddressPerCall?: number): Promise<Address[]>;

    public abstract getAddresses(start?: number, numAddresses?: number, change?: boolean): Promise<Address[]>;

    public abstract signMessage(message: string, from: AddressType): Promise<string>;

    public abstract sendTransaction(txRequest: TransactionRequest): Promise<Transaction>;

    public abstract sendBatchTransaction(txRequests: TransactionRequest[]): Promise<Transaction[]>;

    public abstract sendSweepTransaction(address: AddressType, asset: Asset, fee?: FeeType): Promise<Transaction>;

    public abstract updateTransactionFee(tx: string | Transaction, newFee: FeeType): Promise<Transaction>;

    public abstract getBalance(assets: Asset[]): Promise<BigNumber[]>;

    public abstract exportPrivateKey(): Promise<string>;

    public abstract isWalletAvailable(): Promise<boolean>;

    public abstract canUpdateFee(): boolean;

    protected abstract onChainProviderUpdate(chainProvider: Chain<T>): void;
}
