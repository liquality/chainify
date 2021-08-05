import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Block, Transaction, FeeProvider, FeeDetails, cosmos } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import {
  normalizeBlock,
  normalizeTx,
  getTxHash,
  coinToNumber,
  getValueFromLogs,
  validateAddress
} from '@liquality/cosmos-utils'
import { StargateClient, Coin } from '@cosmjs/stargate'
import { fromBase64 } from '@cosmjs/encoding'
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'

export default class CosmosRpcProvider extends NodeProvider implements Partial<ChainProvider>, FeeProvider {
  _network: CosmosNetwork
  private _client: StargateClient
  private _queriesProvider: NodeProvider

  constructor(network: CosmosNetwork) {
    super({
      baseURL: network.rpcUrl,
      responseType: 'text',
      transformResponse: undefined
    })
    this._network = network
    this._queriesProvider = new NodeProvider({
      baseURL: network.apiUrl,
      responseType: 'text',
      transformResponse: undefined
    })
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
    const response: cosmos.RpcResponse = await this.nodeGet(`/block_by_hash?hash=${validateAddress(blockHash)}`)

    return this.parseBlock(response.result)
  }

  async getBlockByNumber(blockNumber: number): Promise<Block<cosmos.Tx>> {
    const response: cosmos.RpcResponse = await this.nodeGet(`/block?height=${blockNumber}`)

    return this.parseBlock(response.result)
  }

  async getBlockHeight(): Promise<number> {
    await this._initClient()
    return this._client.getHeight()
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<cosmos.Tx>> {
    const response: cosmos.RpcResponse = await this.nodeGet(`/tx?hash=${validateAddress(txHash)}`)
    const tx = response.result
    const blockHeight = parseInt(tx.height)
    const block = await this.getBlockByNumber(blockHeight)
    const currentHeight = await this.getBlockHeight()
    const confirmations = currentHeight - block.number

    // calculate feePrice and fee in NON minimal denomination
    const gasWanted = parseInt(tx.tx_result.gas_wanted)
    const txDecoded = Tx.decode(fromBase64(tx.tx))
    const fee = coinToNumber(txDecoded.authInfo.fee.amount[0], Math.pow(10, this._network.defaultCurrency.coinDecimals))
    const feePrice = fee / gasWanted

    const { transferredValue, completionTime } = getValueFromLogs(tx.tx_result.log, this._network)

    const options = {
      value: transferredValue,
      blockHash: block.hash,
      blockNumber: blockHeight,
      confirmations,
      feePrice,
      fee
    } as cosmos.NormalizeTxOptions

    return normalizeTx({ ...tx, completionTime }, options)
  }

  async getBalance(_addresses: string[]): Promise<BigNumber> {
    await this._initClient()
    const addresses = _addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      addresses.map(async (address: string) => {
        try {
          const userBalance = await this._client.getBalance(address, this._network.defaultCurrency.coinMinimalDenom)
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

    const buf = fromBase64(rawTransaction)
    const txResponse = await this._client.broadcastTx(buf)

    return txResponse.toString()
  }

  async getDelegatedAmount(delegatorAddr: string, validatorAddr: string): Promise<Coin | null> {
    let response: cosmos.DelegationResponse
    try {
      response = await this._queriesProvider.nodeGet(
        `/cosmos/staking/v1beta1/validators/${validatorAddr}/delegations/${delegatorAddr}`
      )
    } catch (err) {
      if (err.message) {
        null
      }
      throw err
    }

    return response.delegation_response.balance
  }

  async getReward(delegatorAddr: string, validatorAddr: string): Promise<Coin[] | null> {
    let response: { rewards: Coin[] }
    try {
      response = await this._queriesProvider.nodeGet(
        `/cosmos/distribution/v1beta1/delegators/${delegatorAddr}/rewards/${validatorAddr}`
      )
    } catch (err) {
      if (err.message) {
        return null
      }
      throw err
    }

    return response.rewards
  }

  async getFees(): Promise<FeeDetails> {
    const fee = this._network.minimalGasPrice
    return {
      slow: {
        fee
      },
      average: {
        fee
      },
      fast: {
        fee
      }
    }
  }

  async parseBlock(block: cosmos.BlockResponse): Promise<Block<cosmos.Tx>> {
    const promiseTxs = await Promise.all(
      block.block.data.txs.map(async (tx: string) => {
        try {
          const txHash = await getTxHash(tx)
          const response: cosmos.RpcResponse = await this.nodeGet(`/tx?hash=${validateAddress(txHash)}`)
          return response.result
        } catch (err) {
          if (err.message) {
            return null
          }
          throw err
        }
      })
    )

    return normalizeBlock(
      block,
      promiseTxs.map((tx) => tx)
    )
  }
}
