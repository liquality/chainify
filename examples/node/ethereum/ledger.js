const ChainAbstractionLayer = require('../../../')
const { EthereumLedgerProvider } = ChainAbstractionLayer.providers.ethereum

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const ethereum = new ChainAbstractionLayer()
ethereum.addProvider(new EthereumLedgerProvider())

;(async () => {
  prettyPrintJson(await ethereum.signMessage('hello world'))
})()
