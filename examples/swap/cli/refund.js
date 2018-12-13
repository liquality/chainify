var ChainAbstractionLayer = require('../../../dist/index.cjs.js')
const { Client, providers, networks } = ChainAbstractionLayer

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRPCProvider('https://bitcoin.liquality.io:443', 'liquality', 'liquality123'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: networks.bitcoin, segwit: false }))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: networks.bitcoin }))

var initiationTxHash = ''
var recipientAddress = ''
var refundAddress = ''
var secretHash = ''
var expiration = 1468194353
chains.bitcoin.refundSwap(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration).then((ret) => {
  console.log('here', ret)
})
