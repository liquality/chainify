process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const { Client, providers } = require('../../../packages/bundle')
const { BitcoinLedgerProvider, BitcoreRpcProvider, networks } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoreRpcProvider('http://localhost:18332', 'bitcoin', 'local321'))
bitcoin.addProvider(new BitcoinLedgerProvider({ network: networks.bitcoin_testnet, segwit: false }))
// bitcoin.addProvider(new BitcoreRpcProvider('https://bitcoin.liquality.io/', 'liquality', 'liquality123'))

;(async () => {
  try {
    let d = Date.now()
    try {
      console.log(await bitcoin.getMethod('getUnusedAddress')())
      console.log('Time taken', `${(Date.now() - d) / 1000}s`)
    } catch (e) {
      console.error(e)
    }
  } catch (e) {
    console.log(e)
  }
})()
