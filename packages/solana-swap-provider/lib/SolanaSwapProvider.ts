// import { SwapParams, SwapProvider, Transaction } from '@liquality/types'
// import { Provider } from '@liquality/provider'
// export default class SolanaSwapProvider extends Provider implements Partial<SwapProvider> {
//   doesBlockScan: boolean | (() => boolean)

//   generateSecret(message: string): Promise<string> {
//     throw new Error('Method not implemented.')
//   }
//   getSwapSecret(claimTxHash: string): Promise<string> {
//     throw new Error('Method not implemented.')
//   }
//   initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction<any>> {
//     throw new Error('Method not implemented.')
//   }
//   // Pass
//   fundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
//     throw new Error('Method not implemented.')
//   }
//   verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
//     throw new Error('Method not implemented.')
//   }
//   claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: number): Promise<Transaction<any>> {
//     throw new Error('Method not implemented.')
//   }
//   refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
//     throw new Error('Method not implemented.')
//   }
// }
