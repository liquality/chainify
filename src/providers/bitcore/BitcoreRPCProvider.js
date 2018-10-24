import { flatten } from 'lodash'
import BitcoinRPCProvider from '../bitcoin/BitcoinRPCProvider'

export default class Bitcore extends BitcoinRPCProvider {
  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))

    const _utxos = await this.getUnspentTransactionsForAddresses(addresses)
    const utxos = flatten(_utxos)
    return utxos.reduce((acc, utxo) => acc + (utxo.satoshis), 0)
  }

  async getUnspentTransactionsForAddresses (addresses) {
    return this.jsonrpc('getaddressutxos', {'ddresses': addresses})
  }

  async getUnspentTransactions (address) {
    return this.jsonrpc('getaddressutxos', {'addresses': [address]})
  }

  async getAddressUtxos (addresses) {
    return this.jsonrpc('getaddressutxos', {'addresses': addresses})
  }

  async getTransactionHex (transactionHash) {
    return this.jsonrpc('getrawtransaction', transactionHash)
  }

  async decodeRawTransaction (rawTransaction) {
    const data = await this.jsonrpc('decoderawtransaction', rawTransaction)
    const { hash: txHash, txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)
    const output = { hash, value, _raw: { hex: rawTransaction, data, txHash } }
    return output
  }

  async getTransactionByHash (transactionHash) {
    const rawTx = await this.getRawTransactionByHash(transactionHash)
    const tx = await this.decodeRawTransaction(rawTx)
    try {
      const data = await this.jsonrpc('getrawtransaction', transactionHash, 1)
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
}
