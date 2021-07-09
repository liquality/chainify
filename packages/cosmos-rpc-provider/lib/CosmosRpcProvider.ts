import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Block, Transaction, cosmos } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { StargateClient } from '@cosmjs/stargate'
import { TxRaw } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'

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

  async getBlockByHash(blockHash: string): Promise<Block<any>> {
    // TODO: check if request is successful
    const response: cosmos.RpcResponse = await this.nodeGet(`/block_by_hash?hash=${blockHash}`)

    return this.normalizeBlock(response.result)
  }

  async getBlockByNumber(blockNumber: number): Promise<Block<any>> {
    // TODO: check if request is successful
    const response: cosmos.RpcResponse = await this.nodeGet(`/block?height=${blockNumber}`)

    return this.normalizeBlock(response.result)
  }

  async getBlockHeight(): Promise<number> {
    await this._initClient()
    return this._client.getHeight()
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<any>> {
    // TODO: check if request is successful
    const response: cosmos.RpcResponse = await this.nodeGet(`/tx?hash=${txHash}`)

    return this.normalizeTx(response.result)
  }

  async getBalance(_addresses: string[]): Promise<BigNumber> {
    const addresses = _addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          const userBalance = await this._client.getBalance(address, 'atom') // atom is hardcoded
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

    const rtx = TxRaw.fromJSON(rawTransaction)
    const txRawBytes = TxRaw.encode(rtx).finish()
    const txResponse = await this._client.broadcastTx(txRawBytes)

    return txResponse.toString()
  }

  // TODO: move to utils
  normalizeBlock(blockResponse: cosmos.BlockResponse) {
    const normalizedBlock: Block<cosmos.Tx> = {
      number: blockResponse.block.header.height,
      hash: blockResponse.block_id.hash,
      timestamp: new Date(blockResponse.block.header.time).getTime() / 1000,
      size: 0, // size is unknown
      parentHash: blockResponse.block.header.last_block_id.hash
      // difficulty?: number;
      // nonce?: number;
      // transactions?: cosmos.Tx[] // TODO: parse utf8 encoded strings
    }

    return normalizedBlock
  }

  // TODO: move to utils
  async normalizeTx(tx: cosmos.Tx) {
    const blockHeight = parseInt(tx.height)
    const block = await this.getBlockByNumber(blockHeight)

    const normalizedTx: Transaction<cosmos.Tx> = {
      hash: tx.hash,
      value: 0, // TODO: set to proper value if possible
      blockHash: block.hash,
      blockNumber: blockHeight,
      confirmations: 0, // cosmos has instant validity
      feePrice: 0, // TODO: ...
      fee: 0, // TODO: ...
      secret: '', // TODO: ...
      _raw: tx
    }

    return normalizedTx
  }
}
