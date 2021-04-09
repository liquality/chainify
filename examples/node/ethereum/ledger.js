const Client = require('../../../packages/client').default
const EthereumNetworks = require('../../../packages/ethereum-networks').default
const LedgerTransport = require('@ledgerhq/hw-transport-node-hid').default
const EthereumLedgerProvider = require('../../../packages/ethereum-ledger-provider').default

const ethereum = new Client()
ethereum.addProvider(new EthereumLedgerProvider(EthereumNetworks.rinkeby, LedgerTransport))

;(async () => {
  try {
    const [ address ] = await ethereum.wallet.getAddresses(0, 1)
    console.log(address)
    console.log(await ethereum.wallet.signMessage('hello world', address.address))
  } catch (e) {
    console.log(e)
  }
})()
