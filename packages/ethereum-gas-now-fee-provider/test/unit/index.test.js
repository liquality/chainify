/* eslint-env mocha */

import chai, { expect } from 'chai'
import { mockApi, mockApiFeesTooHigh } from './mock'

import Client from '../../../client/lib'
import EthereumGasNowFeeProvider from '../../lib'

chai.use(require('chai-bignumber')())
chai.config.truncateThreshold = 0

describe('Ethereum Gas Station Fee provider', () => {
  let client

  beforeEach(() => {
    client = new Client()
    client.addProvider(new EthereumGasNowFeeProvider())
  })

  describe('getFees', () => {
    it('Should return correct fees', async () => {
      mockApi()

      const fees = await client.chain.getFees()

      expect(fees.slow.fee).to.equal(5)

      expect(fees.average.fee).to.equal(10)

      expect(fees.fast.fee).to.equal(20)
    })

    it('Should throw error when', async () => {
      mockApiFeesTooHigh()

      await expect(client.chain.getFees()).to.be.rejectedWith('Fee over 1000 Gwei detected.')
    })
  })
})
