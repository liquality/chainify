import { flatten } from 'lodash'
import JsonRpcProvider from '../JsonRpcProvider'
import { addressToPubKeyHash, compressPubKey, pubKeyToAddress, reverseBuffer } from './BitcoinUtil'
import { sha256, padHexStart, base58 } from '../../crypto'

export default class BitcoinRPCProvider extends JsonRpcProvider {
  async decodeRawTransaction (rawTransaction) {
    const data = await this.jsonrpc('decoderawtransaction', rawTransaction)
    const { hash: txHash, txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)

    const output = { hash, value, _raw: { hex: rawTransaction, data, txHash } }

    return output
  }

  async isAddressUsed (address) {
    address = String(address)
    const utxo = await this.getUnspentTransactions(address)

    return utxo.length !== 0
  }

  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))

    const _utxos = await this.getUnspentTransactionsForAddresses(addresses)
    const utxos = flatten(_utxos)
    return utxos.reduce((acc, utxo) => acc + (utxo.amount * 1e8), 0)
  }

  async getUnspentTransactionsForAddresses (addresses) {
    return this.jsonrpc('listunspent', 0, 9999999, addresses)
  }

  async getUnspentTransactions (address) {
    return this.jsonrpc('listunspent', 0, 9999999, [ address ])
  }

  async getTransactionHex (transactionHash) {
    return (await this.jsonrpc('gettransaction', transactionHash)).hex
  }

  async generateBlock (numberOfBlocks) {
    return this.jsonrpc('generate', numberOfBlocks)
  }

  async getBlockByHash (blockHash, includeTx) {
    const data = await this.jsonrpc('getblock', blockHash)
    const {
      hash,
      height: number,
      time: timestamp,
      difficulty,
      size,
      previousblockhash: parentHash,
      nonce,
      confirmations
    } = data
    let { tx: transactions } = data

    if (includeTx) {
      const txs = transactions.map(this.getMethod('getRawTransactionByHash'))
      transactions = await Promise.all(txs)
    }

    return {
      hash,
      number,
      timestamp,
      difficulty,
      size,
      parentHash,
      nonce,
      transactions,
      confirmations
    }
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this.getBlockByHash(await this.jsonrpc('getblockhash', blockNumber), includeTx)
  }

  async getBlockHeight () {
    return this.jsonrpc('getblockcount')
  }

  async getTransactionByHash (transactionHash) {
    const rawTx = await this.getRawTransactionByHash(transactionHash)
    const tx = await this.decodeRawTransaction(rawTx)
    try {
      const data = await this.jsonrpc('gettransaction', transactionHash)
      const { confirmations } = data
      const output = Object.assign({}, tx, { confirmations })

      if (confirmations > 0) {
        const { blockhash: blockHash } = data
        const { number: blockNumber } = await this.getBlockByHash(blockHash)
        Object.assign(output, { blockHash, blockNumber })
      }

      return output
    } catch (e) {
      const output = Object.assign({}, tx)

      return output
    }
  }

  async getRawTransactionByHash (transactionHash) {
    return this.jsonrpc('getrawtransaction', transactionHash)
  }

  async sendRawTransaction (rawTransaction) {
    return this.jsonrpc('sendrawtransaction', rawTransaction)
  }

  createScript (address) {
    const type = base58.decode(address).toString('hex').substring(0, 2).toUpperCase()
    const pubKeyHash = addressToPubKeyHash(address)
     if (type === this._network.pubKeyHash) {
      return [
        '76', // OP_DUP
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '88', // OP_EQUALVERIFY
        'ac' // OP_CHECKSIG
      ].join('')
    } else if (type === this._network.scriptHash) {
      return [
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '87' // OP_EQUAL
      ].join('')
    } else {
      throw new Error('Not a valid address:', address)
    }
  }
}
