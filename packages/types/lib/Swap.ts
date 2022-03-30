import { Asset, BigNumber, FeeType } from '.';
import { AddressType } from './Address';
import { Transaction } from './Transaction';

export interface SwapParams {
    asset: Asset;
    /**
     * The amount of native value locked in the swap
     */
    value: BigNumber;
    /**
     * Recepient address of the swap
     */
    recipientAddress: AddressType;
    /**
     * Refund address of the swap
     */
    refundAddress: AddressType;
    /**
     * Secret Hash
     */
    secretHash: string;
    /**
     * Expiration of the swap
     */
    expiration: number;
}

export interface SwapProvider {
    findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction>;

    findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction>;

    findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction>;

    generateSecret(message: string): Promise<string>;

    getSwapSecret(claimTxHash: string, initTxHash?: string): Promise<string>;

    initiateSwap(swapParams: SwapParams, fee: FeeType): Promise<Transaction>;

    verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string | Transaction): Promise<boolean>;

    claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: FeeType): Promise<Transaction>;

    refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: FeeType): Promise<Transaction>;
}
