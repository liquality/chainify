import JsonRpcProvider from '../JsonRpcProvider'
import { BigNumber } from 'bignumber.js'

import { formatEthResponse, ensureHexEthFormat, normalizeTransactionObject, ensureHexStandardFormat } from './EthereumUtil'

export default class EthereumRPCProvider extends JsonRpcProvider {
  _parseResponse (response) {
    const data = super._parseResponse(response)

    return formatEthResponse(data)
  }

  async getAddresses () {
    const addresses = await this.jsonrpc('eth_accounts')
    return addresses.map(address => ({ address }))
  }

  async generateBlock (numberOfBlocks) {
    // Q: throw or silently pass?
    throw new Error('This method isn\'t supported by Ethereum')
  }

  async getUnusedAddress () {
    var addresses = await this.getAddresses()
    return addresses[0]
  }

  async sendTransaction (to, value, data, from = null) {
    if (to != null) {
      to = ensureHexEthFormat(to)
    }

    if (from == null) {
      const addresses = await this.getAddresses()
      const address = addresses[0].address
      from = ensureHexEthFormat(address)
    }
    value = BigNumber(value).toString(16)

    const tx = {
      from: ensureHexEthFormat(from),
      to,
      value: ensureHexEthFormat(value),
      data: ensureHexEthFormat(data)
    }

    const txHash = await this.jsonrpc('eth_sendTransaction', tx)
    return ensureHexStandardFormat(txHash)
  }

  async signMessage (message, address) {
    address = '0x' + address
    message = '0x' + Buffer.from(message).toString('hex')
    return this.jsonrpc('eth_sign', address, message)
  }

  async getBlockByNumber (blockNumber, includeTx) {
    const currentBlock = await this.getBlockHeight()
    const block = await this.jsonrpc('eth_getBlockByNumber', '0x' + blockNumber.toString(16), includeTx)
    if (block) {
      block.transactions = block.transactions.map(tx => normalizeTransactionObject(tx, currentBlock))
    }
    return block
  }

  async getBlockHeight () {
    const hexHeight = await this.jsonrpc('eth_blockNumber')
    return parseInt(hexHeight, '16')
  }

  async getTransactionByHash (txHash) {
    txHash = ensureHexEthFormat(txHash)
    const currentBlock = await this.getBlockHeight()
    const tx = await this.jsonrpc('eth_getTransactionByHash', txHash)
    return normalizeTransactionObject(tx, currentBlock)
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
    address = ensureHexEthFormat(String(address))

    const transactionCount = this.jsonrpc('eth_getTransactionCount', address, 'latest')

    return transactionCount > 0
  }
}
