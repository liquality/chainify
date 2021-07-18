import { NodeProvider as NodeProvider } from '@liquality/node-provider'
import { BigNumber, ChainProvider, Address, Block, Transaction, terra } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { TxNotFoundError } from '@liquality/errors'
import { normalizeBlock, normalizeTransaction } from '@liquality/terra-utils'
import { TerraNetwork } from '@liquality/terra-networks'
import { BlockTxBroadcastResult, LCDClient, MnemonicKey, StdTx, Wallet, Msg } from '@terra-money/terra.js'

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

    const transactions = txs.map((tx) => normalizeTransaction(tx, this._network.asset))

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

    return normalizeTransaction(transaction, this._network.asset)
  }

  async getBalance(_addresses: (string | Address)[]): Promise<BigNumber> {
    const addresses = _addresses.map(addressToString)

    const promiseBalances = await Promise.all(
      addresses.map(async (address) => {
        try {
          const balance = await this._lcdClient.bank.balance(address)
          const val = Number(balance.get(this._network.asset)?.amount) || 0

          return new BigNumber(val)
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

  _createWallet(mnemonicKey: MnemonicKey): Wallet {
    return this._lcdClient.wallet(mnemonicKey)
  }

  async _broadcastTx(tx: StdTx): Promise<BlockTxBroadcastResult> {
    return await this._lcdClient.tx.broadcast(tx)
  }

  async _estimateFee(payer: string, msgs: Msg[]): Promise<number> {
    const fee = await this._lcdClient.tx.estimateFee(payer, msgs)

    return Number(fee.amount.get(this._network.asset).amount)
  }

  async _getTransactionsForAddress(address: Address | string): Promise<any[]> {
    const url = `${this._network.helperUrl}/txs?account=${addressToString(address)}&limit=500&action=contract`

    const response = await this.nodeGet(url)

    if (!response?.txs) {
      throw new TxNotFoundError(`Transactions not found: ${address}`)
    }

    return response.txs
  }
}
