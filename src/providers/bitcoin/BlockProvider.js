import BitcoinProvider from './BitcoinProvider'

export default class BlockProvider extends BitcoinProvider {
  methods () {
    const { client } = this

    return {
      getCustomMethod: {
        version: '>=0.0.0',
        handle: (...params) => {
          return client.getBlock(...params) // or Promise.resolve('Custom Response')
        }
      },

      getCustomBlockX: {
        version: '>=0.0.0',
        handle: 'getblock' // custom object method mapped to rpc method
      },

      getBlock: {
        version: '>=0.6.0',
        transform: {
          confirmations: (confirmations) => { // transform
            if (confirmations > 100) return 'Enough'
            else return 'Wait'
          },
          tx: [ function transform (value) {
            return `Tx<${value}>`
          } ]
        },
        mapping: BitcoinProvider.Types.Block,
        type: 'Block'
      },

      getBlockByNumber: {
        version: '>=0.6.0',
        handle: 'getblockhash|getblock', // pipe rpc methods
        transform: {
          confirmations: (confirmations) => { // transform
            if (confirmations > 100) return 'Enough'
            else return 'Wait'
          },
          tx: [{
            handle: 'gettransaction' // populate all tx
          }]
        },
        mapping: BitcoinProvider.Types.Block,
        type: 'Block'
      },

      getBlockByHash: {
        version: '>=0.6.0',
        alias: 'getBlock', // alias object methods
        mapping: BitcoinProvider.Types.Block,
        type: 'Block'
      },

      getBlockHeight: {
        version: '>=0.1.0',
        handle: 'getblockcount' // custom object method mapped to rpc method
      },

      getBlockHash: {
        version: '>=0.6.0'
      },

      getBlockHeader: {
        version: '>=0.12.0'
      }
    }
  }
}
