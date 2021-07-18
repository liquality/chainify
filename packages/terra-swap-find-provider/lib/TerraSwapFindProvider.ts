import { SwapParams, SwapProvider, terra, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { validateSecretAndHash } from '@liquality/utils'
import { TerraNetwork } from '@liquality/terra-networks'
import { normalizeTransaction, doesTransactionMatchInitiation, validateSwapParams } from '@liquality/terra-utils'

export default class TerraSwapFindProvider extends Provider implements Partial<SwapProvider> {
  private _network: TerraNetwork

  constructor(network: TerraNetwork) {
    super()
    this._network = network
  }

  async findInitiateSwapTransaction(swapParams: SwapParams): Promise<Transaction<terra.InputTransaction>> {
    validateSwapParams(swapParams)

    const { refundAddress } = swapParams

    const transactions = await this.getMethod('_getTransactionsForAddress')(refundAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i], this._network.asset)

      if (doesTransactionMatchInitiation(swapParams, parsedTx._raw)) {
        return parsedTx
      }
    }

    return null
  }

  async findClaimSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string
  ): Promise<Transaction<terra.InputTransaction>> {
    validateSwapParams(swapParams)

    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const { contractAddress } = initTx._raw

    const transactions = await this.getMethod('_getTransactionsForAddress')(contractAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i], this._network.asset)

      if (parsedTx.secret) {
        validateSecretAndHash(parsedTx.secret, swapParams.secretHash)
        return parsedTx
      }
    }

    return null
  }

  async findRefundSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string
  ): Promise<Transaction<terra.InputTransaction>> {
    validateSwapParams(swapParams)

    const initTx = await this.getMethod('getTransactionByHash')(initiationTxHash)

    const { contractAddress } = initTx._raw

    const transactions = await this.getMethod('_getTransactionsForAddress')(contractAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i], this._network.asset)

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
