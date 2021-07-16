/* eslint-env mocha */
import chai, { expect } from 'chai'

import { Client } from '../../../client/lib'
import { TerraRpcProvider } from '../../lib'
import { TerraNetworks } from '../../../terra-network'
import { describeExternal } from '../../../../test/integration/common'

chai.config.truncateThreshold = 0

describe('Solana RPC provider', () => {
  let client: Client
  let provider: any

  beforeEach(() => {
    client = new Client()
    provider = new TerraRpcProvider(TerraNetworks.terra_testnet)
    client.addProvider(provider)
  })

  describe('getBlockNumber', () => {
    it('should return block by number', async () => {
      const currentBlock = await client.getMethod('getBlockHeight')()

      console.log('current block', currentBlock)

      await client.chain.getBlockByNumber(currentBlock, false)
    })
  })

  describeExternal('getBalance', () => {
    it('should return user balance', async () => {
      await client.chain.getBalance(['terra1kndc26sx87rjet5ur3vvnppln449pdvf665g7p'])
    })
  })

  describeExternal('getBalance', () => {
    it('should return 0 if balance do not exist', async () => {
      const balance = await client.chain.getBalance(['terra1f9xpzndman0t3u5h0qr6nk9qh4al9lwq7jgpf0'])

      expect(balance.toNumber()).to.equal(0)
    })
  })

  describeExternal('getTransactionByHash', () => {
    it('should get tx by hash', async () => {
      const txHash = '3Xu7GVdUrcx1wNXJJCGe7TuVB8RqSqkQA2ioReDZpGPyo6648otdZfaDRetpYjuK4MSizFF8469V7RDYwYDzdbDQ'

      const tx = await client.chain.getTransactionByHash(txHash)

      expect(tx.value).to.equal(10)
    })
  })
})
