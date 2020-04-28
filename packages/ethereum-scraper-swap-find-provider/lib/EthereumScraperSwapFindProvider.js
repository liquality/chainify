import axios from 'axios'
import Provider from '@liquality/provider'
import { ensure0x, normalizeTransactionObject, formatEthResponse } from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumScraperSwapFindProvider extends Provider {
  constructor (url) {
    super()
    this.url = url

    this._axios = axios.create({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  normalizeTransactionResponse (tx) {
    const normalizedTx = normalizeTransactionObject(formatEthResponse(tx))
    if (normalizedTx.contractAddress) {
      normalizedTx.contractAddress = normalizedTx.contractAddress.toLowerCase()
    }
    return normalizedTx
  }

  async findAddressTransaction (address, predicate) {
    address = ensure0x(addressToString(address))

    const limit = 250
    for (let page = 1; ; page++) {
      const response = await this._axios(`/txs/${address}`, {
        params: {
          limit,
          page,
          sort: 'desc'
        }
      })

      const transactions = response.data.data.txs
      if (transactions.length === 0) return

      const normalizedTransactions = transactions.map(this.normalizeTransactionResponse)
      const tx = normalizedTransactions.find(predicate)
      if (tx) return tx

      if (transactions.length < limit) return
    }
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.findAddressTransaction(refundAddress, tx => this.getMethod('doesTransactionMatchInitiation')(
      tx, value, recipientAddress, refundAddress, secretHash, expiration
    ))
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) throw new Error('Transaction receipt is not available')

    const transaction = await this.findAddressTransaction(initiationTransaction.contractAddress,
      tx => this.getMethod('doesTransactionMatchClaim', false)(tx, initiationTransaction))
    if (!transaction) return

    if (transaction.status === true) {
      transaction.secret = await this.getMethod('getSwapSecret')(transaction.hash)
      return transaction
    }
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) throw new Error('Transaction receipt is not available')

    const transaction = await this.findAddressTransaction(
      initiationTransaction.contractAddress,
      (tx) => (
        tx.to === initiationTransaction.contractAddress &&
        tx.input === '' &&
        tx.timestamp >= expiration
      )
    )

    return transaction
  }

  doesBlockScan () {
    return false
  }
}

EthereumScraperSwapFindProvider.version = version
