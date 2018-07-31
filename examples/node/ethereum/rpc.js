const ChainAbstractionLayer = require('../../../')
const { EthereumRPCProvider } = ChainAbstractionLayer.providers.ethereum

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const ethereum = new ChainAbstractionLayer()
ethereum.addProvider(new EthereumRPCProvider('http://localhost:8545'))

;(async () => {
  prettyPrintJson(await ethereum.getAddresses())
})()
