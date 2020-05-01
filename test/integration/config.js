export default {
  bitcoin: {
    rpc: {
      host: 'http://localhost:18443',
      username: 'bitcoin',
      password: 'local321'
    },
    network: 'bitcoin_regtest',
    value: 1000000,
    mineBlocks: true,
    kibaConnector: {
      port: 3334
    }
  },
  ethereum: {
    rpc: {
      host: 'http://localhost:8545'
    },
    value: 10000000000000000,
    network: 'local',
    metaMaskConnector: {
      port: 3333
    }
  },
  timeout: 240000 // No timeout
}
