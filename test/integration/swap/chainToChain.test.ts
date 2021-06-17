/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as crypto from '../../../packages/crypto/lib'
import {
  Chain,
  chains,
  initiateAndVerify,
  claimAndVerify,
  getSwapParams,
  connectMetaMask,
  fundWallet,
  importBitcoinAddresses,
  describeExternal,
  TEST_TIMEOUT
} from '../common'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

async function testSwap(chain1: Chain, chain2: Chain) {
  if (process.env.RUN_EXTERNAL) console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
  const secret = await chain1.client.swap.generateSecret('test')
  const secretHash = crypto.sha256(secret)

  const chain1SwapParams = await getSwapParams(chain1, secretHash)
  const chain2SwapParams = await getSwapParams(chain2, secretHash)

  const chain1InitiationTxId = await initiateAndVerify(chain1, chain1SwapParams)
  const chain2InitiationTxId = await initiateAndVerify(chain2, chain2SwapParams)
  const claimTx = await claimAndVerify(chain1, chain1InitiationTxId, secret, chain1SwapParams)
  const revealedSecret = claimTx.secret
  expect(revealedSecret).to.equal(secret)
  await claimAndVerify(chain2, chain2InitiationTxId, revealedSecret, chain2SwapParams)
}

describe('Swap Chain to Chain', function () {
  this.timeout(TEST_TIMEOUT)

  describeExternal('Ledger to Node', function () {
    before(async () => {
      await importBitcoinAddresses(chains.bitcoinWithLedger)
      await fundWallet(chains.bitcoinWithLedger)
    })

    it('BTC (Ledger) - BTC (Node)', async () => {
      await testSwap(chains.bitcoinWithLedger, chains.bitcoinWithNode)
    })

    it('BTC (Node) - BTC (Ledger)', async () => {
      await testSwap(chains.bitcoinWithNode, chains.bitcoinWithLedger)
    })

    it('BCH (Ledger) - BCH (Node)', async () => {
      await testSwap(chains.bitcoinCashWithLedger, chains.bitcoinCashWithNode)
    })

    it('BCH (Node) - BCH (Ledger)', async () => {
      await testSwap(chains.bitcoinCashWithNode, chains.bitcoinCashWithLedger)
    })
  })

  describeExternal('Ledger to MetaMask', function () {
    connectMetaMask()

    before(async () => {
      await importBitcoinAddresses(chains.bitcoinWithLedger)
      await fundWallet(chains.bitcoinWithLedger)
      await fundWallet(chains.ethereumWithMetaMask)
    })

    it('BTC (Ledger) - ETH (MetaMask)', async () => {
      await testSwap(chains.bitcoinWithLedger, chains.ethereumWithMetaMask)
    })

    it('ETH (MetaMask) - BTC (Ledger)', async () => {
      await testSwap(chains.ethereumWithMetaMask, chains.bitcoinWithLedger)
    })
  })

  describe('Node to Node', function () {
    it('ETH (Node) - BCH (Node)', async () => {
      await testSwap(chains.ethereumWithNode, chains.bitcoinCashWithNode)
    })

    it('BTC (Node) - ETH (Node)', async () => {
      await testSwap(chains.bitcoinWithNode, chains.ethereumWithNode)
    })

    it('ETH (Node) - BTC (Node)', async () => {
      await testSwap(chains.ethereumWithNode, chains.bitcoinWithNode)
    })

    it('BCH (Node) - BTC (Node)', async () => {
      await testSwap(chains.bitcoinCashWithNode, chains.bitcoinWithNode)
    })
  })

  describe('JS to JS', function () {
    before(async () => {
      await importBitcoinAddresses(chains.bitcoinWithJs)
      await importBitcoinAddresses(chains.bitcoinCashWithJs)
      await fundWallet(chains.ethereumWithJs)
      await fundWallet(chains.bitcoinWithJs)
      await fundWallet(chains.bitcoinCashWithJs)
    })

    it('BTC (JS) - ETH (JS)', async () => {
      await testSwap(chains.bitcoinWithJs, chains.ethereumWithJs)
    })

    it('ETH (JS) - BTC (JS)', async () => {
      await testSwap(chains.ethereumWithJs, chains.bitcoinWithJs)
    })

    it('ETH (JS) - BCH (JS)', async () => {
      await testSwap(chains.ethereumWithJs, chains.bitcoinCashWithJs)
    })
  })
})
