import axios from 'axios'
import Provider from '@liquality/provider'
import {
  ensure0x,
  normalizeTransactionObject,
  formatEthResponse
} from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumScrapperSwapFindProvider extends Provider {
  constructor (url) {
    super()
    this.url = url

    this._axios = axios.create({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  async findAddressTransaction (address, predicate) {
    address = ensure0x(addressToString(address))

    const response = await this._axios(`/txs/${address}`)
    const transactions = response.data.data.txs
    if (transactions.length === 0) return

    return transactions.find(predicate)
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.findAddressTransaction(recipientAddress, tx => this.getMethod('doesTransactionMatchInitiation')(
      tx, value, recipientAddress, refundAddress, secretHash, expiration
    ))
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) return

    const transaction = await this.findAddressTransaction(initiationTransaction.contractAddress,
      tx => tx.to === initiationTransaction.contractAddress && tx.input.length === 64)
    if (!transaction) return

    if (transaction.status === true) {
      transaction.secret = await this.getMethod('getSwapSecret')(transaction.hash)
      return transaction
    }
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) return

    const transaction = await this.findAddressTransaction(
      initiationTransaction.contractAddress,
      (tx) =>
        tx.to === initiationTransaction.contractAddress &&
        tx.input === '' &&
        tx.timestamp >= expiration
      )

    return transaction
  }

  doesBlockScan () {
    return false
  }
}

EthereumScrapperSwapFindProvider.version = version
