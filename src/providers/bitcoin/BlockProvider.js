import BitcoinProvider from './BitcoinProvider'

export default class BlockProvider extends BitcoinProvider {
  methods () {
    const { client } = this

    return {
      getTransactionByHash: {
        version: '>=0.0.0',
        handle: async (...args) => {
          const tx = await client.rpc('gettransaction', ...args)
          const txd = await client.rpc('decoderawtransaction', tx.hex)
          const obj = Object.assign({}, tx, txd)

          return obj
        },
        mapping: BitcoinProvider.Types.Transaction
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
