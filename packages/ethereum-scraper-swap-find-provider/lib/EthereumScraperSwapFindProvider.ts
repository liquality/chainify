import NodeProvider from '@liquality/node-provider'
import { hexToNumber,
  remove0x,
  numberToHex,
  normalizeTransactionObject,
  validateAddress,
  validateExpiration
} from '@liquality/ethereum-utils'
import {
  caseInsensitiveEqual,
  validateValue,
  validateSecretHash,
  validateSecretAndHash
} from '@liquality/utils'
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
    secret?: ethereum.Hex
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

    if (normalizedTransaction._raw.contractAddress) {
      normalizedTransaction._raw.contractAddress = normalizedTransaction._raw.contractAddress.toLowerCase()
    }

    if (normalizedTransaction._raw.secret) {
      // @ts-ignore
      normalizedTransaction.secret = normalizedTransaction._raw.secret
    }

    return normalizedTransaction
  }

  async ensureFeeInfo (tx: Transaction<scraper.Transaction>) {
    if (!(tx.fee && tx.feePrice)) {
      const { fee, feePrice, _raw } = await this.getMethod('getTransactionByHash')(tx.hash)

      tx._raw.gas = _raw.gas
      tx._raw.gasPrice = _raw.gasPrice

      tx.fee = fee
      tx.feePrice = feePrice
    }

    return tx
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

      const normalizedTransactions = transactions
        .filter(tx => tx.status === true)
        .map(this.normalizeTransactionResponse)
      const tx = normalizedTransactions.find(predicate)
      if (tx) return this.ensureFeeInfo(tx)

      if (transactions.length < limit) return
    }
  }

  async findAddressEvent (type: string, contractAddress: string) {
    const data = await this.nodeGet(`/events/${type}/${contractAddress}`)
    const { tx } = data.data

    if (tx && tx.status === true) {
      return this.ensureFeeInfo(this.normalizeTransactionResponse(tx))
    }
  }

  async findInitiateSwapTransaction (swapParams: SwapParams) {
    this.validateSwapParams(swapParams)

    return this.findAddressTransaction(
      swapParams.refundAddress,
      tx => this.getMethod('doesTransactionMatchInitiation')(swapParams, tx)
    )
  }

  validateSwapParams (swapParams: SwapParams) {
    const recipientAddress = remove0x(swapParams.recipientAddress)
    const refundAddress = remove0x(swapParams.refundAddress)

    validateValue(swapParams.value)
    validateAddress(recipientAddress)
    validateAddress(refundAddress)
    validateSecretHash(swapParams.secretHash)
    validateExpiration(swapParams.expiration)
  }


  
  async findClaimSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {   
    this.validateSwapParams(swapParams)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const tx = await this.findAddressEvent('swapClaim', initiationTransactionReceipt.contractAddress)

    if (tx) {
      // @ts-ignore secret is non standard field
      validateSecretAndHash(tx.secret, secretHash)
      return tx
    }
  }

  async findRefundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const initiationTransactionReceipt : ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    return this.findAddressEvent('swapRefund', initiationTransactionReceipt.contractAddress)
  }

  doesBlockScan () {
    return false
  }
}