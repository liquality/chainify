const ChainAbstractionLayer = require('../../../')
const { BitcoinLedgerProvider } = ChainAbstractionLayer.providers.bitcoin

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoinLedgerProvider = new BitcoinLedgerProvider('http://localhost:8080', 'bitcoin', 'local321')
const bitcoin = new ChainAbstractionLayer(bitcoinLedgerProvider)

;(async () => {
  prettyPrintJson(await bitcoin.generateBlock(1))
  prettyPrintJson(await bitcoin.signMessage('hello world'))
})()
