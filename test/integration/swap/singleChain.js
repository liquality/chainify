/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { crypto } from '../../../src'
import { chains, metaMaskConnector, initiateAndVerify, claimAndVerify, getSwapParams } from './common'
import config from './config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)

async function initiateAndClaim (chain) {
  console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
  const secret = await chain.client.generateSecret('test')
  const secretHash = crypto.sha256(secret)
  const swapParams = await getSwapParams(chain)
  const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
  const balanceBeforeClaim = await chain.client.getBalance([swapParams.recipientAddress])
  const revealedSecret = await claimAndVerify(chain, initiationTxId, secret, swapParams)
  const balanceAfterClaim = await chain.client.getBalance([swapParams.recipientAddress])
  expect(balanceAfterClaim).to.greaterThan(balanceBeforeClaim)
  expect(revealedSecret).to.equal(secret)
}

function testSingle (chain) {
  it('Initiate and claim - happy route', async () => initiateAndClaim(chain))
}

describe.only('Swap Single Chain Flow', function () {
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

  describe.only('Ethereum - MetaMask', () => {
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
