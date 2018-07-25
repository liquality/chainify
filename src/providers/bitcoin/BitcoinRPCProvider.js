import axios from 'axios'

import { prepareRequest, praseResponse } from '../JsonRpcHelper'

export default class BitcoinRPCProvider {
  constructor (uri, user, pass) {
    this.axios = axios.create({
      baseURL: uri,
      transformRequest: [({ data }, headers) => prepareRequest(data)],
      transformResponse: [(data, headers) => praseResponse(data, headers)],
      validateStatus: (status) => status === 200
    })

    if (user || pass) {
      this.axios.defaults.auth = {
        username: user,
        password: pass
      }
    }
  }

  _rpc (method, ...params) {
    return this.axios.post('/', {
      data: { method, params }
    }).then(({ data }) => data)
  }

  async _decodeRawTransaction (rawTransaction) {
    const data = await this._rpc('decoderawtransaction', rawTransaction)
    const { hash: txHash, txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)

    const output = { hash, value, _raw: { hex: rawTransaction, data, txHash } }

    return output
  }

  async generateBlock (numberOfBlocks) {
    return this._rpc('generate', numberOfBlocks)
  }

  async getBlockByHash (blockHash, includeTx) {
    blockHash = typeof blockHash === 'string' ? blockHash : blockHash.toString(16)

    const data = await this._rpc('getblock', blockHash)
    const { hash,
      height: number,
      time: timestamp,
      difficulty,
      size,
      previousblockhash: parentHash,
      nonce,
      confirmations } = data
    let { tx: transactions } = data

    if (includeTx) {
      const txs = transactions.map(this.getTransactionByHash)
      transactions = await Promise.all(txs)
    }

    return { hash,
      number,
      timestamp,
      difficulty,
      size,
      parentHash,
      nonce,
      transactions,
      confirmations }
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this.getBlockByHash(await this._rpc('getblockhash', blockNumber), includeTx)
  }

  async getTransactionByHash (transactionHash) {
    transactionHash = typeof transactionHash === 'string' ? transactionHash : transactionHash.toString(16)

    const rawTx = await this.getRawTransactionByHash(transactionHash)
    const tx = await this._decodeRawTransaction(rawTx)
    const data = await this._rpc('gettransaction', transactionHash)

    const { confirmations } = data
    Object.assign(tx, { confirmations })

    if (confirmations > 0) {
      const { blockhash: blockHash } = data
      const { number: blockNumber } = await this.getBlockByHash(blockHash)
      Object.assign(tx, { blockHash, blockNumber })
    }

    return tx
  }

  async getRawTransactionByHash (transactionHash) {
    transactionHash = typeof transactionHash === 'string' ? transactionHash : transactionHash.toString(16)

    return this._rpc('getrawtransaction', transactionHash)
  }
}
