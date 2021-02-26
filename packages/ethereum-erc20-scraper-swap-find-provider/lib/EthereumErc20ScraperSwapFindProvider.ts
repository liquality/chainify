import EthereumScraperSwapFindProvider from '@liquality/ethereum-scraper-swap-find-provider'
import EthereumErc20SwapProvider from '@liquality/ethereum-erc20-swap-provider'
import { remove0x } from '@liquality/ethereum-utils'
import { PendingTxError, TxNotFoundError } from '@liquality/errors'
import { caseInsensitiveEqual } from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumErc20ScraperSwapFindProvider extends EthereumScraperSwapFindProvider {
  doesTransactionMatchClaim (transaction, initiationTransactionReceipt) {
    return caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
           transaction._raw.input.startsWith(remove0x(EthereumErc20SwapProvider.SOL_CLAIM_FUNCTION))
  }

  async findFundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const erc20TokenContractAddress = await this.getMethod('getContractAddress')()
    const contractData = await this.getMethod('generateErc20Transfer')(initiationTransactionReceipt.contractAddress, value)

    const tx = await this.findAddressTransaction(
      refundAddress,
      transaction => this.getMethod('doesTransactionMatchFunding')(transaction, erc20TokenContractAddress, contractData),
      initiationTransactionReceipt.blockNumber,
      null,
      10,
      'asc'
    )

    if (!tx) throw new TxNotFoundError(`Funding transaction is not available: ${initiationTxHash}`)

    return tx
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = await this.findAddressTransaction(
      initiationTransactionReceipt.contractAddress,
      (tx) => (
        caseInsensitiveEqual(tx._raw.to, initiationTransactionReceipt.contractAddress) &&
        tx._raw.input === remove0x(EthereumErc20SwapProvider.SOL_REFUND_FUNCTION) &&
        tx._raw.timestamp >= expiration
      )
    )

    return transaction
  }
}

EthereumErc20ScraperSwapFindProvider.version = version
