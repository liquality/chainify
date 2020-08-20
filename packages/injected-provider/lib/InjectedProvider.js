import BigNumber from 'bignumber.js'

import { version } from '../package.json'

export default class InjectedProvider {
  constructor (injectedProvider) {
    this.injectedProvider = injectedProvider
  }

  setClient (client) {}

  // <chain>

  async getBlockByHash (blockHash, includeTx = false) {
    return this.injectedProvider.getMethod('chain.getBlockByHash')(blockHash, includeTx)
  }

  async getBlockByNumber (blockNumber, includeTx = false) {
    return this.injectedProvider.getMethod('chain.getBlockByNumber')(blockNumber, includeTx)
  }

  async getBlockHeight () {
    return this.injectedProvider.getMethod('chain.getBlockHeight')()
  }

  async getTransactionByHash (txHash) {
    return this.injectedProvider.getMethod('chain.getTransactionByHash')(txHash)
  }

  async getBalance (addresses) {
    return this.injectedProvider
      .getMethod('chain.getBalance')(addresses)
      .then(balance => BigNumber(balance))
  }

  async isAddressUsed (address) {
    return this.injectedProvider.getMethod('chain.isAddressUsed')(address)
  }

  async buildTransaction (to, value, data, from) {
    return this.injectedProvider.getMethod('chain.buildTransaction')(to, value, data, from)
  }

  async buildBatchTransaction (transactions) {
    return this.injectedProvider.getMethod('chain.buildBatchTransaction')(transactions)
  }

  async sendTransaction (to, value, data, from) {
    return this.injectedProvider.getMethod('chain.sendTransaction')(to, value, data, from)
  }

  async sendBatchTransaction (transactions) {
    return this.injectedProvider.getMethod('chain.sendBatchTransaction')(transactions)
  }

  async sendRawTransaction (rawTransaction) {
    return this.injectedProvider.getMethod('chain.sendRawTransaction')(rawTransaction)
  }

  async getConnectedNetwork () {
    return this.injectedProvider.getMethod('chain.getConnectedNetwork')()
  }

  // </chain>

  // <wallet>

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this.injectedProvider.getMethod('wallet.getAddresses')(startingIndex, numAddresses, change)
  }

  async getUsedAddresses (numAddressPerCall) {
    return this.injectedProvider.getMethod('wallet.getUsedAddresses')(numAddressPerCall)
  }

  async getUnusedAddress (change, numAddressPerCall) {
    return this.injectedProvider.getMethod('wallet.getUnusedAddress')(change, numAddressPerCall)
  }

  async signMessage (message, from) {
    return this.injectedProvider.getMethod('wallet.signMessage')(message, from)
  }

  async isWalletAvailable () {
    return this.injectedProvider.getMethod('wallet.isWalletAvailable')()
  }

  async getWalletNetworkId () {
    return this.injectedProvider.getMethod('wallet.getWalletNetworkId')()
  }

  // </wallet>

  // <swap>

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.injectedProvider.getMethod('swap.findInitiateSwapTransaction')(value, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.injectedProvider.getMethod('swap.findClaimSwapTransaction')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.injectedProvider.getMethod('swap.findRefundSwapTransaction')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  async generateSecret (message) {
    return this.injectedProvider.getMethod('swap.generateSecret')(message)
  }

  async getSwapSecret (claimTxHash) {
    return this.injectedProvider.getMethod('swap.getSwapSecret')(claimTxHash)
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('swap.initiateSwap')(value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('swap.createSwapScript')(recipientAddress, refundAddress, secretHash, expiration)
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('swap.verifyInitiateSwapTransaction')(initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    return this.injectedProvider.getMethod('swap.claimSwap')(initiationTxHash, recipientAddress, refundAddress, secret, expiration)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('swap.refundSwap')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration)
  }

  async doesBlockScan () {
    return this.injectedProvider.getMethod('swap.doesBlockScan')()
  }

  // </swap>
}

InjectedProvider.version = version
