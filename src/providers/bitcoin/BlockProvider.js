import BitcoinProvider from './BitcoinProvider'

export default class BlockProvider extends BitcoinProvider {
  methods () {
    const { client } = this

    return {
      getCustomMethod: {
        version: '>=0.0.0',
        rpc: (...params) => {
          return client.getBlock(...params) // or Promise.resolve('Custom Response')
        }
      },

      getCustomBlockX: {
        version: '>=0.0.0',
        rpc: 'getblock' // custom object method mapped to rpc method
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
        type: BitcoinProvider.Types.Block
      },

      getBlockByNumber: {
        version: '>=0.6.0',
        rpc: 'getblockhash|getblock', // pipe rpc methods
        transform: {
          confirmations: (confirmations) => { // transform
            if (confirmations > 100) return 'Enough'
            else return 'Wait'
          },
          tx: [{
            rpc: 'gettransaction' // populate all tx
          }]
        },
        type: BitcoinProvider.Types.Block
      },

      getBlockByHash: {
        version: '>=0.6.0',
        alias: 'getBlock', // alias object methods
        type: BitcoinProvider.Types.Block
      },

      getBlockHeight: {
        version: '>=0.1.0',
        rpc: 'getblockcount' // custom object method mapped to rpc method
      },

      getBlockHash: {
        version: '>=0.6.0'
      },

      getBlockHeader: {
        version: '>=0.12.0'
      },

      generate: {
        version: '>=0.1.0'
      }
    }
  }
}
