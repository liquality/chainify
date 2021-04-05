import EthereumRpcProvider from '@liquality/ethereum-rpc-provider'
import EthereumJsWalletProvider from '@liquality/ethereum-js-wallet-provider'
import EthereumSwapProvider from '@liquality/ethereum-swap-provider'
import EthereumScraperSwapFindProvider from '@liquality/ethereum-scraper-swap-find-provider'
import EthereumRpcFeeProvider from '@liquality/ethereum-rpc-fee-provider'
import EthereumNetworks from '@liquality/ethereum-networks'

export default [
  {
    provider: EthereumRpcProvider,
    optional: ['infuraProjectId'],
    args: (config: any) => [
      `https://rinkeby.infura.io/v3/${config.infuraProjectId || '1d8f7fb6ae924886bbd1733951332eb0'}`
    ]
  },
  {
    provider: EthereumJsWalletProvider,
    onlyIf: ['mnemonic'],
    args: (config: any)  => [
      EthereumNetworks.rinkeby,
      config.mnemonic
    ]
  },
  {
    provider: EthereumSwapProvider
  },
  {
    provider: EthereumScraperSwapFindProvider,
    args: [
      'https://liquality.io/eth-mainnet-api'
    ]
  },
  {
    provider: EthereumRpcFeeProvider
  }
]
