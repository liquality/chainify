import axios from 'axios'
import Provider from '@liquality/provider'
import {
  ensure0x,
  normalizeTransactionObject,
  formatEthResponse
} from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumBlockscoutSwapFindProvider extends Provider {
  constructor (url) {
    super()
    this.url = url

    this._axios = axios.create({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  transformTransactionResponse (tx) {
    return normalizeTransactionObject(formatEthResponse(tx))
  }

  async findAddressTransaction (address, predicate) {
    const resultsPerPage = 100

    const baseQuery = {
      address: ensure0x(addressToString(address)),
      module: 'account',
      action: 'txlist',
      offset: resultsPerPage
    }

    for (let page = 0; ; page++) {
      const response = await this._axios('', { params: {
        ...baseQuery,
        page
      } })
      if (response.data.result.length === 0) return
      const transactions = response.data.result
      const rpcTransactions = transactions.map(tx => this.transformTransactionResponse(tx))
      const transaction = rpcTransactions.find(predicate)
      if (transaction) return transaction
      if (response.data.result.length < resultsPerPage) return
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
      tx => tx.to === initiationTransaction.contractAddress && tx.input.length === 64)
    if (!transaction) return

    if (transaction.status === '1') {
      transaction.secret = await this.getMethod('getSwapSecret')(transaction.hash)
      return transaction
    }
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) throw new Error('Transaction receipt is not available')

    const transaction = await this.findAddressTransaction(initiationTransaction.contractAddress, (tx) =>
      tx.to === initiationTransaction.contractAddress &&
      tx.input === '' &&
      tx.timeStamp >= expiration)

    return transaction
  }

  doesBlockScan () {
    return false
  }
}

EthereumBlockscoutSwapFindProvider.version = version
