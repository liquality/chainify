import { isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import JsonRpcProvider from '@liquality/jsonrpc-provider'
import {
  formatEthResponse,
  ensure0x,
  normalizeTransactionObject,
  remove0x
} from '@liquality/ethereum-utils'
import { addressToString, Address } from '@liquality/utils'
import { padHexStart } from '@liquality/crypto'

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

  async sendTransaction (to, value, data) {
    const addresses = await this.getAddresses()
    const from = addresses[0]

    const tx = {
      from: ensure0x(addressToString(from)),
      to: to ? ensure0x(addressToString(from)) : null,
      value: ensure0x(BigNumber(value).toString(16))
    }

    if (to) tx.to = ensure0x(addressToString(to))
    if (data) {
      tx.data = ensure0x(data)
      tx.gas = ensure0x((await this.estimateGas(tx)).toString(16))
    }

    const txHash = await this.jsonrpc('eth_sendTransaction', tx)

    return remove0x(txHash)
  }

  async sendRawTransaction (hash) {
    const txHash = await this.jsonrpc('eth_sendRawTransaction', ensure0x(hash))

    return txHash
  }

  async signMessage (message, from) {
    from = ensure0x(addressToString(from))
    message = ensure0x(Buffer.from(message).toString('hex'))

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
    txHash = ensure0x(txHash)

    const currentBlock = await this.getBlockHeight()
    const tx = await this.jsonrpc('eth_getTransactionByHash', txHash)

    return normalizeTransactionObject(tx, currentBlock)
  }

  async getTransactionReceipt (txHash) {
    txHash = ensure0x(txHash)
    return this.jsonrpc('eth_getTransactionReceipt', txHash)
  }

  async getTransactionCount (address) {
    address = ensure0x(addressToString(address))

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
      .map(ensure0x)

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
    address = ensure0x(addressToString(address))

    let transactionCount = await this.jsonrpc('eth_getTransactionCount', address, 'latest')
    transactionCount = parseInt(transactionCount, '16')

    return transactionCount > 0
  }

  async getCode (address, block) {
    address = ensure0x(String(address))
    block = typeof (block) === 'number' ? ensure0x(padHexStart(block.toString(16))) : block
    const code = await this.jsonrpc('eth_getCode', address, block)
    return remove0x(code)
  }
}

EthereumRpcProvider.version = version
