import BitcoinRPCProvider from './bitcoin/BitcoinRPCProvider'
import BitcoinLedgerProvider from './bitcoin/BitcoinLedgerProvider'
import BitcoinCrypto from './bitcoin/BitcoinCrypto'
import BitcoinSwapProvider from './bitcoin/BitcoinSwapProvider'

import EthereumRPCProvider from './ethereum/EthereumRPCProvider'
import EthereumLedgerProvider from './ethereum/EthereumLedgerProvider'
import EthereumMetaMaskProvider from './ethereum/EthereumMetaMaskProvider'
import EthereumSwapProvider from './ethereum/EthereumSwapProvider'

export default {
  bitcoin: {
    BitcoinRPCProvider,
    BitcoinLedgerProvider,
    crypto: BitcoinCrypto,
    BitcoinSwapProvider
  },
  ethereum: {
    EthereumRPCProvider,
    EthereumLedgerProvider,
    EthereumMetaMaskProvider,
    EthereumSwapProvider
  }
}
