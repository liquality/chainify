const { Client, providers } = require('../../../')
const { EthereumLedgerProvider } = providers.ethereum

const ethereum = new Client()
ethereum.addProvider(new EthereumLedgerProvider())

;(async () => {
  console.log(await ethereum.signMessage('hello world'))
})()
