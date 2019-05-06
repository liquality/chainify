const { Client, providers } = require('../../../packages/bundle')
const { EthereumRpcProvider } = providers.ethereum

const ethereum = new Client()
ethereum.addProvider(new EthereumRpcProvider('http://localhost:8545'))

;(async () => {
  console.log(await ethereum.wallet.getAddresses())
})()
