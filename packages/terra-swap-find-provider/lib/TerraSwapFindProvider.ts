import { SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { normalizeTransaction, doesTransactionMatchInitiation } from '@liquality/terra-utils'
import { Provider } from '@liquality/provider'
import { validateSecretAndHash } from '@liquality/utils'

export default class TerraSwapFindProvider extends Provider implements Partial<SwapProvider> {
  async findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction> {
    const { refundAddress } = swapParams

    const transactions = await this.getMethod('_getTransactionsForAddress')(refundAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i])

      if (doesTransactionMatchInitiation(swapParams, parsedTx._raw)) {
        return parsedTx
      }
    }

    return null
  }

  async findClaimSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction> {
    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const { contractAddress } = initTx._raw

    const transactions = await this.getMethod('_getTransactionsForAddress')(contractAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i])

      if (parsedTx.secret) {
        validateSecretAndHash(parsedTx.secret, swapParams.secretHash)
        return parsedTx
      }
    }

    return null
  }

  async findRefundSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction> {
    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const { contractAddress } = initTx._raw

    const transactions = await this.getMethod('_getTransactionsForAddress')(contractAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i])

      if (parsedTx._raw.method.refund) {
        return parsedTx
      }
    }

    return null
  }

  async findFundSwapTransaction(): Promise<null> {
    return null
  }
}
