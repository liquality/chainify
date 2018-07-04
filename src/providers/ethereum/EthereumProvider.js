/*
 * EthereumProvider class
 * with ethereum related transforms
 */

export default class EthereumProvider {
  setClient (client) {
    this.client = client
  }

  transforms () {
    return {
      methodToRpc (method, params) {
        return method
      },
      value (val, unit) {
        // convert hex to satoshi/mBTC/BTC
        return val
      }
    }
  }
}

BitcoinProvider.Types = {
  Block: {
    number: 'number',
    hash: 'hash',
    timestamp: 'time',
    difficulty: 'difficulty',
    size: 'size',
    parentHash: 'parentHash',
    nonce: 'nonce',
    transactions: 'transactions'
  },
  Transaction: {
    confirmations: (key, result, client) => {
      return client.rpc('eth_blockNumber').then(currentBlock => {
        return Number(currentBlock) - result[key]
      })
    },
    hash: 'hash',
    value: 'value',
    blockHash: 'blockHash',
    blockNumber: 'blockNumber'
  }
}
