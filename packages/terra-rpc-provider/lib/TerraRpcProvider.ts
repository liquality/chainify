import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Address, Block, Transaction, terra, FeeProvider } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { TxNotFoundError } from '@liquality/errors'
import { normalizeBlock, normalizeTransaction } from '@liquality/terra-utils'
import { TerraNetwork } from '@liquality/terra-networks'
import { LCDClient } from '@terra-money/terra.js'

export default class TerraRpcProvider extends NodeProvider implements FeeProvider, Partial<ChainProvider> {
  private _network: TerraNetwork
  private _lcdClient: LCDClient
  private _asset: string
  private _tokenAddress: string
  private _feeAsset: string

  constructor(network: TerraNetwork, asset: string, feeAsset: string, tokenAddress?: string) {
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
    this._asset = asset
    this._tokenAddress = tokenAddress
    this._feeAsset = feeAsset
  }

  async generateBlock(numberOfBlocks: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, numberOfBlocks * 20000))
  }

  async getBlockByHash(): Promise<Block> {
    throw new Error('Method not implemented.')
  }

  async getBlockByNumber(
    blockNumber: number,
    includeTx?: boolean
  ): Promise<Block<Transaction<terra.InputTransaction>>> {
    const block = await this._lcdClient.tendermint.blockInfo(blockNumber)

    const parsedBlock = normalizeBlock(block)

    if (!includeTx) {
      return parsedBlock
    }

    const txs = await this._lcdClient.tx.txInfosByHeight(Number(block.block.header.height))

    const transactions = txs.map((tx) => normalizeTransaction(tx, this._asset))

    return {
      ...parsedBlock,
      transactions
    }
  }

  async getBlockHeight(): Promise<number> {
    const {
      block: {
        header: { height }
      }
    } = await this._lcdClient.tendermint.blockInfo()

    return Number(height)
  }

  async getTransactionByHash(txHash: string): Promise<Transaction<terra.InputTransaction>> {
    const transaction = await this._lcdClient.tx.txInfo(txHash)

    if (!transaction) {
      throw new TxNotFoundError(`Transaction not found: ${txHash}`)
    }

    const currentBlock = await this.getBlockHeight()

    return normalizeTransaction(transaction, this._asset, currentBlock)
  }

  async getBalance(_addresses: (string | Address)[]): Promise<BigNumber> {
    const addresses = _addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      addresses.map(async (address) => {
        try {
          let balance = 0

          if (this._tokenAddress) {
            const token = await this._lcdClient.wasm.contractQuery<{ balance: string }>(this._tokenAddress, {
              balance: { address }
            })
            balance = Number(token.balance)
          } else {
            const coins = await this._lcdClient.bank.balance(address)
            balance = Number(coins[0].get(this._asset)?.amount)
          }

          return new BigNumber(balance)
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

  sendRawTransaction(): Promise<string> {
    throw new Error('Method not implemented.')
  }

  async getFees() {
    const prices = await this.nodeGet(this._network.gasPricesUrl)

    return {
      slow: {
        fee: Number(prices[this._feeAsset])
      },
      average: {
        fee: Number(prices[this._feeAsset])
      },
      fast: {
        fee: Number(prices[this._feeAsset])
      }
    }
  }

  async getTaxFees(amount: number, denom = 'uusd'): Promise<any> {
    const taxRate = await this._lcdClient.treasury.taxRate()
    const taxCap = await this._lcdClient.treasury.taxCap(denom)

    const _taxRate = taxRate.toNumber()
    const _taxCap = taxCap.amount.toNumber()

    return Math.min((amount || 0) * _taxRate, _taxCap / 1_000_000)
  }
}
