/* eslint-env mocha */
import chai, { expect } from 'chai'

import Client from '../../../client/lib'
import NearRpcProvider from '../../lib'
import NearNetwork from '../../../near-networks'
import { BigNumber } from '../../../types/lib'

chai.config.truncateThreshold = 0

describe('Near RPC provider', () => {
  let client: Client
  let provider: NearRpcProvider

  beforeEach(() => {
    client = new Client()
    provider = new NearRpcProvider(NearNetwork.near_testnet)
    client.addProvider(provider)
  })

  describe('getBlockHeight', () => {
    it('should return block height', async () => {
      await client.chain.getBlockHeight()
    })
  })

  describe('getBalance', () => {
    it('should return correct balance', async () => {
      const balance = await client.chain.getBalance(['krasi'])
      expect(BigNumber.isBigNumber(balance)).to.be.true
    })
  })

  describe('getBalance', () => {
    it('should return correct balance for non existing account', async () => {
      const balance = await client.chain.getBalance(['non-existing-account'])
      expect(balance.eq(0)).to.be.true
    })
  })
})
