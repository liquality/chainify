import { JsonRpcProvider } from '@liquality/jsonrpc-provider'
import {
  numberToHex,
  hexToNumber,
  ensure0x,
  normalizeTransactionObject,
  remove0x,
  buildTransaction
} from '@liquality/ethereum-utils'
import { Address, Block, ethereum, SendOptions, Transaction, ChainProvider, BigNumber } from '@liquality/types'
import { sleep, addressToString } from '@liquality/utils'
import { InvalidDestinationAddressError, TxNotFoundError, BlockNotFoundError } from '@liquality/errors'
import { padHexStart } from '@liquality/crypto'

const GAS_LIMIT_MULTIPLIER = 1.5

export default class EthereumRpcProvider extends JsonRpcProvider implements Partial<ChainProvider> {
  _usedAddressCache: { [key: string]: boolean }

  constructor(options: { uri: string; username?: string; password?: string }) {
    super(options.uri, options.username, options.password)
    this._usedAddressCache = {}
  }

  async rpc<TResponse>(method: string, ...params: any[]): Promise<TResponse> {
    const result = await this.jsonrpc(method, ...params)
    return result
  }

  async getAddresses(): Promise<Address[]> {
    const addresses = await this.rpc<string[]>('eth_accounts')

    return addresses.map((address: string) => new Address({ address: remove0x(address) }))
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses()

    return addresses[0]
  }

  async getUsedAddresses(): Promise<Address[]> {
    const addresses = await this.getAddresses()

    return [addresses[0]]
  }

  async isWalletAvailable(): Promise<boolean> {
    const addresses = await this.rpc<ethereum.Address[]>('eth_accounts')

    return addresses.length > 0
  }

  async sendTransaction(options: SendOptions): Promise<Transaction<ethereum.PartialTransaction>> {
    const addresses = await this.getAddresses()
    const from = addresses[0].address

    const txOptions: ethereum.UnsignedTransaction = {
      from,
      to: options.to ? addressToString(options.to) : (options.to as string),
      value: options.value,
      data: options.data
    }
    if (options.fee) txOptions.gasPrice = new BigNumber(options.fee)

    const txData = buildTransaction(txOptions)
    const gas = await this.estimateGas(txData)
    txData.gas = numberToHex(gas)

    const txHash = await this.rpc<ethereum.Hex>('eth_sendTransaction', txData)

    const txWithHash: ethereum.PartialTransaction = {
      ...txData,
      input: txData.data,
      hash: txHash
    }

    return normalizeTransactionObject(txWithHash)
  }

  async updateTransactionFee(tx: Transaction<ethereum.PartialTransaction> | string, newGasPrice: number) {
    const txHash = typeof tx === 'string' ? tx : tx.hash
    const transaction = await this.getTransactionByHash(txHash)

    const txOptions: ethereum.UnsignedTransaction = {
      from: transaction._raw.from,
      to: transaction._raw.to,
      value: new BigNumber(transaction._raw.value),
      gasPrice: new BigNumber(newGasPrice),
      data: transaction._raw.input,
      nonce: hexToNumber(transaction._raw.nonce)
    }

    const txData = buildTransaction(txOptions)

    const gas = await this.getMethod('estimateGas')(txData)
    txData.gas = numberToHex(gas)

    const newTxHash = await this.rpc<ethereum.Hex>('eth_sendTransaction', txData)

    const txWithHash: ethereum.PartialTransaction = {
      ...txData,
      input: txData.data,
      hash: newTxHash
    }

    return normalizeTransactionObject<ethereum.PartialTransaction>(txWithHash)
  }

  async sendRawTransaction(hash: string): Promise<string> {
    return this.rpc('eth_sendRawTransaction', ensure0x(hash))
  }

  async signMessage(message: string, from?: string): Promise<string> {
    from = ensure0x(from)
    message = ensure0x(Buffer.from(message).toString('hex'))
    const sig = await this.rpc<ethereum.Hex>('eth_sign', from, message)
    return remove0x(sig)
  }

  normalizeBlock(block: ethereum.Block) {
    const normalizedBlock: Block = {
      hash: remove0x(block.hash),
      parentHash: remove0x(block.parentHash),
      timestamp: hexToNumber(block.timestamp),
      size: hexToNumber(block.size),
      nonce: hexToNumber(block.nonce),
      number: hexToNumber(block.number),
      difficulty: hexToNumber(block.difficulty)
    }

    return normalizedBlock
  }

  async parseBlock(block: ethereum.Block, includeTx: boolean): Promise<Block> {
    const normalizedBlock = this.normalizeBlock(block)
    if (block && includeTx) {
      const currentHeight = await this.getBlockHeight()
      normalizedBlock.transactions = block.transactions.map((tx: ethereum.Transaction) =>
        normalizeTransactionObject(tx, currentHeight)
      )
    } else {
      normalizedBlock.transactions = block.transactions
    }
    return normalizedBlock
  }

  async getBlockByHash(blockHash: string, includeTx = false): Promise<Block> {
    const block = await this.rpc<ethereum.Block>('eth_getBlockByHash', ensure0x(blockHash), includeTx)
    if (!block) {
      throw new BlockNotFoundError(`Block not found: ${blockHash}`)
    }

    return this.parseBlock(block, includeTx)
  }

  async getBlockByNumber(blockNumber: number, includeTx = false): Promise<Block> {
    const block = await this.rpc<ethereum.Block>('eth_getBlockByNumber', numberToHex(blockNumber), includeTx)

    if (!block) {
      throw new BlockNotFoundError(`Block not found: ${blockNumber}`)
    }

    return this.parseBlock(block, includeTx)
  }

  async getBlockHeight() {
    const hexHeight = await this.rpc<ethereum.Hex>('eth_blockNumber')

    return hexToNumber(hexHeight)
  }

  async getTransactionByHash(txHash: string) {
    txHash = ensure0x(txHash)

    const currentBlock = await this.getBlockHeight()
    const tx = await this.rpc<ethereum.Transaction>('eth_getTransactionByHash', txHash)

    if (!tx) {
      throw new TxNotFoundError(`Transaction not found: ${txHash}`)
    }

    return normalizeTransactionObject(tx, currentBlock)
  }

  async getTransactionReceipt(txHash: string): Promise<ethereum.TransactionReceipt> {
    txHash = ensure0x(txHash)
    return this.rpc('eth_getTransactionReceipt', txHash)
  }

  async getTransactionCount(address: string, block = 'latest') {
    address = ensure0x(address)

    const count = await this.rpc<ethereum.Hex>('eth_getTransactionCount', address, block)

    return hexToNumber(count)
  }

  async getGasPrice() {
    const gasPrice = await this.rpc<ethereum.Hex>('eth_gasPrice')
    return new BigNumber(gasPrice).div(1e9) // Gwei
  }

  async getBalance(_addresses: (Address | string)[]) {
    const addresses = _addresses.map(addressToString).map(ensure0x)

    const promiseBalances = await Promise.all(
      addresses.map((address) => this.rpc<ethereum.Hex>('eth_getBalance', address, 'latest'))
    )

    return promiseBalances
      .map((balance) => new BigNumber(balance))
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }

  async estimateGas(transaction: ethereum.TransactionRequest) {
    const result = await this.rpc<ethereum.Hex>('eth_estimateGas', transaction)
    const gas = hexToNumber(result)
    if (gas === 21000) return gas
    return Math.ceil(gas * GAS_LIMIT_MULTIPLIER)
  }

  async getCode(address: string, block: string | number) {
    address = ensure0x(String(address))
    block = typeof block === 'number' ? ensure0x(padHexStart(block.toString(16))) : block
    const code = await this.rpc<ethereum.Hex>('eth_getCode', address, block)
    return remove0x(code)
  }

  async assertContractExists(address: string) {
    const code = await this.getCode(address, 'latest')
    if (code === '') throw new InvalidDestinationAddressError(`Contract does not exist at given address: ${address}`)
  }

  async stopMiner() {
    await this.rpc('miner_stop')
  }

  async startMiner() {
    await this.rpc('miner_start')
  }

  async evmMine() {
    await this.rpc('evm_mine')
  }

  async generateBlock(numberOfBlocks: number) {
    if (numberOfBlocks && numberOfBlocks > 1) {
      throw new Error('Ethereum generation limited to 1 block at a time.')
    }
    try {
      await this.evmMine()
    } catch (e) {
      // Fallback onto geth way of triggering mine
      await this.startMiner()
      await sleep(500) // Give node a chance to mine
      await this.stopMiner()
    }
  }
}
