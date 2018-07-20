import BitcoinRPCProvider from './bitcoin/BitcoinRPCProvider'
import BitcoinLedgerProvider from './bitcoin/BitcoinLedgerProvider'

import EthereumRPCProvider from './ethereum/EthereumRPCProvider'
import EthereumLedgerProvider from './ethereum/EthereumLedgerProvider'

export default {
  bitcoin: {
    BitcoinRPCProvider,
    BitcoinLedgerProvider
  },
  ethereum: {
    EthereumRPCProvider,
    EthereumLedgerProvider
  }
}
