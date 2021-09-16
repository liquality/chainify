import { SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
export default class FlowSwapFindProvider extends Provider implements Partial<SwapProvider> {
  findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction<any>> {
    console.log(swapParams, blockNumber)

    throw new Error('Method not implemented.')
  }
  findClaimSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    console.log(swapParams, initiationTxHash, blockNumber)

    throw new Error('Method not implemented.')
  }
  findRefundSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    console.log(swapParams, initiationTxHash, blockNumber)

    throw new Error('Method not implemented.')
  }
  findFundSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    console.log(swapParams, initiationTxHash, blockNumber)

    throw new Error('Method not implemented.')
  }
}
