import { NodeProvider as NodeProvider } from '@liquality/node-provider'
// import { BigNumber, ChainProvider, Address, Block, Transaction, SendOptions, flow } from '@liquality/types'
import { ChainProvider, Block, Transaction, flow } from '@liquality/types'
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

  async getBlockByHash(blockHash: string): Promise<Block<any>> {
    console.log('getBlockByHash')

    const block = await fcl.send([fcl.getBlock(), fcl.atBlockId(blockHash)]).then(fcl.decode)
    console.log('block: ', block)

    const parsedBlock = await this.parseBlock(block)
    console.log('parsedBlock: ', parsedBlock)

    return await this.parseBlock(block)
  }

  async getBlockByNumber(blockNumber: number): Promise<Block<any>> {
    console.log('getBlockByNumber')

    const block = await fcl.send([fcl.getBlock(), fcl.atBlockHeight(blockNumber)]).then(fcl.decode)
    console.log('block: ', block)

    const parsedBlock = await this.parseBlock(block)
    console.log('parsedBlock: ', parsedBlock)

    return parsedBlock
  }

  async getBlockHeight(): Promise<number> {
    const block = await fcl.latestBlock(false)

    return block.height
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<flow.Tx>> {
    const tx = await fcl.send([fcl.getTransaction(txHash)]).then(fcl.decode)

    return normalizeTx(tx, txHash)
  }

  // getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
  //   throw new Error('Method not implemented.')
  // }

  // sendTransaction(options: SendOptions): Promise<Transaction<any>> {
  //   throw new Error('Method not implemented.')
  // }

  // sendRawTransaction(rawTransaction: string): Promise<string> {
  //   throw new Error('Method not implemented.')
  // }

  async parseBlock(block: flow.BlockResponse): Promise<Block<flow.Tx>> {
    const txs: flow.Tx[] = []
    return normalizeBlock(block, txs)
  }
}
