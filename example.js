const Client = require('./')

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoin = new Client()

// bitcoin.addProvider(new BitcoinProvider())

;(async () => {
  prettyPrintJson(await bitcoin.getBlockByNumber(3, true))
  prettyPrintJson(await bitcoin.getTransactionByHash('1539ca1febc88d637563d078ce320d400359a4f4a93c7a24e89bc3a0aa0a34a3'))
})()
