import JsonRpcProvider from '../JsonRpcProvider'

import { formatEthResponse, ensureEthFormat } from './EthereumUtil'

export default class EthereumRPCProvider extends JsonRpcProvider {
  _parseResponse (response) {
    const data = super._parseResponse(response)

    return formatEthResponse(data)
  }

  async getAddresses () {
    return this.rpc('eth_accounts')
  }

  async generateBlock (numberOfBlocks) {
    // Q: throw or silently pass?
    throw new Error('This method isn\'t supported by Ethereum')
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this._rpc('eth_getBlockByNumber', blockNumber, includeTx)
  }

  async getTransactionByHash (txHash) {
    txHash = ensureEthFormat(txHash)
    return this._rpc('eth_getTransactionByHash', txHash)
  }
}
