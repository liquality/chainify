import { flatten } from 'lodash'
import { addressToPubKeyHash } from '../bitcoin/BitcoinUtil'
import { base58 } from '../../crypto'
import networks from '../../networks'

import BitcoinRPCProvider from '../bitcoin/BitcoinRPCProvider'

export default class Bitcore extends BitcoinRPCProvider {
  createScript (address) {
    const type = base58.decode(address).toString('hex').substring(0, 2).toUpperCase()
    const pubKeyHash = addressToPubKeyHash(address)
    if (type === networks.bitcoin_testnet.pubKeyHash) {
      return [
        '76', // OP_DUP
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '88', // OP_EQUALVERIFY
        'ac' // OP_CHECKSIG
      ].join('')
    } else if (type === networks.bitcoin_testnet.scriptHash) {
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

  async calculateFee (numInputs, numOutputs, feePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * feePerByte
  }
  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))

    const _utxos = await this.getUnspentTransactionsForAddresses(addresses)
    const utxos = flatten(_utxos)
    return utxos.reduce((acc, utxo) => acc + (utxo.satoshis), 0)
  }

  async sendTransaction (p2shAddress, value, script) {
    value = value / 1e8
    return this.jsonrpc('sendtoaddress', p2shAddress, value)
  }

  async signMessage (message, address) {
    return new Promise((resolve, reject) => {
      this.jsonrpc('signmessage', address, message).then(result => {
        resolve(Buffer.from(result, 'base64'))
      })
    })
  }

  async splitTransaction (transactionHex, isSegwitSupported) {
    return this._splitTransaction(transactionHex, isSegwitSupported)
  }

  async getNewAddress (from = {}) {
    return this.jsonrpc('getnewaddress')
  }

  async getUnusedAddress (from = {}) {
    return this.getNewAddress()
  }

  async generate (blocks) {
    return this.jsonrpc('generate', blocks)
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

  async isAddressUsed (address) {
    address = String(address)
    const data = await this.getAddressBalance(address)

    return data.received !== 0
  }

  async getAddressBalance (address) {
    return this.jsonrpc('getaddressbalance', { 'addresses': [address] })
  }

  async getUnspentTransactionsForAddresses (addresses) {
    return this.jsonrpc('getaddressutxos', { 'addresses': addresses })
  }

  async getUnspentTransactions (address) {
    return this.jsonrpc('getaddressutxos', { 'addresses': [address] })
  }

  async getAddressUtxos (addresses) {
    return this.jsonrpc('getaddressutxos', { 'addresses': addresses })
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
}
