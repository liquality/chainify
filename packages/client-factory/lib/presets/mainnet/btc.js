import BitcoinEsploraBatchApiProvider from '@liquality/bitcoin-esplora-batch-api-provider'
import BitcoinJsWalletProvider from '@liquality/bitcoin-js-wallet-provider'
import BitcoinSwapProvider from '@liquality/bitcoin-swap-provider'
import BitcoinEsploraSwapFindProvider from '@liquality/bitcoin-esplora-swap-find-provider'
import BitcoinEarnFeeProvider from '@liquality/bitcoin-earn-fee-provider'
import BitcoinNetworks from '@liquality/bitcoin-networks'

export default [
  {
    provider: BitcoinEsploraBatchApiProvider,
    optional: ['numberOfBlockConfirmation', 'defaultFeePerByte'],
    args: config => [
      'https://liquality.io/electrs-batch',
      'https://liquality.io/electrs',
      BitcoinNetworks.bitcoin,
      config.numberOfBlockConfirmation === undefined ? 1 : config.numberOfBlockConfirmation,
      config.defaultFeePerByte === undefined ? 3 : config.defaultFeePerByte
    ]
  },
  {
    provider: BitcoinJsWalletProvider,
    onlyIf: ['mnemonic'],
    args: config => [
      BitcoinNetworks.bitcoin,
      config.mnemonic
    ]
  },
  {
    provider: BitcoinSwapProvider,
    args: [
      BitcoinNetworks.bitcoin
    ]
  },
  {
    provider: BitcoinEsploraSwapFindProvider,
    args: [
      'https://liquality.io/electrs'
    ]
  },
  {
    provider: BitcoinEarnFeeProvider
  }
]
