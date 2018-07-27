import BitcoinRPCProvider from './bitcoin/BitcoinRPCProvider'
import BitcoinLedgerProvider from './bitcoin/BitcoinLedgerProvider'
import BitcoinSwapProvider from './bitcoin/BitcoinSwapProvider'

import EthereumRPCProvider from './ethereum/EthereumRPCProvider'
import EthereumLedgerProvider from './ethereum/EthereumLedgerProvider'
import EthereumMetaMaskProvider from './ethereum/EthereumMetaMaskProvider'
import EthereumSwapProvider from './ethereum/EthereumSwapProvider'

export default {
  bitcoin: {
    BitcoinRPCProvider,
    BitcoinLedgerProvider,
    BitcoinSwapProvider
  },
  ethereum: {
    EthereumRPCProvider,
    EthereumLedgerProvider,
    EthereumMetaMaskProvider,
    EthereumSwapProvider
  }
}
