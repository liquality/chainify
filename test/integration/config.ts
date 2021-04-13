import { BigNumber } from '../../packages/types/lib'
import BitcoinNetworks from '../../packages/bitcoin-networks/lib'
import EthereumNetworks from '../../packages/ethereum-networks/lib'
import NearNetworks from '../../packages/near-networks/lib'

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
  near: {
    network: NearNetworks.near_testnet,
    value: new BigNumber(5000000000000000000000000),

    // Both of the accounts are used for the tests.
    // Before each test all funds from the receiver are moved to the sender, which provides enough funds for the whole test suite.

    // sender
    senderAddress: 'e9f034f2692e6bb7e50a237a016bb09c1573a17a40da97db3caef4f9dc35b027',
    mnemonic: 'vapor reform dice donor verify race oven virus wrong cook inquiry pilot',

    // receiver
    receiverAddress: 'c2724256be76d3ff3569e8996e564329a9450f81501b69cb7011d77a044670a8',
    receiverMnemonic: 'chicken concert congress gun language bottom invest powder gadget exile saddle menu'
  }
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
