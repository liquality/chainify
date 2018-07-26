const ChainAbstractionLayer = require('./')
const { EthereumLedgerProvider } = ChainAbstractionLayer.providers.ethereum

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const ethereumLedgerProvider = new EthereumLedgerProvider('http://localhost:8545')
const ethereum = new ChainAbstractionLayer(ethereumLedgerProvider)

;(async () => {
  prettyPrintJson(await ethereum.generateBlock(1))
  prettyPrintJson(await ethereum.signMessage('hello world'))
})()
