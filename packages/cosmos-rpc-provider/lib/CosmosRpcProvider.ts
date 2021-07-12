import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Block, Transaction, cosmos } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { normalizeBlock, normalizeTx } from '@liquality/cosmos-utils'
import { StargateClient } from '@cosmjs/stargate'

export default class CosmosRpcProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: CosmosNetwork
  _client: StargateClient

  constructor(network: CosmosNetwork) {
    super({
      baseURL: network.rpcUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this._network = network
  }

  async _initClient() {
    if (!this._client) {
      this._client = await StargateClient.connect(this._network.rpcUrl)
    }
  }

  async generateBlock(numberOfBlocks: number) {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 7250))
  }

  async getBlockByHash(blockHash: string): Promise<Block<cosmos.Tx>> {
    const response: cosmos.RpcResponse = await this.nodeGet(`/block_by_hash?hash=${blockHash}`)

    return normalizeBlock(response.result)
  }

  async getBlockByNumber(blockNumber: number): Promise<Block<cosmos.Tx>> {
    const response: cosmos.RpcResponse = await this.nodeGet(`/block?height=${blockNumber}`)

    return normalizeBlock(response.result)
  }

  async getBlockHeight(): Promise<number> {
    await this._initClient()
    return this._client.getHeight()
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<cosmos.Tx>> {
    const response: cosmos.RpcResponse = await this.nodeGet(`/tx?hash=${txHash}`)
    const blockHeight = parseInt(response.result.height)
    const block = await this.getBlockByNumber(blockHeight)

    return normalizeTx(response.result, block.hash)
  }

  async getBalance(_addresses: string[]): Promise<BigNumber> {
    const addresses = _addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          const userBalance = await this._client.getBalance(address, this._network.token) // atom is hardcoded
          return new BigNumber(userBalance.amount)
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
    await this._initClient()

    const buf = Buffer.from(rawTransaction)
    const txResponse = await this._client.broadcastTx(buf)

    return txResponse.toString()
  }
}
