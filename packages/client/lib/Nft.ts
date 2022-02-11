import { AddressType, BigNumber, FeeType, Transaction } from '@liquality/types';

import Wallet from './Wallet';

export default abstract class Nft<T, S> {
    protected walletProvider: Wallet<T, S>;

    constructor(walletProvider?: Wallet<T, S>) {
        this.walletProvider = walletProvider;
    }

    public setWallet(wallet: Wallet<T, S>): void {
        this.walletProvider = wallet;
    }

    public getWallet(): Wallet<T, S> {
        return this.walletProvider;
    }

    public abstract transfer(
        contract: AddressType,
        receiver: AddressType,
        tokenIDs: number[],
        values?: number[],
        data?: string,
        fee?: FeeType
    ): Promise<Transaction>;

    public abstract balanceOf(contractAddress: AddressType, owners: AddressType[], tokenIDs: number[]): Promise<BigNumber | BigNumber[]>;

    public abstract approve(contract: AddressType, operator: AddressType, tokenID: number): Promise<Transaction>;

    public abstract approveAll(contract: AddressType, operator: AddressType, state: boolean): Promise<Transaction>;

    public abstract isApprovedForAll(contract: AddressType, operator: AddressType): Promise<boolean>;

    public abstract fetch(): void;
}
