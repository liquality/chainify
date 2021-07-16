import { SwapParams, SwapProvider, Transaction } from "@liquality/types";
import { Provider } from "@liquality/provider";
export default class TerraSwapFindProvider extends Provider implements Partial<SwapProvider> {
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
}
