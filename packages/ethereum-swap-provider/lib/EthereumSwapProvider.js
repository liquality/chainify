import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import { addressToString } from '@liquality/utils'
import { remove0x } from '@liquality/ethereum-utils'

import { version } from '../package.json'

export default class EthereumSwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    recipientAddress = remove0x(addressToString(recipientAddress))
    refundAddress = remove0x(addressToString(refundAddress))

    const dataSizeBase = 112
    const redeemDestinationBase = 66
    const refundDestinationBase = 89
    const expirationHex = expiration.toString(16)
    const expirationEncoded = padHexStart(expirationHex) // Pad with 0
    const expirationSize = expirationEncoded.length / 2
    const expirationPushOpcode = (0x60 - 1 + expirationSize).toString(16)
    const redeemDestinationEncoded = (redeemDestinationBase + expirationSize).toString(16)
    const refundDestinationEncoded = (refundDestinationBase + expirationSize).toString(16)
    const dataSizeEncoded = (dataSizeBase + expirationSize).toString(16)

    return [
      // Constructor
      '60', dataSizeEncoded, // PUSH1 {dataSizeEncoded}
      '80', // DUP1
      '60', '0b', // PUSH1 0b
      '60', '00', // PUSH1 00
      '39', // CODECOPY
      '60', '00', // PUSH1 00
      'f3', // RETURN

      // Contract
      '60', '20', // PUSH1 20

      // Get secret
      '80', // DUP1
      '60', '00', // PUSH1 00
      '80', // DUP1
      '37', // CALLDATACOPY

      // SHA256
      '60', '21', // PUSH1 21
      '81', // DUP2
      '60', '00', // PUSH1 00
      '80', // DUP1
      '60', '02', // PUSH1 02
      '60', '48', // PUSH1 48
      'f1', // CALL

      // Validate with secretHash
      '7f', secretHash, // PUSH32 {secretHashEncoded}
      '60', '21', // PUSH1 21
      '51', // MLOAD
      '14', // EQ
      '16', // AND (to make sure CALL succeeded)
      // Redeem if secret is valid
      '60', redeemDestinationEncoded, // PUSH1 {redeemDestinationEncoded}
      '57', // JUMPI

      // Check time lock
      expirationPushOpcode, // PUSH{expirationSize}
      expirationEncoded, // {expirationEncoded}
      '42', // TIMESTAMP
      '11', // GT
      // Refund if timelock passed
      '60', refundDestinationEncoded, // PUSH1 {refundDestinationEncoded}
      '57',

      'fe', // INVALID

      '5b', // JUMPDEST
      '73', recipientAddress, // PUSH20 {recipientAddressEncoded}
      'ff', // SELF-DESTRUCT

      '5b', // JUMPDEST
      '73', refundAddress, // PUSH20 {refundAddressEncoded}
      'ff' // SELF-DESTRUCT
    ].join('').toLowerCase()
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const bytecode = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return this.getMethod('sendTransaction')(null, value, bytecode, gasPrice)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration, gasPrice) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) throw new Error('Transaction receipt is not available')

    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, secret, gasPrice)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransaction) throw new Error('Transaction receipt is not available')

    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, '', gasPrice)
  }

  doesTransactionMatchInitiation (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return transaction._raw.input === data && transaction._raw.value === value
  }

  doesTransactionMatchClaim (transaction, initiationTransactionReceipt) {
    return transaction._raw.to === initiationTransactionReceipt.contractAddress && transaction._raw.input.length === 64
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    if (!initiationTransaction) return false

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new Error('Transaction receipt is not available')

    const transactionMatchesSwapParams = this.doesTransactionMatchInitiation(
      initiationTransaction,
      value,
      recipientAddress,
      refundAddress,
      secretHash,
      expiration
    )

    return transactionMatchesSwapParams && initiationTransactionReceipt.status === '1'
  }

  async findSwapTransaction (blockNumber, predicate) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (block) {
      return block.transactions.find(tx => predicate(tx, block))
    }
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchInitiation(transaction, value, recipientAddress, refundAddress, secretHash, expiration))
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new Error('Transaction receipt is not available')

    const transaction = await this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchClaim(transaction, initiationTransactionReceipt))
    if (!transaction) return

    const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
    if (transactionReceipt && transactionReceipt.status === '1') {
      transaction.secret = await this.getSwapSecret(transaction.hash)
      return transaction
    }
  }

  async getSwapSecret (claimTxHash) {
    const claimTransaction = await this.getMethod('getTransactionByHash')(claimTxHash)
    return claimTransaction._raw.input
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new Error('Transaction receipt is not available')

    const refundSwapTransaction = await this.findSwapTransaction(blockNumber, (transaction, block) =>
      transaction._raw.to === initiationTransactionReceipt.contractAddress &&
      transaction._raw.input === '' &&
      block.timestamp >= expiration
    )
    return refundSwapTransaction
  }
}

EthereumSwapProvider.version = version
