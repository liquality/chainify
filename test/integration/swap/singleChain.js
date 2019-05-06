/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import BigNumber from 'bignumber.js'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import _ from 'lodash'
import { crypto, providers } from '../../../packages/bundle/lib'
import { chains, initiateAndVerify, claimAndVerify, refund, getSwapParams, expectBalance, sleep, mineBitcoinBlocks, deployERC20Token, connectMetaMask } from './common'
import config from './config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

const { calculateFee } = providers.bitcoin.BitcoinUtils
const mockSecret = _.repeat('ff', 32)

function testSingle (chain) {
  it('Generated secrets are different', async () => {
    const secret1 = await chain.client.swap.generateSecret('secret1')
    const secret2 = await chain.client.swap.generateSecret('secret2')
    expect(secret1).to.not.equal(secret2)
  })

  it('Initiate and claim - happy route', async () => {
    console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    let claimTx
    await expectBalance(chain, swapParams.recipientAddress,
      async () => { claimTx = await claimAndVerify(chain, initiationTxId, secret, swapParams) },
      (before, after) => expect(after).to.be.bignumber.greaterThan(before))
    const revealedSecret = claimTx.secret
    expect(revealedSecret).to.equal(secret)
  })

  it('Claim only works using correct secret', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    const wrongSecret = crypto.sha256('0')
    const emptySecret = ''
    await expect(claimAndVerify(chain, initiationTxId, wrongSecret, swapParams)).to.be.rejected
    await expect(claimAndVerify(chain, initiationTxId, emptySecret, swapParams)).to.be.rejected
    const claimTx = await claimAndVerify(chain, initiationTxId, mockSecret, swapParams)
    const revealedSecret = claimTx.secret
    expect(revealedSecret).to.equal(mockSecret)
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
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expectBalance(chain, swapParams.refundAddress,
      async () => {
        await sleep(20000)
        await refund(chain, initiationTxId, secretHash, swapParams)
      },
      (before, after) => expect(after).to.be.bignumber.greaterThan(before))
  })

  it('Refund fails after claim', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expectBalance(chain, swapParams.recipientAddress,
      async () => claimAndVerify(chain, initiationTxId, mockSecret, swapParams),
      (before, after) => expect(after).to.be.bignumber.greaterThan(before))
    await expectBalance(chain, swapParams.refundAddress,
      async () => {
        try { await refund(chain, initiationTxId, secretHash, swapParams) } catch (e) {} // Refund failing is ok
      },
      (before, after) => expect(after).to.be.bignumber.equal(before))
    await sleep(20000)
    await expectBalance(chain, swapParams.refundAddress,
      async () => {
        try { await refund(chain, initiationTxId, secretHash, swapParams) } catch (e) {} // Refund failing is ok
      },
      (before, after) => expect(after).to.be.bignumber.equal(before))
  })

  it('Refund available after expiration', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expect(refund(chain, initiationTxId, secretHash, swapParams)).to.be.rejected
    await sleep(20000)
    await refund(chain, initiationTxId, secretHash, swapParams)
  })
}

function testEthereumBalance (chain) {
  it('Claim', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expectBalance(chain, swapParams.recipientAddress,
      async () => { await claimAndVerify(chain, initiationTxId, mockSecret, swapParams) },
      (before, after) => {
        const expectedBalance = BigNumber(before).plus(BigNumber(swapParams.value))
        expect(after.toString()).to.be.bignumber.equal(expectedBalance)
      })
  })

  it('Refund', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await sleep(20000)
    await expectBalance(chain, swapParams.refundAddress,
      async () => refund(chain, initiationTxId, secretHash, swapParams),
      (before, after) => {
        const expectedBalance = BigNumber(before).plus(BigNumber(swapParams.value))
        expect(after).to.be.bignumber.equal(expectedBalance)
      })
  })
}

function testBitcoinBalance (chain) {
  it('Claim', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    const fee = calculateFee(1, 1, 3)
    await expectBalance(chain, swapParams.recipientAddress,
      async () => { await claimAndVerify(chain, initiationTxId, mockSecret, swapParams) },
      (before, after) => {
        const expectedBalance = BigNumber(before).plus(BigNumber(swapParams.value)).minus(BigNumber(fee))
        expect(after).to.be.bignumber.equal(expectedBalance)
      })
  })

  it('Refund', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    const fee = calculateFee(1, 1, 3)
    await sleep(20000)
    await expectBalance(chain, swapParams.refundAddress,
      async () => refund(chain, initiationTxId, secretHash, swapParams),
      (before, after) => {
        const expectedBalance = BigNumber(before).plus(BigNumber(swapParams.value)).minus(BigNumber(fee))
        expect(after).to.be.bignumber.equal(expectedBalance)
      })
  })
}

describe('Swap Single Chain Flow', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - Ledger', () => {
    mineBitcoinBlocks()
    testSingle(chains.bitcoinWithLedger)
  })

  describe('Bitcoin - Node', () => {
    mineBitcoinBlocks()
    testSingle(chains.bitcoinWithNode)
  })

  describe('Ethereum - MetaMask', () => {
    connectMetaMask()
    testSingle(chains.ethereumWithMetaMask)
  })

  describe('Ethereum - Node', () => {
    testSingle(chains.ethereumWithNode)
  })

  describe('Ethereum - Ledger', () => {
    testSingle(chains.ethereumWithLedger)
  })

  describe('ERC20 - MetaMask', () => {
    connectMetaMask(chains.erc20WithMetaMask.client)
    deployERC20Token(chains.erc20WithMetaMask.client)
    testSingle(chains.erc20WithMetaMask)
  })

  describe('ERC20 - Node', async () => {
    deployERC20Token(chains.erc20WithNode.client)
    testSingle(chains.erc20WithNode)
  })

  describe('ERC20 - Ledger', () => {
    testSingle(chains.erc20WithLedger)
  })

  describe('Ethereum - Balance', () => {
    describe('Ledger', () => {
      testEthereumBalance(chains.ethereumWithLedger)
    })
    describe('MetaMask', () => {
      connectMetaMask()
      testEthereumBalance(chains.ethereumWithMetaMask)
    })
    describe('Node', () => {
      testEthereumBalance(chains.ethereumWithNode)
    })
  })

  describe('Bitcoin - Balance', () => {
    mineBitcoinBlocks()
    describe('Ledger', () => {
      testBitcoinBalance(chains.bitcoinWithLedger)
    })
    describe('Node', () => {
      testBitcoinBalance(chains.bitcoinWithNode)
    })
  })
})
