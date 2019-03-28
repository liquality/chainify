import Provider from '../../Provider'
import { padHexStart } from '../../crypto'
import { ensureAddressStandardFormat } from './EthereumUtil'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class EthereumSwapProvider extends Provider {
  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
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
      '73', ensureAddressStandardFormat(recipientAddress), // PUSH20 {recipientAddressEncoded}
      'ff', // SUICIDE

      '5b', // JUMPDEST
      '73', ensureAddressStandardFormat(refundAddress), // PUSH20 {refundAddressEncoded}
      'ff' // SELF-DESTRUCT
    ].join('')
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    const bytecode = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return this.getMethod('sendTransaction')(null, value, bytecode)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, secret)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    return this.getMethod('sendTransaction')(initiationTransaction.contractAddress, 0, '')
  }

  doesTransactionMatchSwapParams (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    return transaction.input === data && transaction.value === value
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    const initiationTransactionReceipt = await this.getMethod('getTransactionReceipt')(initiationTxHash)
    const transactionMatchesSwapParams = this.doesTransactionMatchSwapParams(initiationTransaction, value, recipientAddress, refundAddress, secretHash, expiration)
    return transactionMatchesSwapParams && initiationTransactionReceipt.status === '1'
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, startBlock) {
    let blockNumber = startBlock || await this.getMethod('getBlockHeight')()
    let initiateSwapTransaction = null
    while (!initiateSwapTransaction) {
      const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
      if (block) {
        initiateSwapTransaction = block.transactions.find(transaction =>
          this.doesTransactionMatchSwapParams(transaction, value, recipientAddress, refundAddress, secretHash, expiration)
        )
        blockNumber++
      }
      await sleep(5000)
    }
    return initiateSwapTransaction
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, startBlock) {
    let blockNumber = startBlock || await this.getMethod('getBlockHeight')()
    let claimSwapTransaction = null
    while (!claimSwapTransaction) {
      const initiationTransaction = await this.getMethod('getTransactionReceipt')(initiationTxHash)
      const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
      if (block && initiationTransaction) {
        const transaction = block.transactions.find(transaction => transaction.to === initiationTransaction.contractAddress)
        if (transaction) {
          const transactionReceipt = await this.getMethod('getTransactionReceipt')(transaction.hash)
          if (transactionReceipt.status === '1') claimSwapTransaction = transaction
        }
        blockNumber++
      }
      await sleep(5000)
    }
    claimSwapTransaction.secret = await this.getSwapSecret(claimSwapTransaction.hash)
    return claimSwapTransaction
  }

  async getSwapSecret (claimTxHash) {
    const claimTransaction = await this.getMethod('getTransactionByHash')(claimTxHash)
    return claimTransaction.input
  }
}
