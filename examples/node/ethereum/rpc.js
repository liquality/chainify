const { Client, providers } = require('../../../')
const { EthereumRPCProvider } = providers.ethereum

const ethereum = new Client()
ethereum.addProvider(new EthereumRPCProvider('http://localhost:8545'))

;(async () => {
  console.log(await ethereum.getAddresses())
})()
