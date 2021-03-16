import Provider from '@liquality/provider'
import { padHexStart, sha256 } from '@liquality/crypto'
import { SwapProvider, SwapParams, BigNumber, Transaction, Block, ethereum } from '@liquality/types'
import {
  caseInsensitiveEqual,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash
} from '@liquality/utils'
import { remove0x, hexToNumber, validateAddress, validateExpiration } from '@liquality/ethereum-utils'
import {
  PendingTxError,
  TxNotFoundError,
  BlockNotFoundError
} from '@liquality/errors'

export default class EthereumSwapProvider extends Provider implements Partial<SwapProvider> {
  createSwapScript (swapParams: SwapParams) {
    const recipientAddress = remove0x(swapParams.recipientAddress)
    const refundAddress = remove0x(swapParams.refundAddress)

    this.validateSwapParams(swapParams)

    const expirationHex = swapParams.expiration.toString(16)
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
      '7f', swapParams.secretHash, // PUSH32 {secretHashEncoded}
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

  async initiateSwap (swapParams: SwapParams, gasPrice: BigNumber) {
    this.validateSwapParams(swapParams)

    const bytecode = this.createSwapScript(swapParams)
    return this.getMethod('sendTransaction')(null, swapParams.value, bytecode, gasPrice)
  }

  async fundSwap (swapParams: SwapParams, initiationTxHash: string, gasPrice: BigNumber) : Promise<null> {
    return null
  }

  async claimSwap (swapParams: SwapParams, initiationTxHash: string, secret: string, gasPrice: BigNumber) {
    this.validateSwapParams(swapParams)
    validateSecret(secret)
    validateSecretAndHash(secret, swapParams.secretHash)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    await this.getMethod('assertContractExists')(initiationTransactionReceipt.contractAddress)

    return this.getMethod('sendTransaction')(initiationTransactionReceipt.contractAddress, 0, secret, gasPrice)
  }

  async refundSwap (swapParams: SwapParams, initiationTxHash: string, gasPrice: BigNumber) {
    this.validateSwapParams(swapParams)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

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
    this.validateSwapParams(swapParams)

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
    this.validateSwapParams(swapParams)

    return this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchInitiation(swapParams, transaction))
  }

  async findClaimSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    if (!initiationTransactionReceipt) throw new PendingTxError(`Transaction receipt is not available: ${initiationTxHash}`)

    const transaction = await this.findSwapTransaction(blockNumber, transaction => this.doesTransactionMatchClaim(transaction, initiationTransactionReceipt))
    if (!transaction) return

    const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
    if (transactionReceipt && transactionReceipt.status === '1') {
      const secret = await this.getSwapSecret(transaction.hash)
      validateSecretAndHash(secret, secretHash)
      // @ts-ignore
      transaction.secret = secret
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
    this.validateSwapParams(swapParams)

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
