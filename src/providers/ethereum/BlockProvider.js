import EthereumProvider from './EthereumProvider'

export default class BlockProvider extends EthereumProvider {
  methods () {
    const { client } = this

    return {
      getBlockByNumber: {
        handle: (...args) => {
          return client.rpc('eth_getBlockByNumber', ...args, false)
        },
        mapping: EthereumProvider.Types.Block,
        type: 'Block'
      }

      // getBlockByHash: {
      //   version: '>=0.6.0',
      //   alias: 'getBlock', // alias object methods
      //   mapping: EthereumProvider.Types.Block,
      //   type: 'Block'
      // },
      //
      // getBlockHeight: {
      //   version: '>=0.1.0',
      //   handle: 'getblockcount' // custom object method mapped to rpc method
      // },
      //
      // getBlockHash: {
      //   version: '>=0.6.0'
      // },
      //
      // getBlockHeader: {
      //   version: '>=0.12.0'
      // }
    }
  }
}
