import Provider from '../../Provider'
import { padHexStart } from '../../crypto'
import { ensureAddressStandardFormat, ensureHexEthFormat } from './EthereumUtil'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class EthereumERC20Provider extends Provider {
  constructor (contractAddress) {
    super()
    this._contractAddress = ensureAddressStandardFormat(contractAddress)
  }

  generateErc20Transfer (to, value) {
    const functionSignature = 'a9059cbb'
    const encodedAddress = padHexStart(ensureAddressStandardFormat(to), 64)
    const encodedValue = padHexStart(value.toString(16), 64)
    return functionSignature + encodedAddress + encodedValue
  }

  erc20Transfer (to, value) {
    const txBytecode = this.generateErc20Transfer(to, value)
    return this.getMethod('sendTransaction')(ensureHexEthFormat(this._contractAddress), 0, txBytecode)
  }

  // TODO temporary way to expose contract address to other providers
  erc20 () {
    return this._contractAddress
  }

  setErc20 (contractAddress) {
    this._contractAddress = contractAddress
  }

  // TODO Should check for BigNumber
  async erc20Balance (addresses) {
    const functionSignature = '0x70a08231'
    addresses = addresses
      .map(address => String(address))
    const addrs = addresses.map(ensureHexEthFormat)
    const promiseBalances = await Promise.all(addrs.map(address => this.getMethod('jsonrpc')('eth_call', { data: functionSignature + padHexStart(ensureAddressStandardFormat(address), 64), to: ensureHexEthFormat(this._contractAddress) }, 'latest')))
    return promiseBalances.map(balance => parseInt(balance, 16))
      .reduce((acc, balance) => acc + balance, 0)
  }

  async getBalance (addresses) {
    return this.erc20Balance(addresses)
  }

  // TODO not used anymore (was only there for tests)
  doesTransactionMatchesErc20Transfer (transaction, to, value) {
    return transaction.input === this.generateErc20Transfer(to, value)
  }

  // TODO not used anymore (was only there for tests)
  async findErc20Transfer (from, to, value) {
    let blockNumber = await this.getMethod('getBlockHeight')()
    let erc20TransferTransaction = null
    while (!erc20TransferTransaction) {
      const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
      if (block) {
        erc20TransferTransaction = block.transactions.find(transaction =>
          this.doesTransactionMatchesErc20Transfer(transaction, to, value)
        )
        if (erc20TransferTransaction != null) {
          const transactionReceipt = await this.getMethod('getTransactionReceipt')(erc20TransferTransaction.hash)
          if (transactionReceipt.status !== '1') {
            erc20TransferTransaction = null
          }
        }
        blockNumber++
      }
      await sleep(5000)
    }
    return erc20TransferTransaction
  }
}
