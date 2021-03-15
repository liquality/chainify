import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import {
  caseInsensitiveEqual,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash
} from '@liquality/utils'
import { remove0x, validateAddress, validateExpiration } from '@liquality/ethereum-utils'
import {
  PendingTxError,
  TxNotFoundError,
  BlockNotFoundError
} from '@liquality/errors'

import { version } from '../package.json'

export default class EthereumSwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    recipientAddress = remove0x(recipientAddress)
    refundAddress = remove0x(refundAddress)

    validateAddress(recipientAddress)
    validateAddress(refundAddress)
    validateSecretHash(secretHash)
    validateExpiration(expiration)

    const expirationHex = expiration.toString(16)
    const expirationSize = 5
    const expirationEncoded = padHexStart(expirationHex, expirationSize) // Pad with 0. string length

    const bytecode = [
      // Constructor
      '60', 'c8', // PUSH1 {contractSize}
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

      // Validate input size
      '36', // CALLDATASIZE
      '60', '20', // PUSH1 20 (32 bytes)
      '14', // EQ
      '16', // AND (input valid size AND sha256 success)

      // Validate with secretHash
      '7f', secretHash, // PUSH32 {secretHashEncoded}
      '60', '21', // PUSH1 21
      '51', // MLOAD
      '14', // EQ
      '16', // AND (input valid size AND sha256 success) AND secret valid
      // Redeem if secret is valid
      '60', '4f', // PUSH1 {redeemDestination}
      '57', // JUMPI

      // Validate input size
      '36', // CALLDATASIZE
      '15', // ISZERO (input empty)
      // Check time lock
      '64', expirationEncoded, // PUSH5 {expirationEncoded}
      '42', // TIMESTAMP
      '11', // GT
      '16', // AND (input size 0 AND time lock expired)
      // Refund if timelock passed
      '60', '8c', // PUSH1 {refundDestination}
      '57',

      'fe', // INVALID

      '5b', // JUMPDEST
      // emit Claim(bytes32 _secret)
      '7f', '8c1d64e3bd87387709175b9ef4e7a1d7a8364559fc0e2ad9d77953909a0d1eb3', // PUSH32 topic Keccak-256(Claim(bytes32))
      '60', '20', // PUSH1 20 (log length - 32)
      '60', '00', // PUSH1 00 (log offset - 0)
      'a1', // LOG 1
      '73', recipientAddress, // PUSH20 {recipientAddressEncoded}
      'ff', // SELF-DESTRUCT

      '5b', // JUMPDEST
      // emit Refund()
      '7f', '5d26862916391bf49478b2f5103b0720a842b45ef145a268f2cd1fb2aed55178', // PUSH32 topic Keccak-256(Refund())
      '60', '00', // PUSH1 00 (log length - 0)
      '80', // DUP 1 (log offset)
      'a1', // LOG 1
      '73', refundAddress, // PUSH20 {refundAddressEncoded}
      'ff' // SELF-DESTRUCT
    ].join('').toLowerCase()

    if (Buffer.byteLength(bytecode) !== 422) {
      throw new Error('Invalid swap script. Bytecode length incorrect.')
    }

    return bytecode
  }

  validateSwapParams (value, recipientAddress, refundAddress, secretHash, expiration) {
    recipientAddress = remove0x(recipientAddress)
    refundAddress = remove0x(refundAddress)

    validateValue(value)
    validateAddress(recipientAddress)
    validateAddress(refundAddress)
    validateSecretHash(secretHash)
    validateExpiration(expiration)
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

    const bytecode = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return this.getMethod('sendTransaction')(null, value, bytecode, gasPrice)
  }

  async fundSwap (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    return null
  }

  async claimSwap (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, secret, gasPrice) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)
    validateSecret(secret)
    validateSecretAndHash(secret, secretHash)
    await this.verifyInitiateSwapTransaction(initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, secret, gasPrice)
  }

  async refundSwap (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, gasPrice) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)
    await this.verifyInitiateSwapTransaction(initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration)

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
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

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
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

    return this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchInitiation(transaction, value, recipientAddress, refundAddress, secretHash, expiration))
  }

  async findClaimSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = await this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchClaim(transaction, initiationTransactionReceipt))
    if (!transaction) return

    const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
    if (transactionReceipt && transactionReceipt.status === '1') {
      const secret = await this.getSwapSecret(transaction.hash)
      validateSecretAndHash(secret, secretHash)
      transaction.secret = secret
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

  async findRefundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

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
