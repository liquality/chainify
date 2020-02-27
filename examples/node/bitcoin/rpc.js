const { Client, providers } = require('../../../packages/bundle')
const { BitcoinRpcProvider, BitcoinNodeWalletProvider, BitcoinNetworks } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoinRpcProvider('http://localhost:18443', 'bitcoin', 'local321', 1, 3, true))
bitcoin.addProvider(new BitcoinNodeWalletProvider(BitcoinNetworks.bitcoin_regtest, 'http://localhost:18443', 'bitcoin', 'local321'))

;(async () => {
  // console.log(await bitcoin.wallet.getUnusedAddress())
  console.log(await bitcoin.chain.sendTransaction('bcrt1q64ykzqve6knxva3rh9d2f604cfl2xz0hkj95wl', 10000, null, 'slow'))
  console.log(await bitcoin.chain.sendTransaction('bcrt1q64ykzqve6knxva3rh9d2f604cfl2xz0hkj95wl', 10000, null, 'standard'))
})()
