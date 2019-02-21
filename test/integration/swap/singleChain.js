/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import _ from 'lodash'
import { crypto } from '../../../src'
import { chains, metaMaskConnector, initiateAndVerify, claimAndVerify, refund, getSwapParams, expectBalance } from './common'
import config from './config'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)

function testSingle (chain) {
  it('Initiate and claim - happy route', async () => {
    console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
    const secret = await chain.client.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    let revealedSecret
    await expectBalance(chain, swapParams.recipientAddress,
      async () => { revealedSecret = await claimAndVerify(chain, initiationTxId, secret, swapParams) },
      (before, after) => expect(after).to.be.greaterThan(before))
    expect(revealedSecret).to.equal(secret)
  })

  it('Claim only works using correct secret', async () => {
    console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
    const secret = await chain.client.generateSecret('mysecret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    const wrongSecret = crypto.sha256('0')
    const emptySecret = ''
    await expect(claimAndVerify(chain, initiationTxId, wrongSecret, swapParams)).to.be.rejected
    await expect(claimAndVerify(chain, initiationTxId, emptySecret, swapParams)).to.be.rejected
    const revealedSecret = await claimAndVerify(chain, initiationTxId, secret, swapParams)
    expect(revealedSecret).to.equal(secret)
  })

  it('Claim fails with secret longer than 32 bytes', async () => {
    const secret = _.repeat('ff', 33)
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expect(claimAndVerify(chain, initiationTxId, secret, swapParams)).to.be.rejected
  })

  it('Claim fails with secret shorter than 32 bytes', async () => {
    const secret = _.repeat('ff', 31)
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expect(claimAndVerify(chain, initiationTxId, secret, swapParams)).to.be.rejected
  })

  it('Initiate and Refund', async () => {
    console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
    const secret = await chain.client.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expectBalance(chain, swapParams.refundAddress,
      async () => {
        await sleep(20000)
        await refund(chain, initiationTxId, secretHash, swapParams)
      },
      (before, after) => expect(after).to.be.greaterThan(before))
  })

  it('Refund fails after claim', async () => {
    console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
    const secret = await chain.client.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expectBalance(chain, swapParams.refundAddress,
      async () => claimAndVerify(chain, initiationTxId, secret, swapParams),
      (before, after) => expect(after).to.be.greaterThan(before))
    await expectBalance(chain, swapParams.refundAddress,
      async () => refund(chain, initiationTxId, secretHash, swapParams),
      (before, after) => expect(after).to.be.at.most(before))
    await sleep(20000)
    await expectBalance(chain, swapParams.refundAddress,
      async () => refund(chain, initiationTxId, secretHash, swapParams),
      (before, after) => expect(after).to.be.at.most(before))
  })

  it('Refund available after expiration', async () => {
    console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
    const secret = await chain.client.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expect(refund(chain, initiationTxId, secretHash, swapParams)).to.be.rejected
    await sleep(20000)
    await refund(chain, initiationTxId, secretHash, swapParams)
  })
}

describe('Swap Single Chain Flow', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Ledger', () => {
    testSingle(chains.bitcoinWithLedger)
  })

  describe('Bitcoin - Node', () => {
    let interval
    if (config.bitcoin.mineBlocks) {
      before(async () => {
        interval = setInterval(() => {
          chains.bitcoinWithNode.client.generateBlock(1)
        }, 1000)
      })
    }

    testSingle(chains.bitcoinWithNode)

    if (config.bitcoin.mineBlocks) {
      after(() => clearInterval(interval))
    }
  })

  describe('Ethereum - MetaMask', () => {
    before(async () => {
      console.log('\x1b[36m', 'Starting MetaMask connector on http://localhost:3333 - Open in browser to continue', '\x1b[0m')
      await metaMaskConnector.start()
    })
    testSingle(chains.ethereumWithMetaMask)
    after(async () => metaMaskConnector.stop())
  })

  describe.only('Ethereum - Node', () => {
    testSingle(chains.ethereumWithNode)
  })
})
