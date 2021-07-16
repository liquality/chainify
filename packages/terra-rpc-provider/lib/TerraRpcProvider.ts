import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Address, Block, Transaction, SendOptions } from '@liquality/types'
import { TerraNetwork } from '@liquality/terra-network'
import { LCDClient } from '@terra-money/terra.js'

export default class TerraRpcProvider extends NodeProvider implements Partial<ChainProvider> {
  private _network: TerraNetwork
  private _lcdClient: LCDClient

  constructor(network: TerraNetwork) {
    super({
      baseURL: network.helperUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this._lcdClient = new LCDClient({
      URL: network.nodeUrl,
      chainID: network.chainID
    })
    this._network = network
  }

  async generateBlock(numberOfBlocks: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 20000))
  }

  async getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block<any>> {
    throw new Error('Method not implemented.')
  }

  // Add type of Block
  async getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<any> {
    return await this._lcdClient.tendermint.blockInfo(blockNumber)
  }

  getBlockHeight(): Promise<number> {
    throw new Error('Method not implemented.')
  }
  getTransactionByHash(txHash: string): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
    throw new Error('Method not implemented.')
  }
  sendTransaction(options: SendOptions): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  sendSweepTransaction(address: string | Address, fee?: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  updateTransactionFee(tx: string | Transaction<any>, newFee: number): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  sendBatchTransaction(transactions: SendOptions[]): Promise<Transaction<any>> {
    throw new Error('Method not implemented.')
  }
  sendRawTransaction(rawTransaction: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
}
