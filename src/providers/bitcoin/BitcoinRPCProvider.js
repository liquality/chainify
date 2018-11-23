import { flatten } from 'lodash'
import BigNumber from 'bignumber.js'
import JsonRpcProvider from '../JsonRpcProvider'

export default class BitcoinRPCProvider extends JsonRpcProvider {
  async signMessage (message, address) {
    return new Promise((resolve, reject) => {
      this.jsonrpc('signmessage', address, message).then(result => {
        resolve(Buffer.from(result, 'base64'))
      })
    })
  }

  async sendTransaction (address, value, script) {
    value = BigNumber(value).divideBy(1e8).toNumber()
    return this.jsonrpc('sendtoaddress', address, value)
  }

  async dumpPrivKey (address) {
    return this.jsonrpc('dumpprivkey', address)
  }

  async signRawTransaction (hexstring, prevtxs, privatekeys, sighashtype) {
    return this.jsonrpc('signrawtransaction', hexstring, prevtxs, privatekeys)
  }

  async createRawTransaction (transactions, outputs) {
    return this.jsonrpc('createrawtransaction', transactions, outputs)
  }

  async decodeRawTransaction (rawTransaction) {
    const data = await this.jsonrpc('decoderawtransaction', rawTransaction)
    const { hash: txHash, txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)

    const output = { hash, value, _raw: { hex: rawTransaction, data, txHash } }

    return output
  }

  async isAddressUsed (address) {
    address = String(address)
    const amountReceived = await this.getReceivedByAddress(address)

    return amountReceived > 0
  }

  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))

    const _utxos = await this.getUnspentTransactionsForAddresses(addresses)
    const utxos = flatten(_utxos)
    return utxos.reduce((acc, utxo) => acc + utxo.satoshis, 0)
  }

  async getListUnspent (addresses) {
    const utxos = await this.jsonrpc('listunspent', 0, 9999999, addresses)
    return utxos.map(utxo => ({ ...utxo, satoshis: BigNumber(utxo.amount).times(1e8).toNumber() }))
  }

  async getUnspentTransactionsForAddresses (addresses) {
    return this.getListUnspent(addresses)
  }

  async getUnspentTransactions (address) {
    return this.getListUnspent([address])
  }

  async getReceivedByAddress (address) {
    return this.jsonrpc('getreceivedbyaddress', address)
  }

  async getTransactionHex (transactionHash) {
    return this.jsonrpc('getrawtransaction', transactionHash)
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
      const txs = transactions.map(this.getMethod('getTransactionByHash'))
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
}
