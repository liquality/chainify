import BitcoinRpcProvider from '@liquality-dev/bitcoin-rpc-provider'
import BitcoinNodeWalletProvider from '@liquality-dev/bitcoin-node-wallet-provider'
import BitcoinJsWalletProvider from '@liquality-dev/bitcoin-js-wallet-provider'
import BitcoinSwapProvider from '@liquality-dev/bitcoin-swap-provider'
import BitcoinEsploraApiProvider from '@liquality-dev/bitcoin-esplora-api-provider'
import * as BitcoinNetworks from '@liquality-dev/bitcoin-networks'
import * as BitcoinUtils from '@liquality-dev/bitcoin-utils'

import EthereumErc20Provider from '@liquality-dev/ethereum-erc20-provider'
import EthereumErc20SwapProvider from '@liquality-dev/ethereum-erc20-swap-provider'
import EthereumMetaMaskProvider from '@liquality-dev/ethereum-metamask-provider'
import EthereumJsWalletProvider from '@liquality-dev/ethereum-js-wallet-provider'
import EthereumRpcProvider from '@liquality-dev/ethereum-rpc-provider'
import EthereumSwapProvider from '@liquality-dev/ethereum-swap-provider'
import * as EthereumNetworks from '@liquality-dev/ethereum-networks'
import * as EthereumUtils from '@liquality-dev/ethereum-utils'

const bitcoin = {
  BitcoinRpcProvider,
  BitcoinNodeWalletProvider,
  BitcoinJsWalletProvider,
  BitcoinSwapProvider,
  BitcoinEsploraApiProvider,
  BitcoinNetworks,
  BitcoinUtils,
  networks: BitcoinNetworks
}

const ethereum = {
  EthereumErc20Provider,
  EthereumErc20SwapProvider,
  EthereumMetaMaskProvider,
  EthereumJsWalletProvider,
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
