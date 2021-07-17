import { SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { sha256 } from '@liquality/crypto'

export default class TerraSwapProvider extends Provider implements Partial<SwapProvider> {
  async generateSecret(message: string): Promise<string> {
    return sha256(message)
  }

  getSwapSecret(claimTxHash: string): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction<any>> {
    const initContractMsg = this.getMethod('_instantiateContractMessage')(swapParams)

    const transaction = await this.getMethod('sendTransaction')({
      messages: [initContractMsg]
    })

    return {
      ...transaction
    }
  }

  claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, fee: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
