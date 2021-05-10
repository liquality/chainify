/* eslint-env mocha */

import chai, { expect } from 'chai'

import { Client } from '../../../client/lib'
import { EthereumRpcProvider } from '../../../ethereum-rpc-provider/lib'
import { EthereumRpcFeeProvider } from '../../lib'

import mockJsonRpc from '../../../../test/mock/mockJsonRpc'
import ethereumRpc from '../../../../test/mock/ethereum/rpc'

chai.config.truncateThreshold = 0

describe('Ethereum RPC Fee provider', () => {
  let client: Client

  beforeEach(() => {
    client = new Client()
    client.addProvider(new EthereumRpcProvider({ uri: 'http://localhost:8545' }))
    client.addProvider(new EthereumRpcFeeProvider())

    mockJsonRpc('http://localhost:8545', ethereumRpc, 100)
  })

  describe('getFees', () => {
    it('Should return correct fees', async () => {
      const fees = await client.chain.getFees()
      expect(fees.slow.fee).to.equal(10)
      expect(fees.average.fee).to.equal(15)
      expect(fees.fast.fee).to.equal(20)
    })
  })
})
