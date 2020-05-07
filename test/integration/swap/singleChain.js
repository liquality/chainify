/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import BigNumber from 'bignumber.js'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import _ from 'lodash'
import { crypto, providers } from '../../../packages/bundle/lib'
import { chains, initiateAndVerify, claimAndVerify, refundAndVerify, getSwapParams, expectBalance, deployERC20Token, connectMetaMask, fundWallet, importBitcoinAddresses, stopEthAutoMining, mineUntilTimestamp, CONSTANTS, describeExternal } from '../common'
import config from '../config'

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
    swapParams.expiration = parseInt(Date.now() / 1000)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expectBalance(chain, swapParams.refundAddress,
      async () => {
        await mineUntilTimestamp(chain, swapParams.expiration)
        await refundAndVerify(chain, initiationTxId, secretHash, swapParams)
      },
      (before, after) => expect(after).to.be.bignumber.greaterThan(before))
  })

  it('Refund fails after claim', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000)
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expectBalance(chain, swapParams.recipientAddress,
      async () => claimAndVerify(chain, initiationTxId, mockSecret, swapParams),
      (before, after) => expect(after).to.be.bignumber.greaterThan(before))
    await expectBalance(chain, swapParams.refundAddress,
      async () => {
        try { await refundAndVerify(chain, initiationTxId, secretHash, swapParams) } catch (e) {} // Refund failing is ok
      },
      (before, after) => expect(after).to.be.bignumber.equal(before))
    await mineUntilTimestamp(chain, swapParams.expiration)
    await expectBalance(chain, swapParams.refundAddress,
      async () => {
        try { await refundAndVerify(chain, initiationTxId, secretHash, swapParams) } catch (e) {} // Refund failing is ok
      },
      (before, after) => expect(after).to.be.bignumber.equal(before))
  })

  it('Refund available after expiration', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain)
    swapParams.expiration = parseInt(Date.now() / 1000) + 10
    const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
    await expect(refundAndVerify(chain, initiationTxId, secretHash, swapParams)).to.be.rejected
    await mineUntilTimestamp(chain, swapParams.expiration)
    await refundAndVerify(chain, initiationTxId, secretHash, swapParams)
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
    await mineUntilTimestamp(chain, swapParams.expiration)
    await expectBalance(chain, swapParams.refundAddress,
      async () => refundAndVerify(chain, initiationTxId, secretHash, swapParams),
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
    const fee = calculateFee(1, 1, CONSTANTS.BITCOIN_FEE_PER_BYTE)
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
    const fee = calculateFee(1, 1, CONSTANTS.BITCOIN_FEE_PER_BYTE)
    await mineUntilTimestamp(chain, swapParams.expiration)
    await expectBalance(chain, swapParams.refundAddress,
      async () => refundAndVerify(chain, initiationTxId, secretHash, swapParams),
      (before, after) => {
        const expectedBalance = BigNumber(before).plus(BigNumber(swapParams.value)).minus(BigNumber(fee))
        expect(after).to.be.bignumber.equal(expectedBalance)
      })
  })
}

describe('Swap Single Chain Flow', function () {
  this.timeout(config.timeout)

  describeExternal('Bitcoin - Ledger', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithLedger)
      await fundWallet(chains.bitcoinWithLedger)
    })
    testSingle(chains.bitcoinWithLedger)
  })

  describe('Bitcoin - Node', () => {
    testSingle(chains.bitcoinWithNode)
  })

  describe('Bitcoin - Js', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithJs)
      await fundWallet(chains.bitcoinWithJs)
    })
    testSingle(chains.bitcoinWithJs)
  })

  describeExternal('Ethereum - MetaMask', () => {
    connectMetaMask()
    stopEthAutoMining(chains.ethereumWithMetaMask)
    before(async function () {
      await fundWallet(chains.ethereumWithMetaMask)
    })
    testSingle(chains.ethereumWithMetaMask)
  })

  describe('Ethereum - Node', () => {
    stopEthAutoMining(chains.ethereumWithNode)
    testSingle(chains.ethereumWithNode)
  })

  describeExternal('Ethereum - Ledger', () => {
    stopEthAutoMining(chains.ethereumWithLedger)
    before(async function () {
      await fundWallet(chains.ethereumWithLedger)
    })
    testSingle(chains.ethereumWithLedger)
  })

  describe('Ethereum - Js', () => {
    stopEthAutoMining(chains.ethereumWithJs)
    before(async function () {
      await fundWallet(chains.ethereumWithJs)
    })
    testSingle(chains.ethereumWithJs)
  })

  describeExternal('ERC20 - MetaMask', () => {
    connectMetaMask(chains.erc20WithMetaMask.client)
    before(async function () {
      await fundWallet(chains.erc20WithMetaMask)
    })
    deployERC20Token(chains.erc20WithMetaMask.client)
    stopEthAutoMining(chains.erc20WithMetaMask)
    testSingle(chains.erc20WithMetaMask)
  })

  describe('ERC20 - Node', async () => {
    deployERC20Token(chains.erc20WithNode)
    stopEthAutoMining(chains.erc20WithNode)
    testSingle(chains.erc20WithNode)
  })

  describeExternal('ERC20 - Ledger', () => {
    stopEthAutoMining(chains.erc20WithLedger)
    before(async function () {
      await fundWallet(chains.erc20WithLedger)
    })
    testSingle(chains.erc20WithLedger)
  })

  describe('Ethereum - Balance', () => {
    describeExternal('Ledger', () => {
      stopEthAutoMining(chains.ethereumWithLedger)
      before(async function () {
        await fundWallet(chains.ethereumWithLedger)
      })
      testEthereumBalance(chains.ethereumWithLedger)
    })
    describeExternal('MetaMask', () => {
      connectMetaMask()
      stopEthAutoMining(chains.ethereumWithMetaMask)
      before(async function () {
        await fundWallet(chains.ethereumWithMetaMask)
      })
      testEthereumBalance(chains.ethereumWithMetaMask)
    })
    describe('Node', () => {
      stopEthAutoMining(chains.ethereumWithNode)
      testEthereumBalance(chains.ethereumWithNode)
    })

    describe('JS', () => {
      stopEthAutoMining(chains.ethereumWithJs)
      before(async function () {
        await fundWallet(chains.ethereumWithJs)
      })
      testEthereumBalance(chains.ethereumWithJs)
    })
  })

  describe('Bitcoin - Balance', () => {
    describeExternal('Ledger', () => {
      before(async function () {
        await importBitcoinAddresses(chains.bitcoinWithLedger)
        await fundWallet(chains.bitcoinWithLedger)
      })
      testBitcoinBalance(chains.bitcoinWithLedger)
    })

    describe('Node', () => {
      testBitcoinBalance(chains.bitcoinWithNode)
    })

    describe('JS', () => {
      before(async function () {
        await importBitcoinAddresses(chains.bitcoinWithJs)
        await fundWallet(chains.bitcoinWithJs)
      })
      testBitcoinBalance(chains.bitcoinWithJs)
    })
  })
})
