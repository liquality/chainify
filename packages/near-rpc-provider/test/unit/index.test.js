/* eslint-env mocha */
import chai from 'chai'

import Client from '../../../client/lib'
import NearRpcProvider from '../../lib'

chai.use(require('chai-bignumber')())
chai.config.truncateThreshold = 0

describe('Near RPC provider', () => {
  let client
  let provider

  beforeEach(() => {
    client = new Client()
    provider = new NearRpcProvider({
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org',
      helperUrl: 'https://helper.testnet.near.org',
      explorerUrl: 'https://explorer.testnet.near.org'
    })
    client.addProvider(provider)
  })

  describe('getBlockHeight', () => {
    it('should return block height', async () => {
      const height = await client.chain.getBlockHeight()
      console.log('height ', height)
    })
  })

  describe('getBalance', () => {
    it('should return correct balance', async () => {
      const balance = await client.chain.getBalance(['krasi'])
      console.log('balance: ', balance)
    })
  })

  describe('getGasPrice', () => {
    it('should return correct balance', async () => {
      console.log(client.chain)
      const gasPrice = await provider.getGasPrice()
      console.log('gas price: ', gasPrice)
    })
  })
})
