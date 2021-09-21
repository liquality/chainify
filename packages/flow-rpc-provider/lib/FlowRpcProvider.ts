import { NodeProvider as NodeProvider } from '@liquality/node-provider'
// import { BigNumber, ChainProvider, Address, Block, Transaction, SendOptions, flow } from '@liquality/types'
import { BigNumber, ChainProvider, Block, Transaction, flow } from '@liquality/types'
import { addressToString } from '@liquality/utils'

import { FlowNetwork } from '@liquality/flow-networks'
import { normalizeBlock, normalizeTx } from '@liquality/flow-utils'

import * as fcl from '@onflow/fcl'

export default class FlowRpcProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: FlowNetwork

  constructor(network: FlowNetwork) {
    super({
      baseURL: network.rpcUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this._network = network

    fcl
      .config()
      .put('accessNode.api', this._network.rpcUrl)
      .put('env', this._network.isTestnet ? 'testnet' : 'mainnet')
      .put('discovery.wallet', this._network.discoveryWallet)
  }

  // average block time is around 2.7 seconds
  async generateBlock(numberOfBlocks: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 3000))
  }

  async getBlockByHash(blockHash: string): Promise<Block<flow.Tx>> {
    const block = await fcl.send([fcl.getBlock(), fcl.atBlockId(blockHash)]).then(fcl.decode)
    const parsedBlock = await this.parseBlock(block)

    return parsedBlock
  }

  async getBlockByNumber(blockNumber: number): Promise<Block<flow.Tx>> {
    const block = await fcl.send([fcl.getBlock(), fcl.atBlockHeight(blockNumber)]).then(fcl.decode)
    const parsedBlock = await this.parseBlock(block)

    return parsedBlock
  }

  async getBlockHeight(): Promise<number> {
    const block = await fcl.latestBlock(false)

    return block.height
  }

  async getTransactionByHash(
    txHash: string,
    blockData?: Block<flow.Tx>,
    currentBlockHeight?: number
  ): Promise<Transaction<flow.Tx>> {
    const txRaw = await fcl.send([fcl.getTransaction(txHash)]).then(fcl.decode)
    const txAdditionaData = await fcl.tx(txHash).snapshot()

    const _currentBlockHeight = currentBlockHeight || (await this.getBlockHeight())
    const _blockData = blockData || (await this.getBlockByHash(txRaw.referenceBlockId))

    return normalizeTx({
      ...txRaw,
      ...txAdditionaData,
      txId: txHash,
      blockNumber: _blockData.number,
      blockConfirmations: _currentBlockHeight - _blockData.number
    })
  }

  async getBalance(addresses: string[]): Promise<BigNumber> {
    const _addresses = addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      _addresses.map(async (address: string) => {
        try {
          const account = await fcl.account(address)
          return new BigNumber(account.balance)
        } catch (err) {
          if (err.message) {
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

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    const txResponse = await fcl.send([fcl.script(rawTransaction)]).then(fcl.decode)

    // TODO: return correct value
    return txResponse.toString()
  }

  async parseBlock(block: flow.BlockResponse): Promise<Block<flow.Tx>> {
    // TODO: fetch txs
    const txs: flow.Tx[] = []
    return normalizeBlock(block, txs)
  }
}
