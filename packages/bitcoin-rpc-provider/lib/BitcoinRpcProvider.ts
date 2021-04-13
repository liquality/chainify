import JsonRpcProvider from '@liquality/jsonrpc-provider'
import { addressToString } from '@liquality/utils'
import { normalizeTransactionObject, decodeRawTransaction } from '@liquality/bitcoin-utils'
import { TxNotFoundError, BlockNotFoundError } from '@liquality/errors'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'
import { bitcoin, Transaction, Block, ChainProvider, SendOptions, Address, BigNumber } from '@liquality/types'

import { flatten } from 'lodash'

interface ProviderOptions {
  // RPC URI
  uri: string
  // Authentication username
  username?: string
  // Authentication password
  password?: string
  // Bitcoin network
  network: BitcoinNetwork
  // Number of block confirmations to target for fee. Defaul: 1
  feeBlockConfirmations?: number
  // Default fee per byte for transactions. Default: 3
  defaultFeePerByte?: number
}

export default class BitcoinRpcProvider extends JsonRpcProvider implements Partial<ChainProvider> {
  _feeBlockConfirmations: number
  _defaultFeePerByte: number
  _network: BitcoinNetwork
  _usedAddressCache: { [key: string]: boolean }

  constructor(options: ProviderOptions) {
    const { uri, username, password, network, feeBlockConfirmations = 1, defaultFeePerByte = 3 } = options
    super(uri, username, password)
    this._network = network
    this._feeBlockConfirmations = feeBlockConfirmations
    this._defaultFeePerByte = defaultFeePerByte
    this._usedAddressCache = {}
  }

  async decodeRawTransaction(rawTransaction: string): Promise<bitcoin.Transaction> {
    return this.jsonrpc('decoderawtransaction', rawTransaction)
  }

  async getFeePerByte(numberOfBlocks = this._feeBlockConfirmations) {
    try {
      const { feerate } = await this.jsonrpc('estimatesmartfee', numberOfBlocks)

      if (feerate && feerate > 0) {
        return Math.ceil((feerate * 1e8) / 1000)
      }

      throw new Error('Invalid estimated fee')
    } catch (e) {
      return this._defaultFeePerByte
    }
  }

  async getMinRelayFee() {
    const { relayfee } = await this.jsonrpc('getnetworkinfo')
    return (relayfee * 1e8) / 1000
  }

  async getBalance(_addresses: (string | Address)[]) {
    const addresses = _addresses.map(addressToString)
    const _utxos = await this.getUnspentTransactions(addresses)
    const utxos = flatten(_utxos)

    return utxos.reduce((acc, utxo) => acc.plus(utxo.value), new BigNumber(0))
  }

  async getUnspentTransactions(_addresses: (Address | string)[]): Promise<bitcoin.UTXO[]> {
    const addresses = _addresses.map(addressToString)
    const utxos: bitcoin.rpc.UTXO[] = await this.jsonrpc('listunspent', 0, 9999999, addresses)
    return utxos.map((utxo) => ({ ...utxo, value: new BigNumber(utxo.amount).times(1e8).toNumber() }))
  }

  async getAddressTransactionCounts(_addresses: (Address | string)[]) {
    const addresses = _addresses.map(addressToString)
    const receivedAddresses: bitcoin.rpc.ReceivedByAddress[] = await this.jsonrpc(
      'listreceivedbyaddress',
      0,
      false,
      true
    )
    return addresses.reduce((acc: bitcoin.AddressTxCounts, addr) => {
      const receivedAddress = receivedAddresses.find((receivedAddress) => receivedAddress.address === addr)
      const transactionCount = receivedAddress ? receivedAddress.txids.length : 0
      acc[addr] = transactionCount
      return acc
    }, {})
  }

  async getReceivedByAddress(address: string): Promise<number> {
    return this.jsonrpc('getreceivedbyaddress', address)
  }

  async importAddresses(addresses: string[]) {
    const request = addresses.map((address) => ({ scriptPubKey: { address }, timestamp: 0 }))
    return this.jsonrpc('importmulti', request)
  }

  async getTransactionHex(transactionHash: string): Promise<string> {
    return this.jsonrpc('getrawtransaction', transactionHash)
  }

  async generateBlock(numberOfBlocks: number) {
    const miningAddressLabel = 'miningAddress'
    let address
    try {
      // Avoid creating 100s of addresses for mining
      const labelAddresses = await this.jsonrpc('getaddressesbylabel', miningAddressLabel)
      address = Object.keys(labelAddresses)[0]
    } catch (e) {
      // Label does not exist
      address = await this.jsonrpc('getnewaddress', miningAddressLabel)
    }
    return this.jsonrpc('generatetoaddress', numberOfBlocks, address)
  }

  async getBlockByHash(blockHash: string, includeTx = false): Promise<Block> {
    let data: bitcoin.rpc.Block

    try {
      data = await this.jsonrpc('getblock', blockHash) // TODO: This doesn't fit the interface?: https://chainquery.com/bitcoin-cli/getblock
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('Block not found')) {
        const { name, message, ...attrs } = e
        throw new BlockNotFoundError(`Block not found: ${blockHash}`, attrs)
      }

      throw e
    }

    const {
      hash,
      height: number,
      mediantime: timestamp,
      difficulty,
      size,
      previousblockhash: parentHash,
      nonce,
      tx: transactionHashes
    } = data

    let transactions: any[] = transactionHashes
    // TODO: Why transactions need to be retrieved individually? getblock has verbose 2 https://chainquery.com/bitcoin-cli/getblock
    if (includeTx) {
      const txs = transactionHashes.map((hash) => this.getTransactionByHash(hash))
      transactions = await Promise.all(txs)
    }

    return {
      hash,
      number,
      timestamp,
      difficulty: parseFloat(new BigNumber(difficulty).toFixed()),
      size,
      parentHash,
      nonce,
      transactions
    }
  }

  async getBlockByNumber(blockNumber: number, includeTx = false) {
    let blockHash

    try {
      blockHash = await this.jsonrpc('getblockhash', blockNumber)
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('Block height out of range')) {
        const { name, message, ...attrs } = e
        throw new BlockNotFoundError(`Block not found: ${blockNumber}`, attrs)
      }

      throw e
    }

    return this.getBlockByHash(blockHash, includeTx)
  }

  async getBlockHeight() {
    return this.jsonrpc('getblockcount')
  }

  async getTransactionByHash(transactionHash: string) {
    try {
      const tx = await this.getParsedTransactionByHash(transactionHash, true)
      return tx
    } catch (e) {
      if (e.name === 'NodeError' && e.message.includes('No such mempool transaction')) {
        const { name, message, ...attrs } = e
        throw new TxNotFoundError(`Transaction not found: ${transactionHash}`, attrs)
      }

      throw e
    }
  }

  async getTransactionFee(tx: bitcoin.Transaction) {
    const isCoinbaseTx = tx.vin.find((vin) => vin.coinbase)
    if (isCoinbaseTx) return // Coinbase transactions do not have a fee

    const inputs = tx.vin.map((vin) => ({ txid: vin.txid, vout: vin.vout }))
    const inputTransactions = await Promise.all(inputs.map((input) => this.jsonrpc('getrawtransaction', input.txid, 1)))

    const inputValues = inputTransactions.map((inputTx, index) => {
      const vout = inputs[index].vout
      const output = inputTx.vout[vout]
      return output.value * 1e8
    })
    const inputValue = inputValues.reduce((a, b) => a.plus(new BigNumber(b)), new BigNumber(0))
    const outputValue = tx.vout.reduce(
      (a, b) => a.plus(new BigNumber(b.value).times(new BigNumber(1e8))),
      new BigNumber(0)
    )
    const feeValue = inputValue.minus(outputValue)
    return feeValue.toNumber()
  }

  async getParsedTransactionByHash(
    transactionHash: string,
    addFees = false
  ): Promise<Transaction<bitcoin.Transaction>> {
    const tx: bitcoin.rpc.MinedTransaction = await this.jsonrpc('getrawtransaction', transactionHash, 1)
    return normalizeTransactionObject(
      tx,
      addFees ? await this.getTransactionFee(tx) : undefined,
      tx.confirmations > 0 ? await this.getBlockByHash(tx.blockhash) : undefined
    )
  }

  async getRawTransactionByHash(transactionHash: string) {
    const tx: string = await this.jsonrpc('getrawtransaction', transactionHash, 0)
    return tx
  }

  async sendRawTransaction(rawTransaction: string): Promise<string> {
    return this.jsonrpc('sendrawtransaction', rawTransaction)
  }

  async sendBatchTransaction(transactions: SendOptions[]) {
    const outputs: { [index: string]: number } = {}
    for (const tx of transactions) {
      outputs[addressToString(tx.to)] = new BigNumber(tx.value).dividedBy(1e8).toNumber()
    }
    const rawTxOutputs = await this.createRawTransaction([], outputs)
    const rawTxFunded = await this.fundRawTransaction(rawTxOutputs)
    const rawTxSigned = await this.signRawTransaction(rawTxFunded.hex)
    const fee = new BigNumber(rawTxFunded.fee).times(1e8).toNumber()
    await this.sendRawTransaction(rawTxSigned.hex)
    return normalizeTransactionObject(decodeRawTransaction(rawTxSigned.hex, this._network), fee)
  }

  async signRawTransaction(hexstring: string) {
    return this.jsonrpc('signrawtransactionwithwallet', hexstring)
  }

  async createRawTransaction(transactions: [], outputs: { [index: string]: number }): Promise<string> {
    return this.jsonrpc('createrawtransaction', transactions, outputs)
  }

  async fundRawTransaction(hexstring: string): Promise<bitcoin.rpc.FundRawResponse> {
    return this.jsonrpc('fundrawtransaction', hexstring)
  }
}
