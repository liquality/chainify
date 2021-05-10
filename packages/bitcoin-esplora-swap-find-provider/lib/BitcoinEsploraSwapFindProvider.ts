import { NodeProvider } from '@liquality/node-provider'
import { SwapParams, Transaction, bitcoin } from '@liquality/types'
import { payments } from 'bitcoinjs-lib'

type TransactionMatchesFunction = (tx: Transaction<bitcoin.Transaction>) => boolean
type PaymentVariants = {
  [bitcoin.SwapMode.P2WSH]?: payments.Payment
  [bitcoin.SwapMode.P2SH_SEGWIT]?: payments.Payment
  [bitcoin.SwapMode.P2SH]?: payments.Payment
}

export default class BitcoinEsploraSwapFindProvider extends NodeProvider {
  constructor(url: string) {
    super({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  async findAddressTransaction(address: string, currentHeight: number, predicate: TransactionMatchesFunction) {
    // TODO: This does not go through pages as swap addresses have at most 2 transactions
    // Investigate whether retrieving more transactions is required.
    const transactions = await this.nodeGet(`/address/${address}/txs`)

    for (const transaction of transactions) {
      const formattedTransaction: Transaction<bitcoin.Transaction> = await this.getMethod('formatTransaction')(
        transaction,
        currentHeight
      )
      if (predicate(formattedTransaction)) {
        return formattedTransaction
      }
    }
  }

  async findSwapTransaction(swapParams: SwapParams, blockNumber: number, predicate: TransactionMatchesFunction) {
    const currentHeight: number = await this.getMethod('getBlockHeight')()
    const swapOutput: Buffer = this.getMethod('getSwapOutput')(swapParams)
    const paymentVariants: PaymentVariants = this.getMethod('getSwapPaymentVariants')(swapOutput)
    for (const paymentVariant of Object.values(paymentVariants)) {
      const addressTransaction = this.findAddressTransaction(paymentVariant.address, currentHeight, predicate)
      if (addressTransaction) return addressTransaction
    }
  }

  doesBlockScan() {
    return false
  }
}
