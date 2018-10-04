const { Client, providers } = require('../../../')
const { BitcoinLedgerProvider } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoinLedgerProvider())

;(async () => {
  try {
    const [ address ] = await bitcoin.getAddresses(0, 1)
    console.log(address)
    console.log(await bitcoin.signMessage('hello world', address))
  } catch (e) {
    console.log(e)
  }
})()
