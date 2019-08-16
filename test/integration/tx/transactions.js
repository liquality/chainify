/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

function testTransaction (chain) {
  it('Sent value to 1 address', async () => {
    const addr = (await chain.client.wallet.getUnusedAddress()).address
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    await chain.client.chain.sendTransaction(addr, value)
    await chains.bitcoinWithNode.client.chain.generateBlock(1)
    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })
}

function testBatchTransaction (chain) {
  it('Sent value to 2 addresses', async () => {
    const addr1 = (await chain.client.wallet.getUnusedAddress()).address
    let addr2 = (await chain.client.wallet.getUnusedAddress()).address
    if (addr2 === addr1) { // Workaround for allowing test to work for ledger
      addr2 = (await chain.client.wallet.getAddresses())[0].address
    }
    const value = config[chain.name].value

    const bal1Before = await chain.client.chain.getBalance(addr1)
    const bal2Before = await chain.client.chain.getBalance(addr2)
    await chain.client.chain.sendBatchTransaction([{ to: addr1, value }, { to: addr2, value }])
    await chains.bitcoinWithNode.client.chain.generateBlock(1)
    const bal1After = await chain.client.chain.getBalance(addr1)
    const bal2After = await chain.client.chain.getBalance(addr2)

    expect(bal1Before.plus(value).toString()).to.equal(bal1After.toString())
    expect(bal2Before.plus(value).toString()).to.equal(bal2After.toString())
  })
}

describe('Send Transactions', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Ledger', () => {
    testTransaction(chains.bitcoinWithLedger)
  })
})

describe('Send Batch Transactions', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Ledger', () => {
    testBatchTransaction(chains.bitcoinWithLedger)
  })

  describe('Bitcoin - Node', () => {
    testBatchTransaction(chains.bitcoinWithNode)
  })
})
