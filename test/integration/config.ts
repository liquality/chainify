import { BigNumber } from '../../packages/types/lib'
import { BitcoinNetworks, BitcoinCashNetworks } from '../../packages/bitcoin-networks/lib'
import { EthereumNetworks } from '../../packages/ethereum-networks/lib'
import { NearNetworks } from '../../packages/near-networks/lib'
import { SolanaNetworks } from '../../packages/solana-network/lib'

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
    senderAddress: '6XFgUGQWSQrtn2n3Tscds7PXQyvC55ZHqNo75KPutMR7',
    senderMnemonic:
      'mixed leader indoor danger you below wall rally coil key witness wedding elephant bunker edit fatal swallow penalty banana antique total fame sunny cash',

    // receiver
    receiverAddress: '2ALwx6KUDPceTvM7ghcguwk9ANyNEgkgQSA7s93qMZBY',
    receiverMnemonic:
      'property expect output goat walnut across swallow double small doctor piece problem vault arctic city toe cotton start give control eye chunk stamp round'
  },
  solana: {
    network: SolanaNetworks.solana_testnet,
    walletIndex: 0,
    value: new BigNumber(1000000000),

    senderAddress: '6XFgUGQWSQrtn2n3Tscds7PXQyvC55ZHqNo75KPutMR7',
    senderMnemonic:
      'mixed leader indoor danger you below wall rally coil key witness wedding elephant bunker edit fatal swallow penalty banana antique total fame sunny cash',

    receiverAddress: '2ALwx6KUDPceTvM7ghcguwk9ANyNEgkgQSA7s93qMZBY',
    receiverMnemonic:
      'property expect output goat walnut across swallow double small doctor piece problem vault arctic city toe cotton start give control eye chunk stamp round'
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
