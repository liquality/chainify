import { isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import JsonRpcProvider from '@liquality/jsonrpc-provider'
import {
  formatEthResponse,
  ensureHexEthFormat,
  normalizeTransactionObject,
  ensureHexStandardFormat
} from '@liquality/ethereum-utils'
import { addressToString, Address } from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumRpcProvider extends JsonRpcProvider {
  _parseResponse (response) {
    const data = super._parseResponse(response)

    return formatEthResponse(data)
  }

  async getAddresses () {
    const addresses = await this.jsonrpc('eth_accounts')

    return addresses.map(address => new Address({ address }))
  }

  async getUnusedAddress () {
    const addresses = await this.getAddresses()

    return addresses[0]
  }

  async getUsedAddresses () {
    const addresses = await this.getAddresses()

    return [ addresses[0] ]
  }

  async isWalletAvailable () {
    const addresses = await this.jsonrpc('eth_accounts')

    return addresses.length > 0
  }

  async sendTransaction (to, value, data, from = null) {
    if (to != null) {
      to = addressToString(to)
    }

    if (from == null) {
      const addresses = await this.getAddresses()
      from = addressToString(addresses[0])
    } else {
      from = addressToString(from)
    }

    value = BigNumber(value).toString(16)

    const tx = {
      from: ensureHexEthFormat(from),
      to: ensureHexEthFormat(to),
      value: ensureHexEthFormat(value)
    }

    if (data) tx.data = ensureHexEthFormat(data)

    const txHash = await this.jsonrpc('eth_sendTransaction', tx)

    return ensureHexStandardFormat(txHash)
  }

  async sendRawTransaction (hash) {
    const txHash = await this.jsonrpc('eth_sendRawTransaction', ensureHexEthFormat(hash))

    return txHash
  }

  async signMessage (message, from) {
    from = ensureHexEthFormat(addressToString(from))
    message = ensureHexEthFormat(Buffer.from(message).toString('hex'))

    return this.jsonrpc('eth_sign', from, message)
  }

  async getBlockByNumber (blockNumber, includeTx) {
    const currentHeight = await this.getBlockHeight()
    const block = await this.jsonrpc('eth_getBlockByNumber', '0x' + blockNumber.toString(16), includeTx)

    if (block) {
      block.transactions = block.transactions.map(tx => normalizeTransactionObject(tx, currentHeight))
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

  async getTransactionCount (address) {
    address = ensureHexEthFormat(addressToString(address))

    const count = await this.jsonrpc('eth_getTransactionCount', address, 'latest')

    return parseInt(count, '16')
  }

  async getGasPrice () {
    const gasPrice = await this.jsonrpc('eth_gasPrice')
    return parseInt(gasPrice, '16')
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [ addresses ]
    }

    addresses = addresses
      .map(addressToString)
      .map(ensureHexEthFormat)

    const promiseBalances = await Promise.all(addresses.map(
      address => this.jsonrpc('eth_getBalance', address, 'latest')
    ))

    return promiseBalances
      .map(balance => new BigNumber(balance, 16))
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }

  async estimateGas (transaction) {
    const estimatedGas = await this.jsonrpc('eth_estimateGas', transaction)

    return parseInt(estimatedGas, '16')
  }

  async isAddressUsed (address) {
    address = ensureHexEthFormat(addressToString(address))

    let transactionCount = await this.jsonrpc('eth_getTransactionCount', address, 'latest')
    transactionCount = parseInt(transactionCount, '16')

    return transactionCount > 0
  }
}

EthereumRpcProvider.version = version
