import BitcoinRPCProvider from './BitcoinRPCProvider'

/**
 * BitcoreRPCProvider overrides the BitcoinRPCProvider to use the address index
 * for retrieving address utxos
 */
export default class BitcoreRPCProvider extends BitcoinRPCProvider {
  async getNewAddress (from = {}) {
    return this.jsonrpc('getnewaddress')
  }

  async getUnusedAddress (from = {}) {
    return this.getNewAddress()
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

  async getAddressTransactions (address, start, end) {
    return this.jsonrpc('getaddresstxids', { 'addresses': [address], start, end })
  }

  async getAddressDeltas (addresses) {
    return this.jsonrpc('getaddressdeltas', { 'addresses': addresses })
  }
}
