import { SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { PendingTxError } from '@liquality/errors'
import { addressToString } from '@liquality/utils'
import { doesTransactionMatchInitiation, validateSwapParams, validateSecret } from '@liquality/solana-utils'
import { SolanaNetwork } from '@liquality/solana-networks'

export default class SolanaSwapFindProvider extends Provider implements Partial<SwapProvider> {
  private _network: SolanaNetwork
  private instructions = {
    init: 0,
    claim: 1,
    refund: 2
  }

  constructor(network: SolanaNetwork) {
    super()
    this._network = network
  }

  async findInitiateSwapTransaction(swapParams: SwapParams): Promise<Transaction> {
    validateSwapParams(swapParams)

    const { programId } = this._network

    return await this._findTransactionByAddress({
      address: addressToString(programId),
      swapParams,
      instruction: this.instructions.init,
      validation: doesTransactionMatchInitiation
    })
  }

  async findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<Transaction> {
    validateSwapParams(swapParams)

    const [initTransaction] = await this.getMethod('getTransactionReceipt')([initiationTxHash])

    if (!initTransaction) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }

    const {
      _raw: { programAccount }
    } = initTransaction

    return await this._findTransactionByAddress({
      swapParams,
      address: programAccount,
      instruction: this.instructions.claim,
      validation: validateSecret
    })
  }

  async findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<Transaction> {
    validateSwapParams(swapParams)

    const [initTransaction] = await this.getMethod('getTransactionReceipt')([initiationTxHash])

    if (!initTransaction) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }

    const {
      _raw: { programAccount }
    } = initTransaction

    return await this._findTransactionByAddress({
      swapParams,
      address: programAccount,
      instruction: this.instructions.refund
    })
  }

  async findFundSwapTransaction(): Promise<null> {
    return null
  }

  _batchSignatures(addressHistory: [{ signature: string }]): string[][] {
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
    validation?: (swapParams: SwapParams, transactionData: any | { secret: string }) => boolean
  }): Promise<Transaction> {
    const addressHistory = await this.getMethod('_getAddressHistory')(address)

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
