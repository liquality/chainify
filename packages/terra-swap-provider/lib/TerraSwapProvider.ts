import { SwapParams, SwapProvider, Transaction } from "@liquality/types";
import { Provider } from "@liquality/provider";
export default class TerraSwapProvider extends Provider implements Partial<SwapProvider> {
    doesBlockScan: boolean | (() => boolean);
    findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    findFundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber?: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    generateSecret(message: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    getSwapSecret(claimTxHash: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    fundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
    refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
        throw new Error("Method not implemented.");
    }
}
