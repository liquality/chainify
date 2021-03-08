import EthereumScraperSwapFindProvider from '@liquality/ethereum-scraper-swap-find-provider'
import { ensure0x, remove0x } from '@liquality/ethereum-utils'
import { PendingTxError, TxNotFoundError } from '@liquality/errors'
import { caseInsensitiveEqual, addressToString } from '@liquality/utils'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

export default class EthereumErc20ScraperSwapFindProvider extends EthereumScraperSwapFindProvider {
  async findErc20Events (erc20ContractAddress, address, predicate, fromBlock, toBlock, limit = 250, sort = 'desc') {
    erc20ContractAddress = ensure0x(addressToString(erc20ContractAddress))
    address = ensure0x(addressToString(address))

    for (let page = 1; ; page++) {
      const data = await this.nodeGet(`/events/erc20Transfer/${erc20ContractAddress}`, {
        address,
        limit,
        page,
        sort,
        fromBlock,
        toBlock
      })

      const transactions = data.data.txs
      if (transactions.length === 0) return

      const normalizedTransactions = transactions
        .filter(tx => tx.status === true)
        .map(this.normalizeTransactionResponse)
      const tx = normalizedTransactions.find(predicate)
      if (tx) return this.ensureFeeInfo(tx)

      if (transactions.length < limit) return
    }
  }

  async findFundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const { contractAddress } = initiationTransactionReceipt
    const erc20TokenContractAddress = await this.getMethod('getContractAddress')()

    const tx = await this.findErc20Events(
      erc20TokenContractAddress,
      contractAddress,
      tx =>
        caseInsensitiveEqual(remove0x(tx.to), remove0x(contractAddress)) &&
        BigNumber(tx.value).isEqualTo(value)
    )

    if (!tx) throw new TxNotFoundError(`Funding transaction is not available: ${initiationTxHash}`)

    return tx
  }
}

EthereumErc20ScraperSwapFindProvider.version = version
