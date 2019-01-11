import BitcoinRPCProvider from './BitcoinRPCProvider'
import { base58 } from '../../crypto'
import { addressToPubKeyHash } from '../bitcoin/BitcoinUtil'
import networks from './networks'

/**
 * BitcoreRPCProvider overrides the BitcoinRPCProvider to use the address index
 * for retrieving address utxos
 */
export default class BitcoreRPCProvider extends BitcoinRPCProvider {
  /* These methods need to be removed, but are required for now */
  calculateFee (numInputs, numOutputs, feePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * feePerByte
  }

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
  /* These methods need to be removed, but are required for now - END */

  async isAddressUsed (address) {
    address = String(address)
    const data = await this.getAddressBalance(address)

    return data.received !== 0
  }

  async getAddressBalances (addresses) {
    return this.jsonrpc('getaddressdeltas', { 'addresses': addresses })
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

  async getAddressMempool (addresses) {
    return this.jsonrpc('getaddressmempool', { 'addresses': addresses })
  }

  async getAddresses (startingIndex = 0, numAddresses = 1) {
    const addresses = []
    const lastIndex = startingIndex + numAddresses

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const address = await this.getNewAddress()
      addresses.push(address)
    }

    return addresses
  }

  async getAddressTransactions (address, start, end) {
    return this.jsonrpc('getaddresstxids', { 'addresses': [address], start, end })
  }

  async getAddressDeltas (addresses) {
    return this.jsonrpc('getaddressdeltas', { 'addresses': addresses })
  }
}
