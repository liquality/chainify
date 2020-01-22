import axios from 'axios'
import EthereumScraperSwapFindProvider from '@liquality/ethereum-scraper-swap-find-provider'
import EthereumErc20SwapProvider from '@liquality/ethereum-erc20-swap-provider'
import { remove0x } from '@liquality/ethereum-utils'

import { version } from '../package.json'

export default class EthereumErc20ScraperSwapFindProvider extends EthereumScraperSwapFindProvider {
  constructor (url) {
    super()
    this.url = url

    this._axios = axios.create({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  doesTransactionMatchClaim (transaction, initiationTransaction) {
    return transaction.to === initiationTransaction.contractAddress && transaction.input.startsWith(remove0x(EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION))
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) return

    const transaction = await this.findAddressTransaction(
      initiationTransaction.contractAddress,
      (tx) => (
        tx.to === initiationTransaction.contractAddress &&
        tx.input === remove0x(EthereumErc20SwapProvider.SOL_REFUND_FUNCTION) &&
        tx.timestamp >= expiration
      )
    )

    return transaction
  }
}

EthereumErc20ScraperSwapFindProvider.version = version
