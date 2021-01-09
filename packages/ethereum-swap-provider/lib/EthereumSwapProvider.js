import Provider from '@liquality/provider'
import { padHexStart, sha256 } from '@liquality/crypto'
import { addressToString, caseInsensitiveEqual } from '@liquality/utils'
import { remove0x } from '@liquality/ethereum-utils'
import {
  PendingTxError,
  TxNotFoundError,
  BlockNotFoundError,
  InvalidSecretError,
  InvalidAddressError,
  InvalidExpirationError
} from '@liquality/errors'

import { version } from '../package.json'

export default class EthereumSwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    recipientAddress = remove0x(addressToString(recipientAddress))
    refundAddress = remove0x(addressToString(refundAddress))

    if (Buffer.byteLength(recipientAddress, 'hex') !== 20) {
      throw new InvalidAddressError(`Invalid recipient address: ${recipientAddress}`)
    }

    if (Buffer.byteLength(refundAddress, 'hex') !== 20) {
      throw new InvalidAddressError(`Invalid refund address: ${refundAddress}`)
    }

    if (Buffer.byteLength(secretHash, 'hex') !== 32) {
      throw new InvalidSecretError(`Invalid secret hash: ${secretHash}`)
    }

    if (sha256('0000000000000000000000000000000000000000000000000000000000000000') === secretHash) {
      throw new InvalidSecretError(`Invalid secret hash: ${secretHash}. Secret 0 detected.`)
    }

    const expirationHex = expiration.toString(16)
    const expirationSize = 5
    const expirationEncoded = padHexStart(expirationHex, expirationSize) // Pad with 0. string length

    if (Buffer.byteLength(expirationEncoded, 'hex') > expirationSize) {
      throw new InvalidExpirationError(`Invalid expiration: ${expiration}`)
    }

    return [
      // Constructor
      '60', '75', // PUSH1 {contractSize}
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
      '60', '47', // PUSH1 {redeemDestination}
      '57', // JUMPI

      // Check time lock
      '64', expirationEncoded, // PUSH5 {expirationEncoded}
      '42', // TIMESTAMP
      '11', // GT
      // Refund if timelock passed
      '60', '5e', // PUSH1 {refundDestination}
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
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, secret, gasPrice)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, '', gasPrice)
  }

  doesTransactionMatchInitiation (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return transaction._raw.to === null && transaction._raw.input === data && transaction._raw.value === value
  }

  doesTransactionMatchClaim (transaction, initiationTransactionReceipt) {
    return caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
           transaction._raw.input.length === 64
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    if (!initiationTransaction) throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transactionMatchesSwapParams = this.doesTransactionMatchInitiation(
      initiationTransaction,
      value,
      recipientAddress,
      refundAddress,
      secretHash,
      expiration
    )

    return transactionMatchesSwapParams &&
           initiationTransactionReceipt.contractAddress &&
           initiationTransactionReceipt.status === '1'
  }

  async findSwapTransaction (blockNumber, predicate) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block not found: ${blockNumber}`)

    if (block) {
      return block.transactions.find(tx => predicate(tx, block))
    }
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchInitiation(transaction, value, recipientAddress, refundAddress, secretHash, expiration))
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = await this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchClaim(transaction, initiationTransactionReceipt))
    if (!transaction) return

    const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
    if (transactionReceipt && transactionReceipt.status === '1') {
      transaction.secret = await this.getSwapSecret(transaction.hash)
      return transaction
    }
  }

  async findFundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    return null
  }

  async getSwapSecret (claimTxHash) {
    const claimTransaction = await this.getMethod('getTransactionByHash')(claimTxHash)
    return claimTransaction._raw.input
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const refundSwapTransaction = await this.findSwapTransaction(blockNumber, (transaction, block) =>
      caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
      transaction._raw.input === '' &&
      block.timestamp >= expiration
    )
    return refundSwapTransaction
  }
}

EthereumSwapProvider.version = version
