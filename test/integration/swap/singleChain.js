/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import BigNumber from 'bignumber.js'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import _ from 'lodash'
import { crypto, providers } from '../../../packages/bundle/lib'
import { chains, initiateAndVerify, claimAndVerify, refundAndVerify, getSwapParams, expectBalance, deployERC20Token, connectMetaMask, fundWallet, importBitcoinAddresses, stopEthAutoMining, mineUntilTimestamp, CONSTANTS, describeExternal, mineBlock, expectFee } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

const { calculateFee } = providers.bitcoin.BitcoinUtils
const mockSecret = _.repeat('ff', 32)

function testSwap (chain) {
  it('Generated secrets are different', async () => {
    const secret1 = await chain.client.swap.generateSecret('secret1')
    const secret2 = await chain.client.swap.generateSecret('secret2')
    expect(secret1).to.not.equal(secret2)
  })

  it('Initiate and claim - happy route', async () => {
    if (process.env.RUN_EXTERNAL) console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
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
  it('Balance - Claim', async () => {
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

  it('Balance - Refund', async () => {
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
  it('Balance - Claim', async () => {
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

  it('Balance - Refund', async () => {
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

function testFee (chain) {
  describe('Set Fee', () => {
    it('Initiate & Claim', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain)
      const expectedFee = 25
      const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams, expectedFee)
      await expectFee(chain, initiationTxId, expectedFee, true)
      const claimTx = await claimAndVerify(chain, initiationTxId, mockSecret, swapParams, expectedFee)
      await expectFee(chain, claimTx.hash, expectedFee, false, true)
    })

    it('Initiate & Refund', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain)
      swapParams.expiration = parseInt(Date.now() / 1000)
      const expectedFee = 25
      const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams, expectedFee)
      await expectFee(chain, initiationTxId, expectedFee, true)
      await mineUntilTimestamp(chain, swapParams.expiration)
      const refundTx = await refundAndVerify(chain, initiationTxId, secretHash, swapParams, expectedFee)
      await expectFee(chain, refundTx.hash, expectedFee, false, true)
    })
  })

  ;(chain.client.wallet.canUpdateFee ? describe : describe.skip)('Update Fee', () => {
    if (!chain.id.includes('ERC20')) { // ERC20 initiation cannot be fee bumped
      it('Initiate', async () => {
        const secretHash = crypto.sha256(mockSecret)
        const swapParams = await getSwapParams(chain)
        const initiationParams = [swapParams.value, swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration]
        const initiationTxId = await chain.client.swap.initiateSwap(...initiationParams, 25)
        const expectedFee = 50
        const newInitiateTxId = await chain.client.chain.updateTransactionFee(initiationTxId, expectedFee)
        await expectFee(chain, newInitiateTxId, expectedFee, true)
      })
    }

    it('Claim', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain)
      const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
      await mineBlock(chain)
      const claimTxId = await chain.client.swap.claimSwap(initiationTxId, swapParams.recipientAddress, swapParams.refundAddress, mockSecret, swapParams.expiration, 25)
      const expectedFee = 50
      const newClaimTxId = await chain.client.chain.updateTransactionFee(claimTxId, expectedFee)
      await expectFee(chain, newClaimTxId, expectedFee, false, true)
    })

    it('Refund', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain)
      swapParams.expiration = parseInt(Date.now() / 1000)
      const initiationTxId = await initiateAndVerify(chain, secretHash, swapParams)
      await mineBlock(chain)
      await mineUntilTimestamp(chain, swapParams.expiration)
      const refundTxId = await chain.client.swap.refundSwap(initiationTxId, swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration, 25)
      const expectedFee = 50
      const newRefundTxId = await chain.client.chain.updateTransactionFee(refundTxId, expectedFee)
      await expectFee(chain, newRefundTxId, expectedFee, false, true)
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
    testSwap(chains.bitcoinWithLedger)
    testBitcoinBalance(chains.bitcoinWithLedger)
    testFee(chains.bitcoinWithLedger)
  })

  describe('Bitcoin - Node', () => {
    testSwap(chains.bitcoinWithNode)
    testBitcoinBalance(chains.bitcoinWithNode)
    testFee(chains.bitcoinWithNode)
  })

  describe('Bitcoin - Js', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithJs)
      await fundWallet(chains.bitcoinWithJs)
    })
    testSwap(chains.bitcoinWithJs)
    testBitcoinBalance(chains.bitcoinWithJs)
    testFee(chains.bitcoinWithJs)
  })

  describe('Ethereum', () => {
    stopEthAutoMining(chains.ethereumWithNode)

    describeExternal('Ethereum - MetaMask', () => {
      connectMetaMask()
      before(async function () {
        await fundWallet(chains.ethereumWithMetaMask)
      })
      testSwap(chains.ethereumWithMetaMask)
      testEthereumBalance(chains.ethereumWithMetaMask)
      testFee(chains.ethereumWithMetaMask)
    })

    describe('Ethereum - Node', () => {
      testSwap(chains.ethereumWithNode)
      testEthereumBalance(chains.ethereumWithNode)
      testFee(chains.ethereumWithNode)
    })

    describeExternal('Ethereum - Ledger', () => {
      before(async function () {
        await fundWallet(chains.ethereumWithLedger)
      })
      testSwap(chains.ethereumWithLedger)
      testEthereumBalance(chains.ethereumWithLedger)
      testFee(chains.ethereumWithLedger)
    })

    describe('Ethereum - Js', () => {
      before(async function () {
        await fundWallet(chains.ethereumWithJs)
      })
      testSwap(chains.ethereumWithJs)
      testEthereumBalance(chains.ethereumWithJs)
      testFee(chains.ethereumWithJs)
    })

    describeExternal('ERC20 - MetaMask', () => {
      connectMetaMask()
      before(async function () {
        await fundWallet(chains.erc20WithMetaMask)
        await deployERC20Token(chains.erc20WithMetaMask)
      })

      testSwap(chains.erc20WithMetaMask)
      testEthereumBalance(chains.erc20WithMetaMask)
      testFee(chains.erc20WithMetaMask)
    })

    describe('ERC20 - Node', async () => {
      before(async function () {
        await deployERC20Token(chains.erc20WithNode)
      })

      testSwap(chains.erc20WithNode)
      testEthereumBalance(chains.erc20WithNode)
      testFee(chains.erc20WithNode)
    })

    describeExternal('ERC20 - Ledger', () => {
      before(async function () {
        await fundWallet(chains.erc20WithLedger)
        await deployERC20Token(chains.erc20WithLedger)
      })
      testSwap(chains.erc20WithLedger)
      testEthereumBalance(chains.erc20WithLedger)
      testFee(chains.erc20WithLedger)
    })

    describeExternal('ERC20 - JS', () => {
      before(async function () {
        await fundWallet(chains.erc20WithJs)
        await deployERC20Token(chains.erc20WithJs)
      })
      testSwap(chains.erc20WithJs)
      testEthereumBalance(chains.erc20WithJs)
      testFee(chains.erc20WithJs)
    })
  })
})
