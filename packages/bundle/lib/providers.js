import BitcoinBitcoinJsLibSwapProvider from '@mblackmblack/bitcoin-bitcoinjs-lib-swap-provider'
import BitcoinBitcoreRpcProvider from '@mblackmblack/bitcoin-bitcore-rpc-provider'
import BitcoinCollateralProvider from '@mblackmblack/bitcoin-collateral-provider'
import BitcoinLedgerProvider from '@mblackmblack/bitcoin-ledger-provider'
import BitcoinRpcProvider from '@mblackmblack/bitcoin-rpc-provider'
import BitcoinSwapProvider from '@mblackmblack/bitcoin-swap-provider'
import * as BitcoinNetworks from '@mblackmblack/bitcoin-networks'
import * as BitcoinUtils from '@mblackmblack/bitcoin-utils'

import EthereumErc20Provider from '@mblackmblack/ethereum-erc20-provider'
import EthereumErc20SwapProvider from '@mblackmblack/ethereum-erc20-swap-provider'
import EthereumLedgerProvider from '@mblackmblack/ethereum-ledger-provider'
import EthereumMetaMaskProvider from '@mblackmblack/ethereum-metamask-provider'
import EthereumRpcProvider from '@mblackmblack/ethereum-rpc-provider'
import EthereumSwapProvider from '@mblackmblack/ethereum-swap-provider'
import * as EthereumNetworks from '@mblackmblack/ethereum-networks'
import * as EthereumUtils from '@mblackmblack/ethereum-utils'

const bitcoin = {
  BitcoinBitcoinJsLibSwapProvider,
  BitcoinBitcoreRpcProvider,
  BitcoinCollateralProvider,
  BitcoinLedgerProvider,
  BitcoinRpcProvider,
  BitcoinSwapProvider,
  BitcoinNetworks,
  BitcoinUtils,
  networks: BitcoinNetworks
}

const ethereum = {
  EthereumErc20Provider,
  EthereumErc20SwapProvider,
  EthereumLedgerProvider,
  EthereumMetaMaskProvider,
  EthereumRpcProvider,
  EthereumSwapProvider,
  EthereumNetworks,
  EthereumUtils,
  networks: EthereumNetworks
}

export {
  bitcoin,
  ethereum
}
