import NodeProvider from '@liquality/node-provider'
import { near, BigNumber, ChainProvider, FeeProvider, Address, Block, Transaction } from '@liquality/types'
import { NearNetwork } from '@liquality/near-networks'
import { addressToString } from '@liquality/utils'
import { normalizeTransactionObject, providers, Account, fromNearTimestamp } from '@liquality/near-utils'
import { NodeError } from '@liquality/errors'

import { get, isArray } from 'lodash'

interface RpcProvider extends providers.JsonRpcProvider {
  [key: string]: any
}

export default class NearRpcProvider extends NodeProvider implements Partial<ChainProvider>, FeeProvider {
  _usedAddressCache: { [key: string]: boolean }
  _accountsCache: { [key: string]: boolean }
  _network: NearNetwork
  _jsonRpc: RpcProvider

  constructor(network: NearNetwork) {
    super({
      baseURL: network.helperUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this._jsonRpc = new providers.JsonRpcProvider(network.nodeUrl)
    this._network = network
    this._usedAddressCache = {}
    this._accountsCache = {}
  }

  async sendRawTransaction(hash: string): Promise<string> {
    const result = await this._sendRawTransaction(hash)
    return get(result, 'transaction.hash')
  }

  async getBlockByHash(blockHash: string, includeTx: boolean) {
    return this._getBlockById(blockHash, includeTx)
  }

  async getBlockByNumber(blockNumber: number, includeTx?: boolean) {
    return this._getBlockById(blockNumber, includeTx)
  }

  async getBlockHeight(txHash?: string) {
    const result = await this._rpc('block', txHash ? { blockId: txHash } : { finality: 'final' })
    return get(result, 'header.height')
  }

  async getTransactionByHash(txHash: string) {
    const currentHeight = await this.getBlockHeight()
    const args = txHash.split('_')
    const tx = await this._rpcQuery('tx', args)
    const blockHash = tx.transaction_outcome.block_hash
    const blockNumber = await this.getBlockHeight(blockHash)
    return normalizeTransactionObject({ ...tx, blockNumber, blockHash }, currentHeight)
  }

  async getTransactionReceipt(txHash: string): Promise<near.InputTransaction> {
    const args = txHash.split('_')
    const tx = await this._rpcQuery('EXPERIMENTAL_tx_status', args)
    const blockNumber = await this.getBlockHeight(tx.transaction_outcome.block_hash)
    return { ...tx, blockNumber }
  }

  async getGasPrice() {
    const result = await this._rpcQuery('gas_price', [null])
    return get(result, 'gas_price')
  }

  async getBalance(_addresses: (Address | string)[]): Promise<BigNumber> {
    const addresses = _addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      addresses.map(async (address) => {
        try {
          const balance = await this.getAccount(address).getAccountBalance()
          return new BigNumber(balance.available)
        } catch (err) {
          if (err.message && err.message.includes('does not exist while viewing')) {
            return new BigNumber(0)
          }
          throw err
        }
      })
    )

    return promiseBalances
      .map((balance) => new BigNumber(balance))
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }

  async generateBlock(numberOfBlocks: number) {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 20000))
  }

  getAccount(accountId: string, signer?: any): Account {
    return new Account(
      {
        networkId: this._network.networkId,
        provider: this._jsonRpc,
        signer
      },
      accountId
    )
  }

  async getFees() {
    return {
      slow: {
        fee: 0.0001,
        wait: 1
      },
      average: {
        fee: 0.0001,
        wait: 1
      },
      fast: {
        fee: 0.0001,
        wait: 1
      }
    }
  }

  async _sendRawTransaction(hash: string) {
    return this._rpcQuery('broadcast_tx_commit', [hash])
  }

  normalizeBlock(block: near.NearInputBlockHeader) {
    const normalizedBlock: Block<Transaction<near.InputTransaction>> = {
      number: block.height,
      hash: block.hash,
      timestamp: fromNearTimestamp(block.timestamp),
      size: block.chunks_included,
      transactions: [],
      parentHash: block.prev_hash
    }

    return normalizedBlock
  }

  async _getBlockById(blockId: number | string, includeTx: boolean) {
    const block = await this._rpc('block', { blockId })
    const currentHeight = await this.getBlockHeight()
    const header = block.header
    const normalizedBlock = this.normalizeBlock(header)

    if (includeTx && !block.transactions && isArray(block.chunks)) {
      const chunks = await Promise.all(block.chunks.map((c: any) => this._rpc('chunk', c.chunk_hash)))

      const transactions = chunks.reduce<Transaction<near.InputTransaction>[]>(
        (p: Transaction<near.InputTransaction>[], c: near.NearChunk) => {
          const tx = c.transactions.map((t: near.Tx) => {
            return normalizeTransactionObject(
              {
                transaction: t,
                blockNumber: header.height,
                blockHash: header.hash
              },
              currentHeight
            )
          })
          p.push(...tx)
          return p
        },
        []
      )

      normalizedBlock.transactions = transactions
    }

    return normalizedBlock
  }

  async _rpc(method: any, args: any) {
    try {
      const data = await this._jsonRpc[method](args)
      return data
    } catch (error) {
      throw new NodeError(`${error.type} ${error.message}` || error)
    }
  }

  async _rpcQuery(method: string, args: any[]) {
    try {
      const data = await this._jsonRpc.sendJsonRpc(method, args)
      return data
    } catch (error) {
      throw new NodeError(`${error.type} ${error.message}` || error)
    }
  }
}
