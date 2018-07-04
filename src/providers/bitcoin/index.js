import BlockProvider from './BlockProvider'
import LedgerWalletProvider from './LedgerWalletProvider'

export default [
  new BlockProvider(),
  new LedgerWalletProvider()
]
