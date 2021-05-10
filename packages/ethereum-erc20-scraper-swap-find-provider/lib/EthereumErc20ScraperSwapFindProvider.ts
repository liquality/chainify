import { EthereumScraperSwapFindProvider, scraper } from '@liquality/ethereum-scraper-swap-find-provider'
import { ensure0x, remove0x, validateAddress, validateExpiration } from '@liquality/ethereum-utils'
import { PendingTxError, TxNotFoundError } from '@liquality/errors'
import { SwapParams, Transaction, BigNumber } from '@liquality/types'
import { caseInsensitiveEqual, validateValue, validateSecretHash } from '@liquality/utils'

export default class EthereumErc20ScraperSwapFindProvider extends EthereumScraperSwapFindProvider {
  async findErc20Events(
    erc20ContractAddress: string,
    address: string,
    predicate: (tx: Transaction<scraper.Transaction>) => boolean,
    fromBlock?: number,
    toBlock?: number,
    limit = 250,
    sort = 'desc'
  ) {
    erc20ContractAddress = ensure0x(erc20ContractAddress)
    address = ensure0x(address)

    for (let page = 1; ; page++) {
      const data = await this.nodeGet(`/events/erc20Transfer/${erc20ContractAddress}`, {
        address,
        limit,
        page,
        sort,
        fromBlock,
        toBlock
      })

      const transactions: any[] = data.data.txs
      if (transactions.length === 0) return

      const normalizedTransactions = transactions
        .filter((tx) => tx.status === true)
        .map(this.normalizeTransactionResponse)
      const tx = normalizedTransactions.find(predicate)
      if (tx) return this.ensureFeeInfo(tx)

      if (transactions.length < limit) return
    }
  }

  validateSwapParams(swapParams: SwapParams) {
    validateValue(swapParams.value)
    validateAddress(swapParams.recipientAddress)
    validateAddress(swapParams.refundAddress)
    validateSecretHash(swapParams.secretHash)
    validateExpiration(swapParams.expiration)
  }

  async findFundSwapTransaction(swapParams: SwapParams, initiationTxHash: string) {
    this.validateSwapParams(swapParams)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const { contractAddress } = initiationTransactionReceipt
    const erc20TokenContractAddress = await this.getMethod('getContractAddress')()

    const tx = await this.findErc20Events(
      erc20TokenContractAddress,
      contractAddress,
      (tx) =>
        caseInsensitiveEqual(remove0x(tx._raw.to), remove0x(contractAddress)) &&
        new BigNumber(tx.value).isEqualTo(swapParams.value)
    )

    if (!tx) throw new TxNotFoundError(`Funding transaction is not available: ${initiationTxHash}`)

    return tx
  }
}
