import { SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { PendingTxError } from '@liquality/errors'
import { addressToString } from '@liquality/utils'
import { compareParams, _validateSecret } from '@liquality/solana-utils'

export default class SolanaSwapFindProvider extends Provider implements Partial<SwapProvider> {
  private instructions = {
    init: 0,
    claim: 1,
    refund: 2
  }

  async findInitiateSwapTransaction(swapParams: SwapParams): Promise<Transaction> {
    const { refundAddress } = swapParams

    return await this._findTransactionByAddress({
      address: addressToString(refundAddress),
      swapParams,
      instruction: this.instructions.init,
      validation: compareParams
    })
  }

  async findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<Transaction> {
    const [initTransaction] = await this.getMethod('getTransactionReceipt')([initiationTxHash])

    if (!initTransaction) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }

    const {
      _raw: { buyer }
    } = initTransaction

    return await this._findTransactionByAddress({
      swapParams,
      address: buyer,
      instruction: this.instructions.claim,
      validation: _validateSecret
    })
  }

  async findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<Transaction> {
    const [initTransaction] = await this.getMethod('getTransactionReceipt')([initiationTxHash])

    if (!initTransaction) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }

    const {
      _raw: { seller }
    } = initTransaction

    return await this._findTransactionByAddress({
      swapParams,
      address: seller,
      instruction: this.instructions.refund
    })
  }

  async findFundSwapTransaction(): Promise<null> {
    return null
  }

  _batchSignatures(addressHistory: object[]): string[][] {
    const batches: string[][] = [[]]

    let currentBatch = 0

    const MAX_NUMBER_OF_REQUESTS = 100

    addressHistory.forEach((pastTx: { signature: string }, idx: number) => {
      if (idx && idx % MAX_NUMBER_OF_REQUESTS === 0) {
        currentBatch++
        batches.push([])
      }

      batches[currentBatch].push(pastTx.signature)
    })

    return batches
  }

  async _findTransactionByAddress({
    address,
    swapParams,
    instruction,
    validation
  }: {
    address: string
    swapParams: SwapParams
    instruction: number
    validation?: Function
  }): Promise<Transaction> {
    const addressHistory = await this.getMethod('getAddressHistory')(address)

    const batch = this._batchSignatures(addressHistory)

    const parsedTransactions = batch.map((sp) => this.getMethod('getTransactionReceipt')(sp))

    const parsedTransactionsData = await Promise.all(parsedTransactions)

    let initTransaction

    for (let i = 0; i < parsedTransactionsData.length; i++) {
      for (let j = 0; j < parsedTransactionsData[i].length; j++) {
        const data = parsedTransactionsData[i][j]

        if (data._raw?.instruction === instruction) {
          if (instruction === this.instructions.refund) {
            initTransaction = data
            break
          } else if (validation(swapParams, data._raw)) {
            initTransaction = data
            initTransaction.secret = data.secret
            break
          }
        }
      }

      if (initTransaction) {
        break
      }
    }

    return initTransaction
  }
}
