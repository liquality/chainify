/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

function testGetBlock (chain) {
  it('Should validate block correct and return block height as number', async () => {
    const blockHeight = await chain.client.chain.getBlockHeight()
    const block = await chain.client.chain.getBlockByNumber(blockHeight)

    expect(blockHeight).to.equal(parseInt(blockHeight))
    expect(block.number).to.equal(blockHeight)
  })
}

describe('Send Transactions', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Ledger', () => {
    testGetBlock(chains.bitcoinWithNode)
  })
})
