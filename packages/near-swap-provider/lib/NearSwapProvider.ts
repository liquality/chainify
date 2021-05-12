import { SwapProvider, SwapParams, near, BigNumber, Transaction } from '@liquality/types'
import { Provider } from '@liquality/provider'
import { PendingTxError, TxNotFoundError } from '@liquality/errors'
import {
  toNearTimestampFormat,
  parseReceipt,
  transactions,
  BN,
  validateSwapParams,
  validateSecret,
  validateSecretAndHash
} from '@liquality/near-utils'

import Bytecode from './bytecode'

const CONTRACT_CODE = 'wnGY4a+YYkfbkBqYqyhdQjjtHRl9Auyh7yxCGtXL8JI='

const ABI = {
  init: { method: 'init', gas: '10000000000000' },
  claim: { method: 'claim', gas: '10000000000000' },
  refund: { method: 'refund', gas: '8000000000000' }
}

export default class NearSwapProvider extends Provider implements Partial<SwapProvider> {
  createSwapScript() {
    return Bytecode
  }

  async initiateSwap(swapParams: SwapParams): Promise<Transaction<near.InputTransaction>> {
    validateSwapParams(swapParams)

    const bytecode = this.createSwapScript()
    const contractId = this.generateUniqueString(swapParams.secretHash.substr(0, 20))

    return this.client.chain.sendTransaction({
      to: contractId,
      value: null,
      actions: [
        transactions.createAccount(),
        transactions.transfer(new BN(swapParams.value.toFixed())),
        transactions.deployContract(new Uint8Array(bytecode)),
        transactions.functionCall(
          ABI.init.method,
          {
            secretHash: Buffer.from(swapParams.secretHash, 'hex').toString('base64'),
            expiration: `${toNearTimestampFormat(swapParams.expiration)}`,
            buyer: swapParams.recipientAddress
          },
          new BN(ABI.init.gas),
          new BN(0)
        )
      ]
    } as near.NearSendOptions)
  }

  async claimSwap(
    swapParams: SwapParams,
    initiationTxHash: string,
    secret: string
  ): Promise<Transaction<near.InputTransaction>> {
    validateSecret(secret)
    validateSecretAndHash(secret, swapParams.secretHash)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }

    const parsedInitiationTx = parseReceipt(initiationTransactionReceipt)
    return this.client.chain.sendTransaction({
      to: parsedInitiationTx.receiver,
      value: null,
      actions: [
        transactions.functionCall(
          ABI.claim.method,
          {
            secret: Buffer.from(secret, 'hex').toString('base64')
          },
          new BN(ABI.claim.gas),
          new BN(0)
        )
      ]
    } as near.NearSendOptions)
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string): Promise<Transaction<near.InputTransaction>> {
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) {
      throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)
    }
    const parsedInitiationTx = parseReceipt(initiationTransactionReceipt)
    return this.client.chain.sendTransaction({
      to: parsedInitiationTx.receiver,
      value: null,
      actions: [transactions.functionCall(ABI.refund.method, {}, new BN(ABI.refund.gas), new BN(0))]
    } as near.NearSendOptions)
  }

  async fundSwap(): Promise<null> {
    return null
  }

  async findFundSwapTransaction(): Promise<null> {
    return null
  }

  doesTransactionMatchInitiation(swapParams: SwapParams, transaction: near.NearSwapTransaction): boolean {
    if (transaction.swap) {
      return (
        transaction.code === CONTRACT_CODE &&
        new BigNumber(transaction.value).eq(swapParams.value) &&
        transaction.swap.recipient === swapParams.recipientAddress &&
        transaction.swap.secretHash === swapParams.secretHash &&
        transaction.swap.expiration === swapParams.expiration &&
        transaction.sender === swapParams.refundAddress
      )
    }
  }

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string): Promise<boolean> {
    validateSwapParams(swapParams)

    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)

    if (!initiationTransaction) {
      throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)
    }

    const parsedInitiationTx = parseReceipt(initiationTransaction)
    const txMatchInitiation = this.doesTransactionMatchInitiation(swapParams, parsedInitiationTx)
    return txMatchInitiation && !parsedInitiationTx._raw.status.Failure
  }

  async getSwapSecret(claimTxHash: string): Promise<string> {
    const tx = await this.getMethod('getTransactionReceipt')(claimTxHash)
    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${claimTxHash}`)
    }
    const parsedTx = parseReceipt(tx)
    return parsedTx.swap.secret
  }

  generateUniqueString(name: string): string {
    return `htlc-${name}-${Date.now() + Math.round(Math.random() * 1000)}`
  }
}
