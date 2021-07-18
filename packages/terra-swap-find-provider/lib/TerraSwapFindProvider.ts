import { SwapParams, SwapProvider, Transaction, Address } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { NodeProvider } from '@liquality/node-provider'
import { TerraNetwork } from '@liquality/terra-networks'
import { normalizeTransaction, doesTransactionMatchInitiation } from '@liquality/terra-utils'

export default class TerraSwapFindProvider extends NodeProvider implements Partial<SwapProvider> {
  private _network: TerraNetwork

  constructor(network: TerraNetwork) {
    super({
      baseURL: network.helperUrl,
      responseType: 'text',
      transformResponse: undefined
    })

    this._network = network
  }

  async findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction<any>> {
    const { refundAddress } = swapParams

    const transactions = await this._getTransactionsForAddress(refundAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i])

      if (doesTransactionMatchInitiation(swapParams, parsedTx._raw)) {
        return parsedTx
      }
    }

    return null
  }

  findClaimSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  findRefundSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }

  async _getTransactionsForAddress(address: Address | string): Promise<any> {
    const response = await this.nodeGet(
      `${this._network.helperUrl}/txs?account=${addressToString(address)}&limit=10&action=contract`
    )

    return response.txs
  }
}
