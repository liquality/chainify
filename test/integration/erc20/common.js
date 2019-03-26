/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
// import chai, { expect } from 'chai'
// import chaiAsPromised from 'chai-as-promised'
// import _ from 'lodash'
import { Client, providers } from '../../../src'
import config from './config'
import MetaMaskConnector from 'node-metamask'

const metaMaskConnector = new MetaMaskConnector({ port: config.metaMaskConnector.port })

function connectMetaMask () {
  before(async () => {
    console.log('\x1b[36m', 'Starting MetaMask connector on http://localhost:3333 - Open in browser to continue', '\x1b[0m')
    await metaMaskConnector.start()
  })
  after(async () => metaMaskConnector.stop())
}

const ethereumNetworks = providers.ethereum.networks
const ethereumWithMetaMask = new Client()
ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumRPCProvider(config.ethereum.rpc.host))
ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumMetaMaskProvider(metaMaskConnector.getProvider(), ethereumNetworks['rinkeby']))
ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumERC20Provider(config.token.address))

const ethereumWithNode = new Client()
ethereumWithNode.addProvider(new providers.ethereum.EthereumRPCProvider(config.ethereum.rpc.host))
ethereumWithNode.addProvider(new providers.ethereum.EthereumERC20Provider(config.token.address))

describe('ERC20 Basic functionality', function () {
  this.timeout(300000000)
  describe('Basic ERC20 transfer', function () {
    connectMetaMask()
    it('Transfer', async () => {
      await ethereumWithMetaMask.getMethod('erc20Transfer')('0x0000000000000000000000000000000000000001', 1)
      await ethereumWithMetaMask.getMethod('erc20Transfer')('0x0000000000000000000000000000000000000001', 1)
      await ethereumWithMetaMask.getMethod('erc20Transfer')('0x0000000000000000000000000000000000000001', 1)
      await ethereumWithMetaMask.getMethod('erc20Transfer')('0x0000000000000000000000000000000000000001', 1)
      const afterBalance = await ethereumWithMetaMask.getMethod('erc20Balance')(['0xc633C8d9e80a5E10bB939812b548b821554c49A6'])
      console.log(afterBalance)
    })
  })
})
