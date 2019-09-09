const { Client, providers } = require('@liquality/bundle')
const config = require('./config')

const bitcoinNetworks = providers.bitcoin.networks
const bitcoinNetwork = bitcoinNetworks[config.bitcoin.network]

const mneumonic = config.bitcoin.mneumonic

exports.getProvider = () => {
  let provider = new Client()

  provider.addProvider(
    new providers.bitcoin.BitcoinEsploraApiProvider(
      'https://blockstream.info/testnet/api'
    )
  )
  provider.addProvider(
    new providers.bitcoin.BitcoinJsWalletProvider(
      bitcoinNetwork,
      config.bitcoin.rpc.host,
      config.bitcoin.rpc.username,
      config.bitcoin.rpc.password,
      mneumonic,
      'legacy'
    )
  )
  return provider
}
