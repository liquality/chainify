import { BigNumber } from '../../packages/types/lib'
import { BitcoinNetworks, BitcoinCashNetworks } from '../../packages/bitcoin-networks/lib'
import { EthereumNetworks } from '../../packages/ethereum-networks/lib'
import { NearNetworks } from '../../packages/near-networks/lib'
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
  bitcoincash: {
    rpc: {
      host: 'http://localhost:18543',
      username: 'bitcoin',
      password: 'local321'
    },
    network: BitcoinCashNetworks.bitcoin_cash_regtest,
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
    senderAddress: '51d852b19f1ec451d694ce56c39cc18c8d892ab37cee7d82adc23bd8a48ade28',
    senderMnemonic:
      'buddy blood uncle anxiety honey eternal turn smart bunker voice absent exotic',

    // receiver
    receiverAddress: 'bcdd908836ca6555875d40c1aa61b9f3ddd6c32ea19f6ad53df3b6bfecfa0706',
    receiverMnemonic:
      'wheat success humble lawsuit suspect exotic reopen kid moral capable blade genuine'
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
