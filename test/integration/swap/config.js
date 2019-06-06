export default {
  bitcoin: {
    rpc: {
      host: 'http://localhost:18332',
      username: 'bitcoin',
      password: 'local321'
    },
    network: 'bitcoin_regtest',
    value: 1000000,
    mineBlocks: true
  },
  ethereum: {
    rpc: {
      host: 'http://localhost:8545'
    },
    value: 10000000000000000,
    metaMaskConnector: {
      port: 3333
    }
  },
  timeout: 120000 // No timeout
}
