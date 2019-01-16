/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { crypto } from '../../../src'
import { chains, metaMaskConnector, initiateAndVerify, claimAndVerify, getSwapParams } from './common'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)

async function testSingle (id, chain) {
  console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
  const secret = await chain.generateSecret('test')
  const secretHash = crypto.sha256(secret)
  const swapParams = await getSwapParams(id, chain)

  const initiationTxId = await initiateAndVerify(chain, id, secretHash, swapParams)
  const revealedSecret = await claimAndVerify(chain, id, initiationTxId, secret, swapParams)
  expect(revealedSecret).to.equal(secret)
}

describe('Swap Single Chain Flow', function () {
  this.timeout(120000)

  it('Bitcoin - Ledger', async () => {
    await testSingle('BitcoinLedger', chains.bitcoinWithLedger)
  })

  it('Bitcoin - Node', async () => {
    const interval = setInterval(() => {
      chains.bitcoinWithNode.generateBlock(1)
    }, 1000)
    await testSingle('BitcoinNode', chains.bitcoinWithNode)
    clearInterval(interval)
  })

  it('Ethereum - MetaMask', async () => {
    console.log('\x1b[36m', 'Starting MetaMask connector on http://localhost:3333 - Open in browser to continue', '\x1b[0m')
    await metaMaskConnector.start()
    await testSingle('EthereumMetaMask', chains.ethereumWithMetaMask)
    await metaMaskConnector.stop()
  })

  it('Ethereum - Node', async () => {
    await testSingle('EthereumNode', chains.ethereumWithNode)
  })
})
