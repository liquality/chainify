const { Client, providers } = require('../../../packages/bundle')
const { BitcoinLedgerProvider } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoinLedgerProvider())

;(async () => {
  try {
    const [ address ] = await bitcoin.wallet.getAddresses(0, 1)
    console.log(address)
    console.log(await bitcoin.wallet.signMessage('hello world', address.address))
  } catch (e) {
    console.log(e)
  }
})()
