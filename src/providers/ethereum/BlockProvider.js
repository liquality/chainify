import EthereumProvider from './EthereumProvider'

export default class BlockProvider extends EthereumProvider {
  methods () {
    const { client } = this

    return {
      getBlockByNumber: {
        handle: (...args) => {
          return client.rpc('eth_getBlockByNumber', ...args, false)
        },
        mapping: EthereumProvider.Types.Block
      },

      getTransactionByHash: {
        mapping: EthereumProvider.Types.Transaction
      },

      getBlockHeight: {
        handle: (...args) => {
          return client.rpc('eth_blockNumber')
        }
      }
    }
  }
}
