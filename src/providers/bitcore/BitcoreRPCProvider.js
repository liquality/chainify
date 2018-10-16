import BitcoinRPCProvider from '../bitcoin/BitcoinRPCProvider'

export default class Bitcore extends BitcoinRPCProvider {
  async getAddressUtxos (addresses) {
    return this.jsonrpc('getaddressutxos', {'addresses': addresses})
  }
}
