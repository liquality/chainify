import BitcoinProvider from './BitcoinProvider'

export default class BlockProvider extends BitcoinProvider {
  methods () {
    const { client } = this

    return {
      generate: {},
      getTransactionByHash: {
        version: '>=0.0.0',
        handle: (...args) => {
          return client
            .rpc('gettransaction', ...args)
            .then(tx => {
              return client
                .rpc('decoderawtransaction', tx.hex)
                .then(txd => Object.assign({}, tx, txd))
            })
        },
        mapping: BitcoinProvider.Types.Transaction
      },

      getBlock: {
        version: '>=0.6.0',
        mapping: BitcoinProvider.Types.Block,
        type: 'Block'
      },

      getBlockByNumber: {
        version: '>=0.6.0',
        handle: (number, includeTx) => {
          return client
            .rpc('getblockhash', number)
            .then(hash => {
              return client.rpc('getblock', hash)
            })
        },
        transform: (number, includeTx) => {
          if (includeTx) {
            return {
              tx: [{
                handle: 'gettransaction' // populate all tx
              }]
            }
          } else {
            return {}
          }
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
