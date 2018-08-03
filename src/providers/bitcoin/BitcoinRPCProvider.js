import JsonRpcProvider from '../JsonRpcProvider'

export default class BitcoinRPCProvider extends JsonRpcProvider {
  async _decodeRawTransaction (rawTransaction) {
    const data = await this.rpc('decoderawtransaction', rawTransaction)
    const { hash: txHash, txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)

    const output = { hash, value, _raw: { hex: rawTransaction, data, txHash } }

    return output
  }

  async generateBlock (numberOfBlocks) {
    return this.rpc('generate', numberOfBlocks)
  }

  async getBlockByHash (blockHash, includeTx) {
    const data = await this.rpc('getblock', blockHash)
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
    return this.getBlockByHash(await this.rpc('getblockhash', blockNumber), includeTx)
  }

  async getTransactionByHash (transactionHash) {
    const rawTx = await this.getRawTransactionByHash(transactionHash)
    const tx = await this._decodeRawTransaction(rawTx)
    const data = await this.rpc('gettransaction', transactionHash)

    const { confirmations } = data
    const output = Object.assign({}, tx, { confirmations })

    if (confirmations > 0) {
      const { blockhash: blockHash } = data
      const { number: blockNumber } = await this.getBlockByHash(blockHash)
      Object.assign(output, { blockHash, blockNumber })
    }

    return output
  }

  async getRawTransactionByHash (transactionHash) {
    return this.rpc('getrawtransaction', transactionHash)
  }
}
