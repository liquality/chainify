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

function testGenerateBlock (chain) {
  it('should generate a new block', async () => {
    const blockHeightBefore = await chain.client.chain.getBlockHeight()
    await chain.client.chain.generateBlock(1)
    const blockHeightAfter = await chain.client.chain.getBlockHeight()

    expect(blockHeightAfter).to.equal(blockHeightBefore + 1)
  })
}

describe('Block Numbers', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Node', () => {
    testGetBlock(chains.bitcoinWithNode)
  })
})

describe('Block Generate', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Node', () => {
    testGenerateBlock(chains.bitcoinWithNode)
  })
})
