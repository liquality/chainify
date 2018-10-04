const { Client, providers } = require('../../../')
const { EthereumLedgerProvider } = providers.ethereum

const ethereum = new Client()
ethereum.addProvider(new EthereumLedgerProvider())

;(async () => {
  try {
    const [ address ] = await ethereum.getAddresses(0, 1)
    console.log(address)
    console.log(await ethereum.signMessage('hello world', address))
  } catch (e) {
    console.log(e)
  }
})()
