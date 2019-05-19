import BitcoinBitcoinJsLibSwapProvider from '@atomicloans/bitcoin-bitcoinjs-lib-swap-provider'
import BitcoinBitcoreRpcProvider from '@atomicloans/bitcoin-bitcore-rpc-provider'
import BitcoinCollateralProvider from '@atomicloans/bitcoin-collateral-provider'
import BitcoinLedgerProvider from '@atomicloans/bitcoin-ledger-provider'
import BitcoinRpcProvider from '@atomicloans/bitcoin-rpc-provider'
import BitcoinSwapProvider from '@atomicloans/bitcoin-swap-provider'
import * as BitcoinNetworks from '@atomicloans/bitcoin-networks'
import * as BitcoinUtils from '@atomicloans/bitcoin-utils'

import EthereumErc20Provider from '@atomicloans/ethereum-erc20-provider'
import EthereumErc20SwapProvider from '@atomicloans/ethereum-erc20-swap-provider'
import EthereumLedgerProvider from '@atomicloans/ethereum-ledger-provider'
import EthereumMetaMaskProvider from '@atomicloans/ethereum-metamask-provider'
import EthereumRpcProvider from '@atomicloans/ethereum-rpc-provider'
import EthereumSwapProvider from '@atomicloans/ethereum-swap-provider'
import * as EthereumNetworks from '@atomicloans/ethereum-networks'
import * as EthereumUtils from '@atomicloans/ethereum-utils'

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
