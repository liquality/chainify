import { version } from '../package.json'

export default class InjectedProvider {
  constructor (injectedProvider) {
    this.injectedProvider = injectedProvider
  }

  // <chain>

  async getBlockByHash (blockHash, includeTx = false) {
    return this.injectedProvider.getMethod('getBlockByHash')(blockHash, includeTx)
  }

  async getBlockByNumber (blockNumber, includeTx = false) {
    return this.injectedProvider.getMethod('getBlockByNumber')(blockNumber, includeTx)
  }

  async getBlockHeight () {
    return this.injectedProvider.getMethod('getBlockHeight')()
  }

  async getTransactionByHash (txHash) {
    return this.injectedProvider.getMethod('getTransactionByHash')(txHash)
  }

  async getBalance (addresses) {
    return this.injectedProvider.getMethod('getBalance')(addresses)
  }

  async isAddressUsed (address) {
    return this.injectedProvider.getMethod('isAddressUsed')(address)
  }

  async buildTransaction (to, value, data, from) {
    return this.injectedProvider.getMethod('buildTransaction')(to, value, data, from)
  }

  async buildBatchTransaction (transactions) {
    return this.injectedProvider.getMethod('buildBatchTransaction')(transactions)
  }

  async sendTransaction (to, value, data, from) {
    return this.injectedProvider.getMethod('sendTransaction')(to, value, data, from)
  }

  async sendBatchTransaction (transactions) {
    return this.injectedProvider.getMethod('sendBatchTransaction')(transactions)
  }

  async sendRawTransaction (rawTransaction) {
    return this.injectedProvider.getMethod('sendRawTransaction')(rawTransaction)
  }

  async getConnectedNetwork () {
    return this.injectedProvider.getMethod('getConnectedNetwork')()
  }

  async getAddressMempool (addresses) {
    return this.injectedProvider.getMethod('getAddressMempool')(addresses)
  }

  async getTransactionReceipt (txHash) {
    return this.injectedProvider.getMethod('getTransactionReceipt')(txHash)
  }

  // </chain>

  // <wallet>

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this.injectedProvider.getMethod('getAddresses')(startingIndex, numAddresses, change)
  }

  async getUsedAddresses (numAddressPerCall) {
    return this.injectedProvider.getMethod('getUsedAddresses')(numAddressPerCall)
  }

  async getUnusedAddress (change, numAddressPerCall) {
    return this.injectedProvider.getMethod('getUnusedAddress')(change, numAddressPerCall)
  }

  async signMessage (message, from) {
    return this.injectedProvider.getMethod('signMessage')(message, from)
  }

  async isWalletAvailable () {
    return this.injectedProvider.getMethod('isWalletAvailable')()
  }

  async getWalletNetworkId () {
    return this.injectedProvider.getMethod('getWalletNetworkId')()
  }

  // </wallet>

  // <swap>

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.injectedProvider.getMethod('findInitiateSwapTransaction')(value, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.injectedProvider.getMethod('findClaimSwapTransaction')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.injectedProvider.getMethod('findRefundSwapTransaction')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber)
  }

  async generateSecret (message) {
    return this.injectedProvider.getMethod('generateSecret')(message)
  }

  async getSwapSecret (claimTxHash) {
    return this.injectedProvider.getMethod('getSwapSecret')(claimTxHash)
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('initiateSwap')(value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('createSwapScript')(recipientAddress, refundAddress, secretHash, expiration)
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('verifyInitiateSwapTransaction')(initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    return this.injectedProvider.getMethod('claimSwap')(initiationTxHash, recipientAddress, refundAddress, secret, expiration)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    return this.injectedProvider.getMethod('refundSwap')(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration)
  }

  async doesBlockScan () {
    return this.injectedProvider.getMethod('doesBlockScan')()
  }

  // </swap>
}

InjectedProvider.version = version
