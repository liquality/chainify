import NodeProvider from '@liquality/node-provider'
import { PendingTxError } from '@liquality/errors'

import { version } from '../package.json'

const ONE_HOUR_IN_NS = 60 * 60 * 1000 * 1000 * 1000

export default class NearSwapFindProvider extends NodeProvider {
  constructor (url) {
    super({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  normalizeTransactionResponse (tx) {}

  async findAddressTransaction (address, predicate, limit = 250) {
    let offset = this.getCurrentTimeInNs()

    for (let page = 1; ; page++) {
      const transactions = await this.nodeGet(
        `account/${address}/activity?offset=${offset}&limit=${limit}`
      )

      if (transactions.length === 0) {
        return
      }

      const normalizedTransactions = transactions.map(
        this.normalizeTransactionResponse
      )

      const tx = normalizedTransactions.find(predicate)

      if (tx) {
        return tx
      }

      offset = offset - ONE_HOUR_IN_NS
    }
  }

  async findInitiateSwapTransaction (
    value,
    recipientAddress,
    refundAddress,
    secretHash,
    expiration
  ) {
    return this.findAddressTransaction(refundAddress, (tx) =>
      this.getMethod('doesTransactionMatchInitiation')(
        tx,
        value,
        recipientAddress,
        refundAddress,
        secretHash,
        expiration
      )
    )
  }

  async findClaimSwapTransaction (
    initiationTxHash,
    recipientAddress,
    refundAddress,
    secretHash,
    expiration,
    blockNumber
  ) {
    const initiationTransactionReceipt = await this.getMethod(
      'getTransactionReceipt'
    )(initiationTxHash)

    if (!initiationTransactionReceipt) {
      throw new PendingTxError(
        `Transaction receipt is not available: ${initiationTxHash}`
      )
    }
  }

  async findRefundSwapTransaction (
    initiationTxHash,
    recipientAddress,
    refundAddress,
    secretHash,
    expiration,
    blockNumber
  ) {
    const initiationTransactionReceipt = await this.getMethod(
      'getTransactionReceipt'
    )(initiationTxHash)

    if (!initiationTransactionReceipt) {
      throw new PendingTxError(
        `Transaction receipt is not available: ${initiationTxHash}`
      )
    }
  }

  getCurrentTimeInNs () {
    return new Date().valueOf() * 1000 * 1000
  }

  doesBlockScan () {
    return false
  }
}

NearSwapFindProvider.version = version
