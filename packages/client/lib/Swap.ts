import { Transaction, FeeData, SwapParams, BigNumberish, TxStatus } from '@liquality/types';
import { validateValue, validateSecretHash, validateExpiration, sha256 } from '@liquality/utils';
import { TxNotFoundError, TxFailedError, PendingTxError, InvalidSwapParamsError } from '@liquality/errors';

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

    public async verifyInitiateSwapTransaction(swapParams: SwapParams, initTx: string | Transaction): Promise<void> {
        this.validateSwapParams(swapParams);
        const transaction = typeof initTx === 'string' ? await this.walletProvider.getChainProvider().getTransactionByHash(initTx) : initTx;

        if (!transaction) {
            throw new TxNotFoundError(`Transaction not found: ${initTx}`);
        }

        const doesMatch = await this.doesTransactionMatchInitiation(swapParams, transaction);

        if (transaction.status !== TxStatus.Success) {
            throw new TxFailedError('Transaction not successful');
        }

        if (!(transaction.confirmations > 0)) {
            throw new PendingTxError(`Transaction not confirmed ${transaction.confirmations}`);
        }

        if (!doesMatch) {
            throw new InvalidSwapParamsError(`Swap params does not match the transaction`);
        }
    }

    public validateSwapParams(swapParams: SwapParams): void {
        validateValue(swapParams.value);
        validateSecretHash(swapParams.secretHash);
        validateExpiration(swapParams.expiration);
    }

    public async generateSecret(message: string): Promise<string> {
        const address = await this.walletProvider.getAddress();
        const signedMessage = await this.walletProvider.signMessage(message, address);
        const secret = sha256(signedMessage);
        return secret;
    }

    public abstract initiateSwap(swapParams: SwapParams, fee?: FeeData): Promise<Transaction>;
    public abstract findInitiateSwapTransaction(swapParams: SwapParams, _blockNumber?: BigNumberish): Promise<Transaction>;

    public abstract claimSwap(swapParams: SwapParams, initTx: string, secret: string, fee?: FeeData): Promise<Transaction>;
    public abstract findClaimSwapTransaction(swapParams: SwapParams, initTxHash: string, blockNumber?: number): Promise<Transaction>;

    public abstract refundSwap(swapParams: SwapParams, initTx: string, fee?: FeeData): Promise<Transaction>;
    public abstract findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction>;

    public abstract getSwapSecret(claimTxHash: string): Promise<string>;

    protected abstract doesTransactionMatchInitiation(swapParams: SwapParams, transaction: Transaction): Promise<boolean> | boolean;
}
