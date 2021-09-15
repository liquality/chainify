/* eslint-env mocha */
import chai from 'chai'

import { Client } from '../../../client/lib'
import { FlowRpcProvider } from '../../lib'
import { FlowNetworks } from '../../../flow-networks/lib'
// import { BigNumber } from '@liquality/types/lib'

chai.config.truncateThreshold = 0

describe('Flow RPC provider', () => {
  let client: Client
  let provider: FlowRpcProvider

  beforeEach(() => {
    client = new Client()
    provider = new FlowRpcProvider(FlowNetworks.flow_testnet)
    client.addProvider(provider)
  })

  describe('getBlockHeight', () => {
    it('should return block height', async () => {
      await client.chain.getBlockHeight()
    })
  })
})
