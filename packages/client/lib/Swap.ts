import { compare, Math } from '@liquality/utils';
import { Transaction, FeeData, SwapParams } from '@liquality/types';
import { sha256 } from '@ethersproject/sha2';

import Wallet from './Wallet';

export default abstract class Swap<T, S> {
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

    public async verifyInitiateSwapTransaction(swapParams: SwapParams, transaction: any): Promise<boolean> {
        const doesMatch = await this.doesTransactionMatchInitiation();

        return (
            doesMatch &&
            Math.eq(transaction.value, swapParams.value) &&
            Math.eq(transaction.expiration, swapParams.expiration) &&
            compare(transaction.recipientAddress, swapParams.recipientAddress.toString()) &&
            compare(transaction.refundAddress, swapParams.refundAddress.toString()) &&
            compare(transaction.secretHash, swapParams.secretHash)
        );
    }

    public async generateSecret(message: string): Promise<string> {
        const address = await this.walletProvider.getAddress();
        const signedMessage = await this.walletProvider.signMessage(message, address);
        const secret = sha256(signedMessage);
        return secret;
    }

    public abstract getSwapSecret(claimTxHash: string): Promise<string>;

    public abstract initiateSwap(swapParams: SwapParams, fee: FeeData): Promise<Transaction>;

    public abstract claimSwap(swapParams: SwapParams, initTxHash: string, secret: string, fee: FeeData): Promise<Transaction>;

    public abstract refundSwap(swapParams: SwapParams, initTxHash: string, fee: FeeData): Promise<Transaction>;

    protected abstract doesTransactionMatchInitiation(): Promise<boolean>;
}
