import JsonRpcProvider from '@liquality/jsonrpc-provider'
import {
  formatEthResponse,
  ensure0x,
  normalizeTransactionObject,
  remove0x,
  buildTransaction
} from '@liquality/ethereum-utils'
import { Address, Block, ethereum, SendOptions, Transaction, ChainProvider, BigNumber } from '@liquality/types'
import { sleep } from '@liquality/utils'
import { InvalidDestinationAddressError, TxNotFoundError, BlockNotFoundError } from '@liquality/errors'
import { padHexStart } from '@liquality/crypto'

const GAS_LIMIT_MULTIPLIER = 1.5

export default class EthereumRpcProvider extends JsonRpcProvider implements Partial<ChainProvider> {
  _usedAddressCache: {[key: string]: boolean}

  constructor (uri: string, username?: string, password?: string) {
    super(uri, username, password)
    this._usedAddressCache = {}
  }

  async rpc (method: string, ...params: any[]) {
    const result = await this.jsonrpc(method, ...params)
    return formatEthResponse(result)
  }

  async getAddresses () : Promise<Address[]> {
    const addresses = await this.rpc('eth_accounts')

    return addresses.map((address: string) => <Address> { address })
  }

  async getUnusedAddress () : Promise<Address> {
    const addresses = await this.getAddresses()

    return addresses[0]
  }

  async getUsedAddresses () : Promise<Address[]> {
    const addresses = await this.getAddresses()

    return [ addresses[0] ]
  }

  async isWalletAvailable () : Promise<boolean> {
    const addresses = await this.rpc('eth_accounts')

    return addresses.length > 0
  }

  async sendTransaction (options: SendOptions) : Promise<Transaction<ethereum.TransactionResponse>> {
    const addresses = await this.getAddresses()
    const from = addresses[0].address

    const txOptions : ethereum.UnsignedTransaction = {
      from,
      to: options.to,
      value: options.value,
      data: options.data,
      gasPrice: options.fee
    }
    const txData = buildTransaction(txOptions)
    const gas = await this.estimateGas(txData)
    txData.gasLimit = ensure0x(gas.toString(16))

    const txHash = await this.rpc('eth_sendTransaction', txData)

    return normalizeTransactionObject(formatEthResponse({ ...txData, hash: txHash }))
  }

  async updateTransactionFee (tx: Transaction<ethereum.TransactionResponse> | string, newGasPrice: BigNumber) {
    const txHash = typeof tx === 'string' ? tx : tx.hash
    const transaction = await this.getTransactionByHash(txHash)

    const txOptions : ethereum.UnsignedTransaction = {
      from: transaction._raw.from,
      to: transaction._raw.to,
      value: transaction._raw.value,
      gasPrice: newGasPrice,
      data: transaction._raw.data,
      nonce: transaction._raw.nonce
    }

    const txData = buildTransaction(txOptions)

    const gas = await this.getMethod('estimateGas')(txData)
    txData.gasLimit = ensure0x((gas).toString(16))

    const newTxHash = await this.rpc('eth_sendTransaction', txData)

    return normalizeTransactionObject(formatEthResponse({ ...txData, hash: newTxHash }))
  }

  async sendRawTransaction (hash: string) : Promise<string> {
    return this.rpc('eth_sendRawTransaction', ensure0x(hash))
  }

  async signMessage (message: string, from: string) : Promise<string> {
    from = ensure0x(from)
    message = ensure0x(Buffer.from(message).toString('hex'))

    return this.rpc('eth_sign', from, message)
  }

  async getBlockByHash (blockHash: string, includeTx: boolean = false) : Promise<Block> {
    const block = await this.rpc('eth_getBlockByHash', ensure0x(blockHash), includeTx)

    if (block && includeTx) {
      const currentHeight = await this.getBlockHeight()
      block.transactions = block.transactions.map((tx: ethereum.TransactionResponse) => normalizeTransactionObject(tx, currentHeight))
    }

    return block
  }

  async getBlockByNumber (blockNumber: number, includeTx: boolean = false) : Promise<Block> {
    const block = await this.rpc('eth_getBlockByNumber', '0x' + blockNumber.toString(16), includeTx)

    if (!block) {
      throw new BlockNotFoundError(`Block not found: ${blockNumber}`)
    }

    if (block && includeTx) {
      const currentHeight = await this.getBlockHeight()
      block.transactions = block.transactions.map((tx: ethereum.TransactionResponse) => normalizeTransactionObject(tx, currentHeight))
    }

    return block
  }

  async getBlockHeight () {
    const hexHeight = await this.rpc('eth_blockNumber')

    return parseInt(hexHeight, 16)
  }

  async getTransactionByHash (txHash: string) {
    txHash = ensure0x(txHash)

    const currentBlock = await this.getBlockHeight()
    const tx = await this.rpc('eth_getTransactionByHash', txHash)

    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${txHash}`)
    }

    return normalizeTransactionObject(tx, currentBlock)
  }

  async getTransactionReceipt (txHash: string) : Promise<ethereum.TransactionReceipt> {
    txHash = ensure0x(txHash)
    return this.rpc('eth_getTransactionReceipt', txHash)
  }

  async getTransactionCount (address: string, block = 'latest') {
    address = ensure0x(address)

    const count = await this.rpc('eth_getTransactionCount', address, block)

    return parseInt(count, 16)
  }

  async getGasPrice () {
    const gasPrice = await this.rpc('eth_gasPrice')
    return new BigNumber(parseInt(gasPrice, 16)).div(1e9) // Gwei
  }

  async getBalance (addresses: string[]) {
    addresses = addresses
      .map(ensure0x)

    const promiseBalances = await Promise.all(addresses.map(
      address => this.rpc('eth_getBalance', address, 'latest')
    ))

    return promiseBalances
      .map(balance => new BigNumber(balance, 16))
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }

  async estimateGas (transaction: ethereum.RawTransaction) {
    const hasValue = transaction.value && transaction.value !== '0x0'
    if (hasValue && !transaction.data) { return 21000 }

    const estimatedGas = await this.rpc('eth_estimateGas', transaction)

    return Math.ceil(parseInt(estimatedGas, 16) * GAS_LIMIT_MULTIPLIER)
  }

  async isAddressUsed (address: string) {
    address = ensure0x(address)

    if (this._usedAddressCache[address]) return true

    let transactionCount = await this.rpc('eth_getTransactionCount', address, 'latest')
    transactionCount = parseInt(transactionCount, 16)

    const isUsed = transactionCount > 0

    if (isUsed) this._usedAddressCache[address] = true

    return isUsed
  }

  async getCode (address: string, block: string | number) {
    address = ensure0x(String(address))
    block = typeof (block) === 'number' ? ensure0x(padHexStart(block.toString(16))) : block
    const code = await this.rpc('eth_getCode', address, block)
    return remove0x(code)
  }

  async assertContractExists (address: string) {
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

  async generateBlock (numberOfBlocks : number) {
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
