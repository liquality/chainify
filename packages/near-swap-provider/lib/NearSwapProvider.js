import Provider from '@liquality/provider'
import { PendingTxError, TxNotFoundError } from '@liquality/errors'
import { toNearTimestampFormat, parseReceipt } from '@liquality/near-utils'
import BigNumber from 'bignumber.js'
import { transactions } from 'near-api-js'

import Bytecode from './bytecode'
import { version } from '../package.json'

// TODO: remove when migrating to v14
global.URL = function (a, b) {
  return a
}

const CONTRACT_CODE = 'wnGY4a+YYkfbkBqYqyhdQjjtHRl9Auyh7yxCGtXL8JI='

const ABI = {
  init: { method: 'init', gas: '10000000000000' },
  claim: { method: 'claim', gas: '10000000000000' },
  refund: { method: 'refund', gas: '8000000000000' }
}

export default class NearSwapProvider extends Provider {
  createSwapScript () {
    return Bytecode
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const bytecode = this.createSwapScript()
    const contractId = this.generateUniqueString()

    return this.getMethod('sendTransaction')(contractId, null, [
      transactions.createAccount(),
      transactions.transfer(new BigNumber(value).toFixed().toString()),
      transactions.deployContract(bytecode),
      transactions.functionCall(
        ABI.init.method,
        {
          secretHash: Buffer.from(secretHash, 'hex').toString('base64'),
          expiration: `${toNearTimestampFormat(expiration)}`,
          buyer: recipientAddress
        },
        ABI.init.gas
      )
    ])
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration, gasPrice) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)

    if (!initiationTransactionReceipt) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }

    const parsedInitiationTx = parseReceipt(initiationTransactionReceipt)
    return this.getMethod('sendTransaction')(parsedInitiationTx.receiver, null, [
      transactions.functionCall(
        ABI.claim.method,
        {
          secret: Buffer.from(secret, 'hex').toString('base64')
        },
        ABI.claim.gas
      )
    ])
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)

    if (!initiationTransactionReceipt) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }
    const parsedInitiationTx = parseReceipt(initiationTransactionReceipt)
    return this.getMethod('sendTransaction')(parsedInitiationTx.receiver, null, [transactions.functionCall(ABI.refund.method, {}, ABI.refund.gas)])
  }

  doesTransactionMatchInitiation (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    if (transaction.swap) {
      return (
        transaction.code === CONTRACT_CODE &&
        new BigNumber(transaction.value).eq(value) &&
        transaction.swap.recipient === recipientAddress &&
        transaction.swap.secretHash === secretHash &&
        transaction.swap.expiration === expiration &&
        transaction.sender === refundAddress
      )
    }
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)

    if (!initiationTransaction) {
      throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)
    }

    const parsedInitiationTx = parseReceipt(initiationTransaction)
    return this.doesTransactionMatchInitiation(parsedInitiationTx, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async getSwapSecret (claimTxHash) {
    const tx = await this.getMethod('getTransactionReceipt')(claimTxHash)
    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${claimTxHash}`)
    }
    const parsedTx = parseReceipt(tx)
    return parsedTx.swap.secret
  }

  generateUniqueString (prefix = 'liquality-htlc') {
    return `${prefix}${Date.now() + Math.round(Math.random() * 1000)}`
  }
}

NearSwapProvider.version = version
