const Client = require('./')

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoin = new Client(new Client.providers.bitcoin.BitcoinRPCProvider('http://localhost:8080', 'bitcoin', 'local321'))

// bitcoin.addProvider(new BitcoinProvider())

;(async () => {
  prettyPrintJson(await bitcoin.generateBlock(1))
  // prettyPrintJson(await bitcoin.getTransactionByHash('1539ca1febc88d637563d078ce320d400359a4f4a93c7a24e89bc3a0aa0a34a3'))
})()
