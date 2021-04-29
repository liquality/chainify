import { BitcoinEsploraBatchApiProvider } from '@liquality/bitcoin-esplora-batch-api-provider'
import { BitcoinJsWalletProvider } from '@liquality/bitcoin-js-wallet-provider'
import { BitcoinSwapProvider } from '@liquality/bitcoin-swap-provider'
import { BitcoinEsploraSwapFindProvider } from '@liquality/bitcoin-esplora-swap-find-provider'
import { BitcoinRpcFeeProvider } from '@liquality/bitcoin-rpc-fee-provider'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'

export default [
  {
    provider: BitcoinEsploraBatchApiProvider,
    optional: ['numberOfBlockConfirmation', 'defaultFeePerByte'],
    args: (config: any) => [
      'https://liquality.io/electrs-testnet-batch',
      'https://liquality.io/testnet/electrs',
      BitcoinNetworks.bitcoin_testnet,
      config.numberOfBlockConfirmation === undefined ? 1 : config.numberOfBlockConfirmation,
      config.defaultFeePerByte === undefined ? 3 : config.defaultFeePerByte
    ]
  },
  {
    provider: BitcoinJsWalletProvider,
    onlyIf: ['mnemonic'],
    args: (config: any) => [BitcoinNetworks.bitcoin_testnet, config.mnemonic]
  },
  {
    provider: BitcoinSwapProvider,
    args: [BitcoinNetworks.bitcoin_testnet]
  },
  {
    provider: BitcoinEsploraSwapFindProvider,
    args: ['https://liquality.io/electrs']
  },
  {
    provider: BitcoinRpcFeeProvider
  }
]
