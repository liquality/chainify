var ChainAbstractionLayer = require('../../../dist/index.cjs.js')
const { Client, providers, networks, crypto } = ChainAbstractionLayer

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRPCProvider('https://bitcoin.liquality.io:443', 'liquality', 'liquality123'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: networks.bitcoin, segwit: false }))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: networks.bitcoin }))

function doSwap () {
  chains.bitcoin.generateSecret('test').then(secret => {
    chains.bitcoin.getUnusedAddress().then(address => {
      var secretHash = crypto.sha256(secret)
      console.log(secret)
      console.log(secretHash)
    })
  })
}

doSwap()
