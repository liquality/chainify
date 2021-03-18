import JsonRpcProvider from '@liquality/jsonrpc-provider'
import {
  formatEthResponse,
  ensure0x,
  normalizeTransactionObject,
  remove0x,
  buildTransaction
} from '@liquality/ethereum-utils'
import { addressToString, Address, sleep } from '@liquality/utils'
import { InvalidDestinationAddressError, TxNotFoundError, BlockNotFoundError } from '@liquality/errors'
import { padHexStart } from '@liquality/crypto'

import { isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { version } from '../package.json'

const GAS_LIMIT_MULTIPLIER = 1.5

export default class EthereumRpcProvider extends JsonRpcProvider {
  constructor (uri, username, password) {
    super(uri, username, password)
    this._usedAddressCache = {}
  }

  async rpc (method, ...params) {
    const result = await this.jsonrpc(method, ...params)
    return formatEthResponse(result)
  }

  async getAddresses () {
    const addresses = await this.rpc('eth_accounts')

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
    const addresses = await this.rpc('eth_accounts')

    return addresses.length > 0
  }

  async sendTransaction (to, value, data, gasPrice) {
    const addresses = await this.getAddresses()
    const from = addressToString(addresses[0])

    const txData = await buildTransaction(from, to, value, data, gasPrice)
    const gas = await this.estimateGas(txData)
    txData.gas = ensure0x(gas.toString(16))

    const txHash = await this.rpc('eth_sendTransaction', txData)

    txData.hash = txHash

    return normalizeTransactionObject(formatEthResponse(txData))
  }

  async updateTransactionFee (tx, newGasPrice) {
    const txHash = typeof tx === 'string' ? tx : tx.hash
    const transaction = await this.getMethod('getTransactionByHash')(txHash)

    const txData = await buildTransaction(transaction._raw.from, transaction._raw.to, transaction._raw.value, transaction._raw.input, newGasPrice, transaction._raw.nonce)

    const gas = await this.getMethod('estimateGas')(txData)
    txData.gas = ensure0x((gas).toString(16))

    const newTxHash = await this.rpc('eth_sendTransaction', txData)

    txData.hash = newTxHash

    return normalizeTransactionObject(formatEthResponse(txData))
  }

  async sendRawTransaction (hash) {
    return this.rpc('eth_sendRawTransaction', ensure0x(hash))
  }

  async signMessage (message, from) {
    from = ensure0x(addressToString(from))
    message = ensure0x(Buffer.from(message).toString('hex'))

    return this.rpc('eth_sign', from, message)
  }

  async getBlockByHash (blockHash, includeTx) {
    const block = await this.rpc('eth_getBlockByHash', ensure0x(blockHash), includeTx)

    if (block && includeTx) {
      const currentHeight = await this.getBlockHeight()
      block.transactions = block.transactions.map(tx => normalizeTransactionObject(tx, currentHeight))
    }

    return block
  }

  async getBlockByNumber (blockNumber, includeTx) {
    const block = await this.rpc('eth_getBlockByNumber', '0x' + blockNumber.toString(16), includeTx)

    if (!block) {
      throw new BlockNotFoundError(`Block not found: ${blockNumber}`)
    }

    if (block && includeTx) {
      const currentHeight = await this.getBlockHeight()
      block.transactions = block.transactions.map(tx => normalizeTransactionObject(tx, currentHeight))
    }

    return block
  }

  async getBlockHeight () {
    const hexHeight = await this.rpc('eth_blockNumber')

    return parseInt(hexHeight, '16')
  }

  async getTransactionByHash (txHash) {
    txHash = ensure0x(txHash)

    const currentBlock = await this.getBlockHeight()
    const tx = await this.rpc('eth_getTransactionByHash', txHash)

    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${txHash}`)
    }

    return normalizeTransactionObject(tx, currentBlock)
  }

  async getTransactionReceipt (txHash) {
    txHash = ensure0x(txHash)
    return this.rpc('eth_getTransactionReceipt', txHash)
  }

  async getTransactionCount (address, block = 'latest') {
    address = ensure0x(addressToString(address))

    const count = await this.rpc('eth_getTransactionCount', address, block)

    return parseInt(count, '16')
  }

  async getGasPrice () {
    const gasPrice = await this.rpc('eth_gasPrice')
    return BigNumber(parseInt(gasPrice, '16')).div(1e9).toNumber() // Gwei
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [ addresses ]
    }

    addresses = addresses
      .map(addressToString)
      .map(ensure0x)

    const promiseBalances = await Promise.all(addresses.map(
      address => this.rpc('eth_getBalance', address, 'latest')
    ))

    return promiseBalances
      .map(balance => new BigNumber(balance, 16))
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }

  async estimateGas (transaction) {
    const result = await this.rpc('eth_estimateGas', transaction)
    const gas = parseInt(result, '16')
    if (gas === 21000) return gas
    return Math.ceil(gas * GAS_LIMIT_MULTIPLIER)
  }

  async isAddressUsed (address) {
    address = ensure0x(addressToString(address))

    if (this._usedAddressCache[address]) return true

    let transactionCount = await this.rpc('eth_getTransactionCount', address, 'latest')
    transactionCount = parseInt(transactionCount, '16')

    const isUsed = transactionCount > 0

    if (isUsed) this._usedAddressCache[address] = true

    return isUsed
  }

  async getCode (address, block) {
    address = ensure0x(String(address))
    block = typeof (block) === 'number' ? ensure0x(padHexStart(block.toString(16))) : block
    const code = await this.rpc('eth_getCode', address, block)
    return remove0x(code)
  }

  async assertContractExists (address) {
    const code = await this.getCode(address, 'latest')
    if (code === '') throw new InvalidDestinationAddressError(`Contract does not exist at given address: ${address}`)
  }

  async stopMiner () {
    await this.rpc('miner_stop')
  }

  async startMiner () {
    await this.rpc('miner_start')
  }

  async evmMine () {
    await this.rpc('evm_mine')
  }

  async generateBlock (numberOfBlocks) {
    if (numberOfBlocks && numberOfBlocks > 1) {
      throw new Error('Ethereum generation limited to 1 block at a time.')
    }
    try {
      await this.evmMine()
    } catch (e) { // Fallback onto geth way of triggering mine
      await this.startMiner()
      await sleep(500) // Give node a chance to mine
      await this.stopMiner()
    }
  }
}

EthereumRpcProvider.version = version
