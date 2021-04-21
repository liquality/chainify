import NodeProvider from '@liquality/node-provider'
import {
  numberToHex,
  normalizeTransactionObject,
  validateAddress,
  validateExpiration,
  remove0x
} from '@liquality/ethereum-utils'
import { addressToString, validateValue, validateSecretHash, validateSecretAndHash } from '@liquality/utils'
import { PendingTxError } from '@liquality/errors'
import { SwapProvider, SwapParams, Transaction, ethereum } from '@liquality/types'
import * as scraper from './types'

export default class EthereumScraperSwapFindProvider extends NodeProvider implements Partial<SwapProvider> {
  constructor(url: string) {
    super({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  normalizeTransactionResponse(tx: any): Transaction<scraper.Transaction> {
    const txRaw: scraper.Transaction = {
      from: tx.from,
      to: tx.to,
      hash: tx.hash,
      secret: tx.secret,
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

    if (normalizedTransaction._raw.contractAddress) {
      normalizedTransaction._raw.contractAddress = normalizedTransaction._raw.contractAddress.toLowerCase()
    }

    if (normalizedTransaction._raw.secret) {
      normalizedTransaction.secret = remove0x(normalizedTransaction._raw.secret)
    }

    return normalizedTransaction
  }

  async ensureFeeInfo(tx: Transaction<scraper.Transaction>) {
    if (!(tx.fee && tx.feePrice)) {
      const { fee, feePrice, _raw } = await this.getMethod('getTransactionByHash')(tx.hash)

      tx._raw.gas = _raw.gas
      tx._raw.gasPrice = _raw.gasPrice

      tx.fee = fee
      tx.feePrice = feePrice
    }

    return tx
  }

  async findAddressTransaction(
    address: string,
    predicate: (tx: Transaction<scraper.Transaction>) => boolean,
    fromBlock?: number,
    toBlock?: number,
    limit = 250,
    sort = 'desc'
  ) {
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

      const normalizedTransactions = transactions
        .filter((tx) => tx.status === true)
        .map(this.normalizeTransactionResponse)
      const tx = normalizedTransactions.find(predicate)
      if (tx) return this.ensureFeeInfo(tx)

      if (transactions.length < limit) return
    }
  }

  async findAddressEvent(type: string, contractAddress: string) {
    const data = await this.nodeGet(`/events/${type}/${contractAddress}`)
    const { tx } = data.data

    if (tx && tx.status === true) {
      return this.ensureFeeInfo(this.normalizeTransactionResponse(tx))
    }
  }

  async findInitiateSwapTransaction(swapParams: SwapParams) {
    this.validateSwapParams(swapParams)

    return this.findAddressTransaction(addressToString(swapParams.refundAddress), (tx) =>
      this.getMethod('doesTransactionMatchInitiation')(swapParams, tx)
    )
  }

  validateSwapParams(swapParams: SwapParams) {
    validateValue(swapParams.value)
    validateAddress(swapParams.recipientAddress)
    validateAddress(swapParams.refundAddress)
    validateSecretHash(swapParams.secretHash)
    validateExpiration(swapParams.expiration)
  }

  async findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string) {
    this.validateSwapParams(swapParams)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const tx = await this.findAddressEvent('swapClaim', initiationTransactionReceipt.contractAddress)

    if (tx) {
      validateSecretAndHash(tx.secret, swapParams.secretHash)
      return tx
    }
  }

  async findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string) {
    this.validateSwapParams(swapParams)

    const initiationTransactionReceipt: ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(
      initiationTxHash
    )
    if (!initiationTransactionReceipt)
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    return this.findAddressEvent('swapRefund', initiationTransactionReceipt.contractAddress)
  }

  doesBlockScan() {
    return false
  }
}
