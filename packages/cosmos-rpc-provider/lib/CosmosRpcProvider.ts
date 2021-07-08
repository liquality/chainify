import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Address, Block, Transaction /* , SendOptions */, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { StargateClient } from '@cosmjs/stargate'

export default class CosmosRpcProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: CosmosNetwork
  _client: StargateClient

  constructor(network: CosmosNetwork) {
    super({
      baseURL: network.rpcUrl,
      responseType: 'json',
      transformResponse: undefined
    })
    this._network = network
  }

  async initClient() {
    if (this._client === undefined) {
      this._client = await StargateClient.connect(this._network.rpcUrl)
    }
  }

  async generateBlock(numberOfBlocks: number) {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 7250))
  }

  getBlockByHash(blockHash: string, includeTx?: boolean): Promise<Block<any>> {
    console.log(blockHash, includeTx) // TODO remove
    this._client.getTx(blockHash)

    return
  }

  getBlockByNumber(blockNumber: number, includeTx?: boolean): Promise<Block<any>> {
    console.log(blockNumber, includeTx) // TODO remove
    throw new Error('Method not implemented.')
  }

  async getBlockHeight(): Promise<number> {
    return this._client.getHeight()
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
    const response = await this.nodeGet(`/tx?hash=${txHash}`)
    const responseObj: cosmos.RpcResponse = JSON.parse(JSON.stringify(response))
    const tx: cosmos.Tx = responseObj.result

    return this.normalizeBlock(tx)
  }

  getBalance(addresses: (string | Address)[]): Promise<BigNumber> {
    console.log(addresses)

    throw new Error('Method not implemented.')
  }

  sendRawTransaction(rawTransaction: string): Promise<string> {
    console.log(rawTransaction)

    throw new Error('Method not implemented.')
  }

  normalizeBlock(tx: cosmos.Tx) {
    const normalizedBlock: Transaction<cosmos.Tx> = {
      hash: tx.hash,
      value: 0, // TODO: set to proper value if possible
      blockHash: '', // TODO: set it when block is implemented
      blockNumber: parseInt(tx.height),
      // confirmations: 0, // cosmos has instant validity
      // feePrice: 0, // TODO:
      // fee: 0, // TODO:
      // secret?: '' // TODO: ...
      _raw: tx
    }

    return normalizedBlock
  }
}
