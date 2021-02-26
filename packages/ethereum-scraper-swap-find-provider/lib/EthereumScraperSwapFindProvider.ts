import NodeProvider from '@liquality/node-provider'
import { hexToNumber, normalizeTransactionObject, numberToHex } from '@liquality/ethereum-utils'
import { caseInsensitiveEqual } from '@liquality/utils'
import { PendingTxError } from '@liquality/errors'
import { SwapProvider, SwapParams, Transaction, ethereum } from '@liquality/types'

export namespace scraper {
  export interface Transaction {
    from: ethereum.Address
    to: ethereum.Address | null
    hash: ethereum.Hex256
    value: ethereum.Hex
    gas?: ethereum.Hex
    gasPrice?: ethereum.Hex
    input?: ethereum.Hex
    blockHash: ethereum.Hex256
    blockNumber: ethereum.Hex
    status: ethereum.TransactionReceiptStatus
    contractAddress: ethereum.Address
    timestamp: ethereum.Hex
    confirmations: number
  }
}

export default class EthereumScraperSwapFindProvider extends NodeProvider implements Partial<SwapProvider> {
  constructor (url: string) {
    super({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  normalizeTransactionResponse (tx: any) : Transaction<scraper.Transaction> {
    const txRaw : scraper.Transaction = {
      from: tx.from,
      to: tx.to,
      hash: tx.hash,
      blockHash: tx.blockHash,
      blockNumber: numberToHex(tx.blockNumber),
      status: tx.status === true ? '0x1' : '0x0',
      input: tx.input,
      contractAddress: tx.contractAddress,
      timestamp: numberToHex(tx.timestamp),
      value: numberToHex(tx.value),
      confirmations: tx.confirmations
    }
    const normalizedTransaction = normalizeTransactionObject(txRaw)
    normalizedTransaction.confirmations = txRaw.confirmations
    return normalizedTransaction
  }

  async findAddressTransaction (address: string, predicate: (tx: Transaction<scraper.Transaction>) => boolean, fromBlock?: number, toBlock?: number, limit = 250, sort = 'desc') {
    for (let page = 1; ; page++) {
      const data = await this.nodeGet(`/txs/${address}`, {
        limit,
        page,
        sort,
        fromBlock,
        toBlock
      })

      const transactions: any[] = data.data.txs
      if (transactions.length === 0) return

      const normalizedTransactions = transactions.map(this.normalizeTransactionResponse)
      const tx = normalizedTransactions.find(ntx => predicate(ntx))

      if (tx) {
        if (!(tx.fee && tx.feePrice)) {
          const rpcTransaction : Transaction<ethereum.Transaction> = await this.getMethod('getTransactionByHash')(tx.hash)

          tx._raw.gas = rpcTransaction._raw.gas
          tx._raw.gasPrice = rpcTransaction._raw.gasPrice

          tx.fee = rpcTransaction.fee
          tx.feePrice = rpcTransaction.feePrice
        }

        return tx
      }

      if (transactions.length < limit) return
    }
  }

  async findInitiateSwapTransaction (swapParams: SwapParams) {
    return this.findAddressTransaction(swapParams.refundAddress, tx => this.getMethod('doesTransactionMatchInitiation')(swapParams, tx))
  }

  async findClaimSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = await this.findAddressTransaction(initiationTransactionReceipt.contractAddress,
      tx => this.getMethod('doesTransactionMatchClaim', false)(tx, initiationTransactionReceipt))
    if (!transaction) return

    if (transaction._raw.status === '0x1') {
      // @ts-ignore secret is non standard field
      transaction.secret = await this.getMethod('getSwapSecret')(transaction.hash)
      return transaction
    }
  }

  async findRefundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    const initiationTransactionReceipt : ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = await this.findAddressTransaction(
      initiationTransactionReceipt.contractAddress,
      tx => (
        caseInsensitiveEqual(tx._raw.to, initiationTransactionReceipt.contractAddress) &&
        tx._raw.input === '0x' &&
        hexToNumber(tx._raw.timestamp) >= swapParams.expiration
      )
    )

    return transaction
  }

  doesBlockScan () {
    return false
  }
}
