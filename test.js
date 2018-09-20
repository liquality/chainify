const { Client, providers: { bitcoin: { BitcoinLedgerProvider, BitcoinBlockchainAPIProvider } } } = require('./')

const client = new Client()
const address = '1MURUNpkvjmSvx3ffw1YAwwTBdky5FXkXJ'
const api = new BitcoinBlockchainAPIProvider()
const ledger = new BitcoinLedgerProvider()

client.addProvider(api)
client.addProvider(ledger)

;(async () => {
  let start

  // // 3.5x faster: 6s
  // start = Date.now()
  // console.log(await client.getAddresses())
  // console.log(`${(Date.now() - start) / 1000}s`)
  //
  // // 21s
  // start = Date.now()
  // console.log(await ledger.getAddressesOld())
  // console.log(`${(Date.now() - start) / 1000}s`)

  // 21s
  start = Date.now()
  console.log(await api.getAddressTransactionCount(address))
  console.log(`${(Date.now() - start) / 1000}s`)

  // 21s
  start = Date.now()
  console.log(await client.testMethod(address))
  console.log(`${(Date.now() - start) / 1000}s`)
})()
