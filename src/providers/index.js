import BitcoinRPCProvider from './bitcoin/BitcoinRPCProvider'
import BitcoinLedgerProvider from './bitcoin/BitcoinLedgerProvider'

import EthereumRPCProvider from './ethereum/EthereumRPCProvider'
import EthereumLedgerProvider from './ethereum/EthereumLedgerProvider'
import EthereumMetaMaskProvider from './ethereum/EthereumMetaMaskProvider'

export default {
  bitcoin: {
    BitcoinRPCProvider,
    BitcoinLedgerProvider
  },
  ethereum: {
    EthereumRPCProvider,
    EthereumLedgerProvider,
    EthereumMetaMaskProvider
  }
}
