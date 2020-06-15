/* eslint-env mocha */

import chai, { expect } from 'chai'
import { mockApi } from './mock'

import Client from '../../../client/lib'
import EthereumGasStationFeeProvider from '../../lib'

chai.use(require('chai-bignumber')())
chai.config.truncateThreshold = 0

const MINUTE = 60

describe('Ethereum Gas Station Fee provider', () => {
  let client

  beforeEach(() => {
    client = new Client()
    client.addProvider(new EthereumGasStationFeeProvider())
    mockApi()
  })

  describe('getFees', () => {
    it('Should return correct fees', async () => {
      const fees = await client.chain.getFees()

      expect(fees.slow.fee).to.equal(5)
      expect(fees.slow.wait).to.equal(20 * MINUTE)

      expect(fees.average.fee).to.equal(10)
      expect(fees.average.wait).to.equal(MINUTE)

      expect(fees.fast.fee).to.equal(20)
      expect(fees.fast.wait).to.equal(0.5 * MINUTE)
    })
  })
})
