import JsonRpcProvider from '../JsonRpcProvider'

import { formatEthResponse, ensureHexEthFormat } from './EthereumUtil'

export default class EthereumRPCProvider extends JsonRpcProvider {
  _parseResponse (response) {
    const data = super._parseResponse(response)

    return formatEthResponse(data)
  }

  async getAddresses () {
    return this.jsonrpc('eth_accounts')
  }

  async generateBlock (numberOfBlocks) {
    // Q: throw or silently pass?
    throw new Error('This method isn\'t supported by Ethereum')
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this.jsonrpc('eth_getBlockByNumber', blockNumber, includeTx)
  }

  async getBlockHeight () {
    const hexHeight = await this.jsonrpc('eth_blockNumber')
    return parseInt(hexHeight, '16')
  }

  async getTransactionByHash (txHash) {
    txHash = ensureHexEthFormat(txHash)
    return this.jsonrpc('eth_getTransactionByHash', txHash)
  }

  async getTransactionReceipt (txHash) {
    txHash = ensureHexEthFormat(txHash)
    return this.jsonrpc('eth_getTransactionReceipt', txHash)
  }

  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))

    const addrs = addresses.map(ensureHexEthFormat)
    const promiseBalances = await Promise.all(addrs.map(address => this.jsonrpc('eth_getBalance', address, 'latest')))
    return promiseBalances.map(balance => parseInt(balance, 16))
      .reduce((acc, balance) => acc + balance, 0)
  }

  async isAddressUsed (address) {
    address = String(address)

    const transactionCount = this.jsonrpc('getTransactionCount', address)

    return transactionCount > 0
  }
}
