import { SwapParams, SwapProvider, Transaction, BigNumber } from '@liquality/types';
export default class Swap implements SwapProvider {
    client: any;
    constructor(client: any);
    /** @inheritdoc */
    findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction>;
    /** @inheritdoc */
    findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction>;
    /** @inheritdoc */
    findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction>;
    /** @inheritdoc */
    findFundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction | null>;
    /** @inheritdoc */
    generateSecret(message: string): Promise<string>;
    /** @inheritdoc */
    getSwapSecret(claimTxHash: string): Promise<string>;
    /** @inheritdoc */
    initiateSwap(swapParams: SwapParams, fee: BigNumber): Promise<Transaction>;
    /** @inheritdoc */
    fundSwap(swapParams: SwapParams, initiationTxHash: string, fee: BigNumber): Promise<Transaction | null>;
    /** @inheritdoc */
    verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean>;
    /** @inheritdoc */
    claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: BigNumber): Promise<Transaction>;
    /** @inheritdoc */
    refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: BigNumber): Promise<Transaction>;
    /** @inheritdoc */
    get doesBlockScan(): boolean;
}
