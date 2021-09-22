import { BigNumber } from '../../packages/types/lib'
import { BitcoinNetworks } from '../../packages/bitcoin-networks/lib'
import { EthereumNetworks } from '../../packages/ethereum-networks/lib'
import { NearNetworks } from '../../packages/near-networks/lib'
import { TerraNetworks } from '../../packages/terra-networks/lib'
import { SolanaNetworks } from '../../packages/solana-networks/lib'

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
    senderAddress: '9eed84cfc2ac0068dd8fc10b8b3b71c8d0f74cfd09211e036bdb8561c2647472',
    senderMnemonic: 'diary wolf balcony magnet view mosquito settle gym slim target divert all',
    // receiver
    receiverAddress: '797b73fdaae5f9c4b343a7f8a7334fb56d04dad9a32b5a5e586c503701d537b6',
    receiverMnemonic: 'pet replace kitchen ladder jaguar bleak health horn high fall crush maze'
  },
  terra: {
    network: TerraNetworks.terra_testnet,
    value: new BigNumber(100000),

    // Both of the accounts are used for the tests.
    // Before each test all funds from the receiver are moved to the sender, which provides enough funds for the whole test suite.

    // receiver
    receiverAddress: 'terra10c9wv2symnwq72yh8v9xg7ddkcugxq08nhskx9',
    receiverMnemonic:
      'avoid void grid scare guard biology gaze system wine undo tomorrow evoke noble salon income juice stumble myth debate praise kind reflect ketchup fossil',

    // sender
    senderAddress: 'terra156c6y66lqp7xe9x3hvl3uf0szl7ek44ferg4sg',
    senderMnemonic:
      'fury motion step civil horn snake engine wage honey already interest fall property nephew jeans true moment weasel village then upset avocado wheat write'
  },
  solana: {
    network: SolanaNetworks.solana_testnet,
    walletIndex: 0,
    value: new BigNumber(100000000),

    senderAddress: 'CGP6sKHyrZGPJRoUAy8XbyzmX7YD4tVBQG9SEe9ekZM6',
    senderMnemonic:
      'thumb proud solar any north rely grow ceiling pattern dress under illegal relief brief flock ensure tumble green million earth lesson absent horse snap',

    // receiver
    receiverAddress: '5r3N8yt7DYgh888Rr7owRoD3Jn6QSNY9sYyisTkT86DU',
    receiverMnemonic:
      'glance item million plastic used siren giant process oppose access soldier what all live shy kitten urge earth easy bounce blade inmate scorpion icon'
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
