/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { crypto } from '../../../packages/bundle/lib'
import { chains, initiateAndVerify, claimAndVerify, getSwapParams, mineBitcoinBlocks, connectMetaMask } from './common'
import config from './config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)

async function testSwap (chain1, chain2) {
  console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
  const secret = await chain1.client.swap.generateSecret('test')
  const secretHash = crypto.sha256(secret)

  const chain1SwapParams = await getSwapParams(chain1)
  const chain2SwapParams = await getSwapParams(chain2)

  const chain1InitiationTxId = await initiateAndVerify(chain1, secretHash, chain1SwapParams)
  const chain2InitiationTxId = await initiateAndVerify(chain2, secretHash, chain2SwapParams)
  const claimTx = await claimAndVerify(chain1, chain1InitiationTxId, secret, chain1SwapParams)
  const revealedSecret = claimTx.secret
  expect(revealedSecret).to.equal(secret)
  await claimAndVerify(chain2, chain2InitiationTxId, revealedSecret, chain2SwapParams)
}

describe('Swap Chain to Chain', function () {
  this.timeout(config.timeout)

  describe('Ledger to MetaMask', function () {
    mineBitcoinBlocks()
    connectMetaMask()

    it('BTC (Ledger) - ETH (MetaMask)', async () => {
      await testSwap(chains.bitcoinWithLedger, chains.ethereumWithMetaMask)
    })

    it('ETH (MetaMask) - BTC (Ledger)', async () => {
      await testSwap(chains.ethereumWithMetaMask, chains.bitcoinWithLedger)
    })
  })

  describe('Node to Node', function () {
    mineBitcoinBlocks()

    it('BTC (Node) - ETH (Node)', async () => {
      await testSwap(chains.bitcoinWithNode, chains.ethereumWithNode)
    })

    it('ETH (Node) - BTC (Node)', async () => {
      await testSwap(chains.ethereumWithNode, chains.bitcoinWithNode)
    })
  })
})
