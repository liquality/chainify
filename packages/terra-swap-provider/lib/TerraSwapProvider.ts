import { SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { sha256 } from '@liquality/crypto'
import { TxNotFoundError, StandardError } from '@liquality/errors'
import { doesTransactionMatchInitiation } from '@liquality/terra-utils'

export default class TerraSwapProvider extends Provider implements Partial<SwapProvider> {
  async generateSecret(message: string): Promise<string> {
    return sha256(message)
  }

  async getSwapSecret(claimTxHash: string): Promise<string> {
    const transaction = await this.getMethod('getTransactionByHash')(claimTxHash)

    if (!transaction) {
      throw new TxNotFoundError(`Transaction with hash: ${claimTxHash} was not found`)
    }

    return transaction?.secret
  }

  async initiateSwap(swapParams: SwapParams, fee: number): Promise<Transaction<any>> {
    const initContractMsg = this.getMethod('_instantiateContractMessage')(swapParams)

    const transaction = await this.getMethod('sendTransaction')({
      messages: [initContractMsg]
    })

    return transaction
  }

  async claimSwap(
    swapParams: SwapParams,
    initiationTxHash: string,
    secret: string,
    fee: number
  ): Promise<Transaction<any>> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const executeContractMsg = this.getMethod('_executeContractMessage')(initTx._raw.contractAddress, {
      claim: { secret }
    })

    const transaction = await this.getMethod('sendTransaction')({
      messages: [executeContractMsg]
    })

    return transaction
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string, fee: number): Promise<Transaction<any>> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const executeContractMsg = this.getMethod('_executeContractMessage')(initTx._raw.contractAddress, {
      refund: {}
    })

    const transaction = await this.getMethod('sendTransaction')({
      messages: [executeContractMsg]
    })

    return transaction
  }

  async fundSwap(): Promise<null> {
    return null
  }

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    if (!initTx) {
      throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)
    }

    if (!doesTransactionMatchInitiation(swapParams, initTx._raw)) {
      throw new StandardError('Transactions are not matching')
    }

    return true
  }
}
