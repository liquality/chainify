/* eslint-env mocha */

import chai, { expect } from 'chai'

import Client from '../../../client/lib'
import BitcoinRpcProvider from '../../../bitcoin-rpc-provider/lib'
import BitcoinRpcFeeProvider from '../../lib'

const mockJsonRpc = require('../../../../test/mock/mockJsonRpc')
const bitcoinRpc = require('../../../../test/mock/bitcoin/rpc')

chai.use(require('chai-bignumber')())
chai.config.truncateThreshold = 0

describe('Bitcoin RPC Fee provider', () => {
  let client

  beforeEach(() => {
    client = new Client()
    client.addProvider(new BitcoinRpcProvider('http://localhost:18332'))
    client.addProvider(new BitcoinRpcFeeProvider(6, 3, 1))

    mockJsonRpc('http://localhost:18332', bitcoinRpc, 100)
  })

  describe('getFees', () => {
    it('Should return correct fees', async () => {
      const fees = await client.chain.getFees()
      expect(fees.slow).to.equal(5)
      expect(fees.average).to.equal(10)
      expect(fees.fast).to.equal(20)
    })
  })
})
