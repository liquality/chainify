import JsonRpcProvider from '../JsonRpcProvider'

export default class EthereumRPCProvider extends JsonRpcProvider {
  async getAddresses () {
    return this.rpc('eth_accounts')
  }
}
