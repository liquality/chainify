const Client = require('./')
const { BitcoinLedgerProvider } = Client.providers.bitcoin

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoinLedgerProvider = new BitcoinLedgerProvider('http://localhost:8080', 'bitcoin', 'local321')
const bitcoin = new Client(bitcoinLedgerProvider)

;(async () => {
  prettyPrintJson(await bitcoin.generateBlock(1))
  prettyPrintJson(await bitcoin.signMessage('hello world'))
})()
