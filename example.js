const Client = require('./')

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoin = new Client('bitcoin://bitcoin:local321@localhost:18332/?timeout=200&version=0.12.0')
const ethereum = new Client('ethereum://auth@localhost:8545/')

;(async function () {
  prettyPrintJson(await bitcoin.getBlockByNumber(3, true))
  prettyPrintJson(await ethereum.getBlockByNumber(1, true))
  prettyPrintJson(await ethereum.getTransactionByHash('0x976299dd29eb2080ac856a0ff32a48e2c3a317efce7428976eb2e2d9c6267c3e'))
  prettyPrintJson(await bitcoin.getTransactionByHash('1539ca1febc88d637563d078ce320d400359a4f4a93c7a24e89bc3a0aa0a34a3'))
})()
