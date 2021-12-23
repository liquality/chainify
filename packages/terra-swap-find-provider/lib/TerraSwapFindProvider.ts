import { Address, SwapParams, SwapProvider, terra, Transaction } from '@liquality/types'
import { addressToString, validateSecretAndHash } from '@liquality/utils'
import { TerraNetwork } from '@liquality/terra-networks'
import { normalizeTransaction, doesTransactionMatchInitiation, validateSwapParams } from '@liquality/terra-utils'
import { TxNotFoundError } from '@liquality/errors'
import { NodeProvider } from '@liquality/node-provider'

export default class TerraSwapFindProvider extends NodeProvider implements Partial<SwapProvider> {
  private _network: TerraNetwork
  private _asset: string

  constructor(network: TerraNetwork, asset: string) {
    super({
      baseURL: network.helperUrl,
      responseType: 'text',
      transformResponse: undefined
    })

    this._network = network
    this._asset = asset
  }

  async findInitiateSwapTransaction(swapParams: SwapParams): Promise<Transaction<terra.InputTransaction>> {
    validateSwapParams(swapParams)

    const { refundAddress } = swapParams

    const transactions = await this._getTransactionsForAddress(refundAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i], this._asset)

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

    const transactions = await this._getTransactionsForAddress(contractAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i], this._asset)

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

    const transactions = await this._getTransactionsForAddress(contractAddress)

    for (let i = 0; i < transactions.length; i++) {
      const parsedTx = normalizeTransaction(transactions[i], this._asset)

      if (parsedTx._raw.method?.refund) {
        return parsedTx
      }
    }

    return null
  }

  async findFundSwapTransaction(): Promise<null> {
    return null
  }

  async _getTransactionsForAddress(address: Address | string): Promise<any[]> {
    const url = `${this._network.helperUrl}/txs?account=${addressToString(address)}&limit=100`

    const response = await this.nodeGet(url)

    if (!response?.txs) {
      throw new TxNotFoundError(`Transactions not found: ${address}`)
    }

    return response.txs
  }
}
