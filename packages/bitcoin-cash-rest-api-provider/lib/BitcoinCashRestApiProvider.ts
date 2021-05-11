import { NodeProvider } from '@liquality/node-provider'
import { addressToString } from '@liquality/utils'
import { decodeRawTransaction, normalizeTransactionObject } from '@liquality/bitcoin-utils'
import { TxNotFoundError, BlockNotFoundError } from '@liquality/errors'
import { ChainProvider, Address, bitcoin, BigNumber } from '@liquality/types'
import { BitcoinCashNetwork } from '@liquality/bitcoin-networks'
import { sha256 } from '@liquality/crypto'

export interface RestApiProviderOptions {
  url: string
  network: BitcoinCashNetwork
  // Default 1
  numberOfBlockConfirmation?: number
  // Default 1
  defaultFeePerByte?: number
}

export default class BitcoinCashRestApiProvider extends NodeProvider implements Partial<ChainProvider> {
  _network: BitcoinCashNetwork
  _numberOfBlockConfirmation: number
  _defaultFeePerByte: number
  _usedAddressCache: { [index: string]: boolean }

  constructor(options: RestApiProviderOptions) {
    const { url, network, numberOfBlockConfirmation = 1, defaultFeePerByte = 1 } = options
    super({
      // URLs https://github.com/Permissionless-Software-Foundation/bch-js#quick-notes
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })

    this._network = network
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte
    this._usedAddressCache = {}
  }

  async getFeePerByte() {
    // BCH fees are fairly stable
    return this._defaultFeePerByte
  }

  async getMinRelayFee() {
    return 1
  }

  async getBalance(_addresses: (string | Address)[]) {
    const addresses = _addresses.map(addressToString)
    const response = (await this.nodePost('electrumx/balance', { addresses }))['balances']

    return response.reduce(
      (acc: BigNumber, balance: any) =>
        acc.plus(balance['balance']['confirmed']).plus(balance['balance']['unconfirmed']),
      new BigNumber(0)
    )
  }

  async getUnspentTransactions(_addresses: (Address | string)[]): Promise<bitcoin.UTXO[]> {
    const addresses = _addresses.map(addressToString)
    const utxosReceived = (await this.nodePost('electrumx/utxos', { addresses }))['utxos']
    const utxos = []
    for (const utxoGroup of utxosReceived) {
      const address = utxoGroup['address']
      for (const utxo of utxoGroup['utxos']) {
        utxos.push({
          address,
          txid: utxo['tx_hash'],
          vout: utxo['tx_pos'],
          value: utxo['value'],
          blockHeight: utxo['height']
        })
      }
    }
    return utxos
  }

  async getAddressTransactionCounts(_addresses: (Address | string)[]) {
    const addresses = _addresses.map(addressToString)
    const transactionCountsArray = []
    const transactionsResponse = (await this.nodePost('electrumx/transactions', { addresses }))['transactions']
    for (const transactions of transactionsResponse) {
      const addr = transactions['address']
      transactionCountsArray.push({ [addr]: transactions['transactions'].length })
    }
    const transactionCounts = Object.assign({}, ...transactionCountsArray)
    return transactionCounts
  }

  async getTransactionHex(transactionHash: string): Promise<string> {
    return await this.nodeGet('rawtransactions/getRawTransaction/' + transactionHash)
  }

  async getTransaction(transactionHash: string) {
    const currentHeight = await this.getBlockHeight()

    const rawTx = await this.nodeGet('rawtransactions/getRawTransaction/' + transactionHash + '?verbose=true')
    const status: bitcoin.explorer.TxStatus = { confirmed: rawTx['confirmations'] > 0 }
    if (status.confirmed) {
      status.block_height = currentHeight - rawTx['confirmations'] + 1
      status.block_hash = await this.getBlockHash(status.block_height)
    }

    const tx: bitcoin.explorer.Transaction = {
      txid: rawTx['txid'],
      version: rawTx['version'],
      locktime: rawTx['locktime'],
      vin: rawTx['vin'],
      fee: 0, // TODO
      vout: rawTx['vout'],
      size: rawTx['size'],
      weight: 4 * rawTx['size'],
      status
    }
    return this.formatTransaction(tx, currentHeight, rawTx['hex'])
  }

  async formatTransaction(tx: bitcoin.explorer.Transaction, currentHeight: number, hex?: string) {
    try {
      if (!hex) hex = await this.getTransactionHex(tx.txid)
    } catch (e) {
      const { name, message, ...attrs } = e
      throw new TxNotFoundError(`Transaction not found: ${tx.txid}`, attrs)
    }
    const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0
    const decodedTx = decodeRawTransaction(hex, this._network)
    decodedTx.confirmations = confirmations
    return normalizeTransactionObject(decodedTx, tx.fee, { hash: tx.status.block_hash, number: tx.status.block_height })
  }

  async getBlockByHash(blockHash: string) {
    let data

    try {
      data = await this.nodeGet('blockchain/getblock', { blockHash, verbosity: 1 })
    } catch (e) {
      const { name, message, ...attrs } = e
      throw new BlockNotFoundError(`Block not found: ${blockHash}`, attrs)
    }

    const {
      hash,
      height: number,
      time: timestamp,
      mediantime,
      size,
      previousblockhash: parentHash,
      difficulty,
      nonce
    } = data

    return {
      hash,
      number,
      timestamp: mediantime || timestamp,
      size,
      parentHash,
      difficulty,
      nonce
    }
  }

  async getBlockHash(blockNumber: number): Promise<string> {
    const header = (await this.nodeGet('electrumx/block/headers/' + blockNumber + '?count=1'))['headers'][0]
    const hash = Buffer.from(sha256(Buffer.from(sha256(Buffer.from(header, 'hex')), 'hex')), 'hex')
    return hash.reverse().toString('hex')
  }

  async getBlockByNumber(blockNumber: number) {
    return this.getBlockByHash(await this.getBlockHash(blockNumber))
  }

  async getBlockHeight(): Promise<number> {
    const data = await this.nodeGet('blockchain/getBlockCount')
    return parseInt(data) - 1
  }

  async getTransactionByHash(transactionHash: string) {
    return this.getTransaction(transactionHash)
  }

  async getRawTransactionByHash(transactionHash: string) {
    return this.getTransactionHex(transactionHash)
  }

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    return await this.nodeGet('rawtransactions/sendRawTransaction/' + rawTransaction)
  }
}
