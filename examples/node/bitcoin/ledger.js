const ChainAbstractionLayer = require('../../../')
const { BitcoinLedgerProvider } = ChainAbstractionLayer.providers.bitcoin

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoin = new ChainAbstractionLayer()
bitcoin.addProvider(new BitcoinLedgerProvider())

;(async () => {
  prettyPrintJson(await bitcoin.signMessage('hello world'))
})()
