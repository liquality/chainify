const { Client, providers } = require('../../../packages/bundle')
const { BitcoinRpcProvider } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoinRpcProvider('http://localhost:18332', 'bitcoin', 'local321'))

;(async () => {
  console.log(await bitcoin.chain.generateBlock(1))
})()
