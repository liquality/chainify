const { Client, providers } = require('../../../')
const { BitcoinLedgerProvider } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoinLedgerProvider())

;(async () => {
  console.log(await bitcoin.signMessage('hello world'))
})()
