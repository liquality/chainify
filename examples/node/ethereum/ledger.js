const { Client, providers } = require('../../../packages/bundle')
const { EthereumLedgerProvider } = providers.ethereum

const ethereum = new Client()
ethereum.addProvider(new EthereumLedgerProvider())

;(async () => {
  try {
    const [ address ] = await ethereum.wallet.getAddresses(0, 1)
    console.log(address)
    console.log(await ethereum.wallet.signMessage('hello world', address))
  } catch (e) {
    console.log(e)
  }
})()
