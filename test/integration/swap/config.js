export default {
  bitcoin: {
    rpc: {
      host: 'http://localhost:18332',
      username: 'bitcoin',
      password: 'local321'
    },
    network: 'bitcoin_testnet',
    value: 10000
  },
  ethereum: {
    rpc: {
      host: 'http://localhost:8545'
    },
    value: 100000000000000,
    metaMaskConnector: {
      port: 3333
    }
  }
}
