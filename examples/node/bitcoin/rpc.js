const { Client, providers } = require('../../../')
const { BitcoinRPCProvider } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoinRPCProvider('http://localhost:18332', 'bitcoin', 'local321'))

;(async () => {
  console.log(await bitcoin.generateBlock(1))
  console.log(await bitcoin.getBalance('mgMuzuPNsCYPhw5NwktrtenaGYWLwps5FH'))
})()
