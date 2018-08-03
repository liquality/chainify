const ChainAbstractionLayer = require('../../../')
const { BitcoinRPCProvider } = ChainAbstractionLayer.providers.bitcoin

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoin = new ChainAbstractionLayer()
bitcoin.addProvider(new BitcoinRPCProvider('http://localhost:18332', 'bitcoin', 'local321'))

;(async () => {
  prettyPrintJson(await bitcoin.generateBlock(1))
})()
