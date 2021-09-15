import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Address, Block, Transaction } from '@liquality/types'

const fcl = require('@onflow/fcl')

export default class FlowRpcProvider extends NodeProvider implements Partial<ChainProvider> {
  // private fcl = fcl
  

  constructor() {
    super({
      baseURL: 'adsa',
      responseType: 'text',
      transformResponse: undefined
    })

    // this.fcl.config.put('accessNode.api', network.nodeUrl)
  }

  async generateBlock(numberOfBlocks: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 20000))
  }

  async getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block<any>> {
    return await fcl
      .send([fcl.getBlock(), fcl.atBlockId('b9d1bb0c1e5c9abeb9d78daadaa4b39687a879e99653a7c9227f735e84156cc9')])
      .then(fcl.decode)
  }

  async getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block<any>> {
    return await fcl.send([fcl.getBlock(), fcl.atBlockHeight(45100467)]).then(fcl.decode)
  }

  async getBlockHeight(): Promise<number> {
    const isSealed = false

    const block = await fcl.latestBlock(isSealed)

    return block.height
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
    return await fcl
      .send([fcl.getTransaction('8857086d72147068068b40e4b30f613db7b9275536b0d19460996ef0a5b8d8e0')])
      .then(fcl.decode)
  }

  getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
    throw new Error('Method not implemented.')
  }

  sendRawTransaction(rawTransaction: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
