import NodeProvider from '@liquality/node-provider'
import { ensure0x, normalizeTransactionObject, formatEthResponse } from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'
import { PendingTxError } from '@liquality/errors'

import { version } from '../package.json'

export default class EthereumScraperSwapFindProvider extends NodeProvider {
  constructor (url) {
    super({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  normalizeTransactionResponse (tx) {
    const normalizedTx = normalizeTransactionObject(formatEthResponse(tx))

    if (normalizedTx._raw.contractAddress) {
      normalizedTx._raw.contractAddress = normalizedTx._raw.contractAddress.toLowerCase()
    }

    if (normalizedTx._raw.secret) {
      normalizedTx.secret = normalizedTx._raw.secret
    }

    return normalizedTx
  }

  async ensureFeeInfo (tx) {
    if (!(tx.fee && tx.feePrice)) {
      const { fee, feePrice, _raw } = await this.getMethod('getTransactionByHash')(tx.hash)

      tx._raw.gas = _raw.gas
      tx._raw.gasPrice = _raw.gasPrice

      tx.fee = fee
      tx.feePrice = feePrice
    }

    return tx
  }

  async findAddressTransaction (address, predicate, fromBlock, toBlock, limit = 250, sort = 'desc') {
    address = ensure0x(addressToString(address))

    for (let page = 1; ; page++) {
      const data = await this.nodeGet(`/txs/${address}`, {
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

  async findAddressEvent (type, contractAddress) {
    contractAddress = ensure0x(addressToString(contractAddress))

    const data = await this.nodeGet(`/events/${type}/${contractAddress}`)
    const { tx } = data.data

    if (tx && tx.status === true) {
      return this.ensureFeeInfo(this.normalizeTransactionResponse(tx))
    }
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.findAddressTransaction(
      refundAddress,
      tx => this.getMethod('doesTransactionMatchInitiation')(
        tx, value, recipientAddress, refundAddress, secretHash, expiration
      )
    )
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    return this.findAddressEvent('swapClaim', initiationTransactionReceipt.contractAddress)
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    return this.findAddressEvent('swapRefund', initiationTransactionReceipt.contractAddress)
  }

  doesBlockScan () {
    return false
  }
}

EthereumScraperSwapFindProvider.version = version
