import Provider from '@liquality/provider'
import { PendingTxError, TxNotFoundError } from '@liquality/errors'

import { transactions } from 'near-api-js'

import { version } from '../package.json'

const CONTRACT_CODE = 'BJDNq9cMBx2vMYSdJHTdMn+EqlcdaeWTpGhFCEwNEXE='

// TODO: measure gas limit
const ABI = {
  init: { method: 'init', gas: 2 },
  claim: { method: 'claim', gas: 2 },
  refund: { method: 'refund', gas: 2 }
}

export default class NearSwapProvider extends Provider {
  createSwapScript () {
    return []
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const bytecode = this.createSwapScript()
    const contractId = this.generateUniqueString()

    return this.getMethod('sendTransaction')(contractId, null, [
      transactions.createAccount(),
      transactions.transfer(value),
      transactions.deployContract(bytecode),
      transactions.functionCall(
        ABI.init.method,
        {
          secretHash,
          expiration,
          recipientAddress
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

    return this.getMethod('sendTransaction')(
      initiationTransactionReceipt.receiver,
      null,
      [
        transactions.functionCall(
          ABI.claim.method,
          {
            secret: Buffer.from(secret, 'hex').toString('base64')
          },
          ABI.claim.gas
        )
      ]
    )
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)

    if (!initiationTransactionReceipt) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractId, null, [
      transactions.functionCall(ABI.refund.method, {}, ABI.refund.gas)
    ])
  }

  doesTransactionMatchInitiation (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    return (
      transaction.code === CONTRACT_CODE &&
      transaction.value === value &&
      transaction.swap.recipient === recipientAddress &&
      transaction.swap.secretHash === secretHash &&
      transaction.swap.expiration === expiration &&
      transaction.sender === refundAddress
    )
  }

  doesTransactionMatchClaim (transaction, initiationTransactionReceipt) {
    return (
      transaction.receiver === initiationTransactionReceipt.receiver &&
      transaction.swap.method === ABI.claim.method
    )
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(
      initiationTxHash
    )

    if (!initiationTransaction) {
      throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)
    }

    return this.doesTransactionMatchInitiation(initiationTransaction, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {}

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {}

  async findFundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    return null
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {}

  async getSwapSecret (claimTxHash) {
    const tx = await this.getMethod('getTransactionByHash')(claimTxHash)
    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${claimTxHash}`)
    }
    return tx.swap.secret
  }

  generateUniqueString (prefix = 'liquality-htlc') {
    return `${prefix}${Date.now() + Math.round(Math.random() * 1000)}`
  }
}

NearSwapProvider.version = version
