import Provider from '@liquality/provider'
import { padHexStart, sha256 } from '@liquality/crypto'
import { caseInsensitiveEqual } from '@liquality/utils'
import { SwapProvider, SwapParams, BigNumber, Transaction, Block, ethereum } from '@liquality/types'
import { remove0x, hexToNumber } from '@liquality/ethereum-utils'
import {
  PendingTxError,
  TxNotFoundError,
  BlockNotFoundError,
  InvalidSecretError,
  InvalidAddressError,
  InvalidExpirationError
} from '@liquality/errors'

export default class EthereumSwapProvider extends Provider implements Partial<SwapProvider> {
  createSwapScript (swapParams: SwapParams) {
    const recipientAddress = remove0x(swapParams.recipientAddress)
    const refundAddress = remove0x(swapParams.refundAddress)

    if (Buffer.byteLength(recipientAddress, 'hex') !== 20) {
      throw new InvalidAddressError(`Invalid recipient address: ${recipientAddress}`)
    }

    if (Buffer.byteLength(refundAddress, 'hex') !== 20) {
      throw new InvalidAddressError(`Invalid refund address: ${refundAddress}`)
    }

    if (Buffer.byteLength(swapParams.secretHash, 'hex') !== 32) {
      throw new InvalidSecretError(`Invalid secret hash: ${swapParams.secretHash}`)
    }

    if (sha256('0000000000000000000000000000000000000000000000000000000000000000') === swapParams.secretHash) {
      throw new InvalidSecretError(`Invalid secret hash: ${swapParams.secretHash}. Secret 0 detected.`)
    }

    const expirationHex = swapParams.expiration.toString(16)
    const expirationSize = 5
    const expirationEncoded = padHexStart(expirationHex, expirationSize) // Pad with 0. string length

    if (Buffer.byteLength(expirationEncoded, 'hex') > expirationSize) {
      throw new InvalidExpirationError(`Invalid expiration: ${swapParams.expiration}`)
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
      '7f', swapParams.secretHash, // PUSH32 {secretHashEncoded}
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

  async initiateSwap (swapParams: SwapParams, gasPrice: BigNumber) {
    const bytecode = this.createSwapScript(swapParams)
    return this.getMethod('sendTransaction')(null, swapParams.value, bytecode, gasPrice)
  }

  async fundSwap (swapParams: SwapParams, initiationTxHash: string, gasPrice: BigNumber) : Promise<null> {
    return null
  }

  async claimSwap (swapParams: SwapParams, initiationTxHash: string, secret: string, gasPrice: BigNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, secret, gasPrice)
  }

  async refundSwap (swapParams: SwapParams, initiationTxHash: string, gasPrice: BigNumber) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, '', gasPrice)
  }

  doesTransactionMatchInitiation (swapParams: SwapParams, transaction: Transaction<ethereum.Transaction>) {
    const data = this.createSwapScript(swapParams)
    return transaction._raw.to === null &&
           remove0x(transaction._raw.input) === data &&
           swapParams.value.eq(hexToNumber(transaction._raw.value))
  }

  doesTransactionMatchClaim (transaction: Transaction<ethereum.Transaction>, initiationTransactionReceipt: ethereum.TransactionReceipt) {
    return caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
           remove0x(transaction._raw.input).length === 64
  }

  async verifyInitiateSwapTransaction (swapParams: SwapParams, initiationTxHash: string) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    if (!initiationTransaction) throw new TxNotFoundError(`Transaction not found: ${initiationTxHash}`)

    const initiationTransactionReceipt : ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transactionMatchesSwapParams = this.doesTransactionMatchInitiation(swapParams, initiationTransaction)

    return transactionMatchesSwapParams &&
           initiationTransactionReceipt.contractAddress &&
           initiationTransactionReceipt.status === '0x1'
  }

  async findSwapTransaction (blockNumber: number, predicate: (tx: Transaction<any>, block: Block) => boolean) {
    const block : Block<Transaction<ethereum.Transaction>> = await this.getMethod('getBlockByNumber')(blockNumber, true)
    if (!block) throw new BlockNotFoundError(`Block not found: ${blockNumber}`)

    if (block) {
      return block.transactions.find(tx => predicate(tx, block))
    }
  }

  async findInitiateSwapTransaction (swapParams: SwapParams, blockNumber: number) {
    return this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchInitiation(swapParams, transaction))
  }

  async findClaimSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = await this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchClaim(transaction, initiationTransactionReceipt))
    if (!transaction) return

    const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
    if (transactionReceipt && transactionReceipt.status === '1') {
      // @ts-ignore
      transaction.secret = await this.getSwapSecret(transaction.hash)
      return transaction
    }
  }

  async findFundSwapTransaction (swapParams: SwapParams, initiationTxHash: string) : Promise<null> {
    return null
  }

  async getSwapSecret (claimTxHash: string) {
    const claimTransaction: Transaction<ethereum.Transaction> = await this.getMethod('getTransactionByHash')(claimTxHash)
    return remove0x(claimTransaction._raw.input)
  }

  async findRefundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    const initiationTransactionReceipt : ethereum.TransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const refundSwapTransaction = await this.findSwapTransaction(blockNumber, (transaction, block) =>
      caseInsensitiveEqual(transaction._raw.to, initiationTransactionReceipt.contractAddress) &&
      transaction._raw.input === '0x' &&
      block.timestamp >= swapParams.expiration
    )
    return refundSwapTransaction
  }
}
