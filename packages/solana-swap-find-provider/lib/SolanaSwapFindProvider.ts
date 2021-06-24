import { BigNumber, SwapParams, SwapProvider, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'

import _filter from 'lodash/filter'

export default class SolanaSwapFindProvider extends Provider implements Partial<SwapProvider> {
  async findInitiateSwapTransaction(swapParams: SwapParams, blockNumber?: number): Promise<Transaction<any>> {
    const { refundAddress } = swapParams

    const addressHistory = await this.getMethod('getAddressHistory')(refundAddress)

    const batch = this._batchSignatures(addressHistory)

    const parsedTransactions = batch.map((sp) => this.getMethod('getParsedAndConfirmedTransactions')(sp))

    const data = await Promise.all(parsedTransactions)

    const deserialized = data.map((entity) => entity.forEach((e: any) => this.getMethod('_deserialize')(e)))

    console.log(deserialized)

    return null
  }

  async findClaimSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    // const transaction = await this.getMethod('getTransactionByHash')(initiationTxHash)

    // console.log(transaction)

    return null
  }

  findRefundSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  findFundSwapTransaction(
    swapParams: SwapParams,
    initiationTxHash: string,
    blockNumber?: number
  ): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }

  _compareParams(
    swapParams: SwapParams,
    initTxParams: { buyer: string; seller: string; secret_hash: string; value: BigNumber; expiration: BigNumber }
  ): boolean {
    return (
      swapParams.recipientAddress === initTxParams.buyer &&
      swapParams.refundAddress === initTxParams.seller &&
      swapParams.secretHash === initTxParams.secret_hash &&
      swapParams.value.eq(initTxParams.value) &&
      new BigNumber(swapParams.expiration).eq(initTxParams.expiration)
    )
  }

  _batchSignatures(addressHistory: string[]) {
    const batches: string[][] = [[]]

    let currentBatch = 0

    const MAX_NUMBER_OF_REQUESTS = 100

    addressHistory.forEach((pastTx: any, idx: number) => {
      if (idx && idx % MAX_NUMBER_OF_REQUESTS === 0) {
        currentBatch++
        batches.push([])
      }

      batches[currentBatch].push(pastTx.signature)
    })

    return batches
  }

  _decode(data: any) {
    let filtered: any = []
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        const { transaction } = data[i][j]

        if (transaction.message?.instructions) {
          const entity = _filter(transaction.message.instructions, 'data')

          if (entity.length) {
            filtered.push(entity[0].data)
          }
        }
      }
    }
  }
}
