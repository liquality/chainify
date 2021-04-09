/* eslint-env mocha */
import { mockApi, mockApiFeesTooHigh } from './mock'

import Client from '../../../client/lib'
import EthereumGasNowFeeProvider from '../../lib'

const { expect } = require('chai').use(require('chai-as-promised'))
import chai from 'chai'
chai.config.truncateThreshold = 0

describe('Ethereum Gas Station Fee provider', () => {
  let client: Client

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
