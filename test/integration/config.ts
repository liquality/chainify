import { BigNumber } from '../../packages/types/lib'
import BitcoinNetworks from '../../packages/bitcoin-networks/lib'
import EthereumNetworks from '../../packages/ethereum-networks/lib'

export default {
  bitcoin: {
    rpc: {
      host: 'http://localhost:18443',
      username: 'bitcoin',
      password: 'local321'
    },
    network: BitcoinNetworks.bitcoin_regtest,
    value: new BigNumber(1000000),
    mineBlocks: true
  },
  ethereum: {
    rpc: {
      host: 'http://localhost:8545'
    },
    value: new BigNumber(10000000000000000),
    network: {
      ...EthereumNetworks.local,
      name: 'mainnet',
      chainId: 1337, // Default geth dev mode - * Needs to be <= 255 for ledger * https://github.com/ethereum/go-ethereum/issues/21120
      networkId: 1337
    },
    metaMaskConnector: {
      port: 3333
    }
  },
  // ethereum: { // RSK
  //   rpc: {
  //     host: 'http://localhost:4444'
  //   },
  //   value: 1000,
  //   network: EthereumNetworks.rsk_regtest,
  //   metaMaskConnector: {
  //     port: 3333
  //   }
  // },
}
