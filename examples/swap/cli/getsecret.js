var ChainAbstractionLayer = require('../../../packages/bundle')
const { Client, providers, crypto } = ChainAbstractionLayer
const networks = providers.bitcoin.networks

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRpcProvider('https://bitcoin.liquality.io:443', 'liquality', 'liquality123'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: networks.bitcoin, segwit: false }))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: networks.bitcoin }))

function doSwap () {
  chains.bitcoin.swap.generateSecret('test').then(secret => {
    chains.bitcoin.wallet.getUnusedAddress().then(address => {
      var secretHash = crypto.sha256(secret)
      console.log(secret)
      console.log(secretHash)
    })
  })
}

doSwap()
