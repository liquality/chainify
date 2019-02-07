/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { crypto } from '../../../src'
import { chains, metaMaskConnector, initiateAndVerify, claimAndVerify, getSwapParams } from './common'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)

async function testSwap (chain1, chain2) {
  console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
  const secret = await chain1.client.generateSecret('test')
  const secretHash = crypto.sha256(secret)

  const chain1SwapParams = await getSwapParams(chain1)
  const chain2SwapParams = await getSwapParams(chain2)

  const chain1InitiationTxId = await initiateAndVerify(chain1, secretHash, chain1SwapParams)
  const chain2InitiationTxId = await initiateAndVerify(chain2, secretHash, chain2SwapParams)
  const revealedSecret = await claimAndVerify(chain1, chain1InitiationTxId, secret, chain1SwapParams)
  expect(revealedSecret).to.equal(secret)
  await claimAndVerify(chain2, chain2InitiationTxId, revealedSecret, chain2SwapParams)
}

describe('Swap Chain to Chain', function () {
  this.timeout(120000)

  describe('Ledger to MetaMask', function () {
    let interval

    before(async () => {
      console.log('\x1b[36m', 'Starting MetaMask connector on http://localhost:3333 - Open in browser to continue', '\x1b[0m')
      await metaMaskConnector.start()
      interval = setInterval(() => {
        chains.bitcoinWithNode.client.generateBlock(1)
      }, 1000)
    })

    after(async () => {
      await metaMaskConnector.stop()
      clearInterval(interval)
    })

    it('BTC (Ledger) - ETH (MetaMask)', async () => {
      await testSwap(chains.bitcoinWithLedger, chains.ethereumWithMetaMask)
    })

    it('ETH (MetaMask) - BTC (Ledger)', async () => {
      await testSwap(chains.ethereumWithMetaMask, chains.bitcoinWithLedger)
    })
  })

  describe('Node to Node', function () {
    let interval

    before(async () => {
      interval = setInterval(() => {
        chains.bitcoinWithNode.client.generateBlock(1)
      }, 1000)
    })

    after(async () => {
      clearInterval(interval)
    })

    it('BTC (Node) - ETH (Node)', async () => {
      await testSwap(chains.bitcoinWithNode, chains.ethereumWithNode)
    })

    it('ETH (Node) - BTC (Node)', async () => {
      await testSwap(chains.ethereumWithNode, chains.bitcoinWithNode)
    })
  })
})
