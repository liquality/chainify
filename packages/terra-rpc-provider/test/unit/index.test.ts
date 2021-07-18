/* eslint-env mocha */
import chai, { expect } from 'chai'

import { Client } from '../../../client/lib'
import { TerraRpcProvider } from '../../lib'
import { TerraSwapFindProvider } from '../../../terra-swap-find-provider/lib'
import { TerraNetworks } from '../../../terra-networks'
// import { describeExternal } from '../../../../test/integration/common'

chai.config.truncateThreshold = 0

describe('Solana RPC provider', () => {
  let client: Client
  let provider: any

  beforeEach(() => {
    client = new Client()
    provider = new TerraRpcProvider(TerraNetworks.terra_testnet)
    client.addProvider(provider).addProvider(new TerraSwapFindProvider(TerraNetworks.terra_testnet))
  })

  describe('getBlockNumber', () => {
    it('should return block by number', async () => {
      const currentBlock = await client.getMethod('getBlockHeight')()

      await client.chain.getBlockByNumber(currentBlock, false)
    })
  })

  xdescribe('getBalance', () => {
    it('should return user balance', async () => {
      await client.chain.getBalance(['terra1kndc26sx87rjet5ur3vvnppln449pdvf665g7p'])
    })
  })

  xdescribe('getBalance', () => {
    it('should return 0 if balance do not exist', async () => {
      const balance = await client.chain.getBalance(['terra1f9xpzndman0t3u5h0qr6nk9qh4al9lwq7jgpf0'])

      expect(balance.toNumber()).to.equal(0)
    })
  })

  xdescribe('getTransactionByHash', () => {
    it('should get tx by hash', async () => {
      const txHash = '88FB048FC79EE4854F42217B02ACA47376D13A49F5259F2A5A6D545252470B65'

      const tx = await client.chain.getTransactionByHash(txHash)

      expect(tx.value).to.equal(123)
    })
  })
})
