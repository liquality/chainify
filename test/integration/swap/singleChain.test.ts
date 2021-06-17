/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import _ from 'lodash'
import * as crypto from '../../../packages/crypto/lib'
import * as BitcoinUtils from '../../../packages/bitcoin-utils/lib'
import {
  Chain,
  chains,
  initiateAndVerify,
  claimAndVerify,
  refundAndVerify,
  getSwapParams,
  expectBalance,
  deployERC20Token,
  connectMetaMask,
  fundWallet,
  importBitcoinAddresses,
  clearEthMiner,
  mineUntilTimestamp,
  CONSTANTS,
  describeExternal,
  mineBlock,
  expectFee,
  TEST_TIMEOUT
} from '../common'
import { Transaction, BigNumber } from '../../../packages/types/lib'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

chai.use(chaiAsPromised)

const mockSecret = _.repeat('ff', 32)

function testSwap(chain: Chain) {
  it('Generated secrets are different', async () => {
    const secret1 = await chain.client.swap.generateSecret('secret1')
    const secret2 = await chain.client.swap.generateSecret('secret2')
    expect(secret1).to.not.equal(secret2)
  })

  it('Initiate and claim - happy route', async () => {
    if (process.env.RUN_EXTERNAL) console.log('\x1b[33m', `Generating secret: Watch for prompt`, '\x1b[0m')
    const secret = await chain.client.swap.generateSecret('secret')
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    let claimTx: Transaction
    await expectBalance(
      chain,
      swapParams.recipientAddress,
      async () => {
        claimTx = await claimAndVerify(chain, initiationTxId, secret, swapParams)
      },
      (before, after) => expect(after.gt(before)).to.be.true
    )
    const revealedSecret = claimTx.secret
    expect(revealedSecret).to.equal(secret)
  })

  it('Claim only works using correct secret', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain, secretHash)
    const initiationTxId = await initiateAndVerify(chain, swapParams)
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
    const swapParams = await getSwapParams(chain, secretHash)
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    await expect(claimAndVerify(chain, initiationTxId, secret, swapParams)).to.be.rejected
  })

  it('Claim fails with secret shorter than 32 bytes', async () => {
    const secret = _.repeat('ff', 31)
    const secretHash = crypto.sha256(secret)
    const swapParams = await getSwapParams(chain, secretHash)
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    await expect(claimAndVerify(chain, initiationTxId, secret, swapParams)).to.be.rejected
  })

  it('Initiate and Refund', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = Math.floor(Date.now() / 1000)
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    await expectBalance(
      chain,
      swapParams.refundAddress,
      async () => {
        await mineUntilTimestamp(chain, swapParams.expiration)
        await refundAndVerify(chain, initiationTxId, swapParams)
      },
      (before, after) => expect(after.gt(before)).to.be.true
    )
  })

  if (chain.name !== 'near') {
    it('Refund fails after claim', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain, secretHash)
      swapParams.expiration = Math.floor(Date.now() / 1000) // now
      const initiationTxId = await initiateAndVerify(chain, swapParams)
      await expectBalance(
        chain,
        swapParams.recipientAddress,
        async () => claimAndVerify(chain, initiationTxId, mockSecret, swapParams),
        (before, after) => expect(after.gt(before)).to.be.true
      )

      await expectBalance(
        chain,
        swapParams.refundAddress,
        async () => {
          try {
            await refundAndVerify(chain, initiationTxId, swapParams)
            // eslint-disable-next-line no-empty
          } catch (e) {} // Refund failing is ok
        },
        (before, after) => expect(after.eq(before)).to.be.true
      )
      await mineUntilTimestamp(chain, swapParams.expiration)
      await expectBalance(
        chain,
        swapParams.refundAddress,
        async () => {
          try {
            await refundAndVerify(chain, initiationTxId, swapParams)
            // eslint-disable-next-line no-empty
          } catch (__e) {} // Refund failing is ok
        },
        (before, after) => expect(after.eq(before)).to.be.true
      )
    })

    it('Refund available after expiration', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain, secretHash)
      const latestBlock = await chain.client.chain.getBlockByNumber(await chain.client.chain.getBlockHeight())
      swapParams.expiration = latestBlock.timestamp + 10
      const initiationTxId = await initiateAndVerify(chain, swapParams)
      await expect(refundAndVerify(chain, initiationTxId, swapParams)).to.be.rejected
      await mineUntilTimestamp(chain, swapParams.expiration)
      await refundAndVerify(chain, initiationTxId, swapParams)
    })
  }
}

function testEthereumBalance(chain: Chain) {
  it('Balance - Claim', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain, secretHash)
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    await expectBalance(
      chain,
      swapParams.recipientAddress,
      async () => {
        await claimAndVerify(chain, initiationTxId, mockSecret, swapParams)
      },
      (before, after) => {
        const expectedBalance = before.plus(swapParams.value)
        expect(after.eq(expectedBalance)).to.be.true
      }
    )
  })

  it('Balance - Refund', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = Math.floor(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    await mineUntilTimestamp(chain, swapParams.expiration)
    await expectBalance(
      chain,
      swapParams.refundAddress,
      async () => refundAndVerify(chain, initiationTxId, swapParams),
      (before, after) => {
        const expectedBalance = before.plus(swapParams.value)
        expect(after.eq(expectedBalance)).to.be.true
      }
    )
  })
}

function testBitcoinBalance(chain: Chain) {
  it('Balance - Claim', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain, secretHash)
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    const fee = BitcoinUtils.calculateFee(1, 1, CONSTANTS.BITCOIN_FEE_PER_BYTE)
    await expectBalance(
      chain,
      swapParams.recipientAddress,
      async () => {
        await claimAndVerify(chain, initiationTxId, mockSecret, swapParams)
      },
      (before, after) => {
        const expectedBalance = before.plus(swapParams.value).minus(new BigNumber(fee))
        expect(after.eq(expectedBalance)).to.be.true
      }
    )
  })

  it('Balance - Refund', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = Math.floor(Date.now() / 1000) + 20
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    const fee = BitcoinUtils.calculateFee(1, 1, CONSTANTS.BITCOIN_FEE_PER_BYTE)
    await mineUntilTimestamp(chain, swapParams.expiration)
    await expectBalance(
      chain,
      swapParams.refundAddress,
      async () => refundAndVerify(chain, initiationTxId, swapParams),
      (before, after) => {
        const expectedBalance = before.plus(swapParams.value).minus(new BigNumber(fee))
        expect(after.eq(expectedBalance)).to.be.true
      }
    )
  })
}

function testNearRefund(chain: Chain) {
  it('Refund fails after claim', async () => {
    if (chain.name === 'near') {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain, secretHash)
      swapParams.expiration = Math.floor(Date.now() / 1000) + 60

      const initiationTxId = await initiateAndVerify(chain, swapParams)

      await expectBalance(
        chain,
        swapParams.recipientAddress,
        async () => claimAndVerify(chain, initiationTxId, mockSecret, swapParams),
        (before, after) => expect(after.gt(before)).to.be.true
      )

      let fee: BigNumber
      await expectBalance(
        chain,
        swapParams.refundAddress,
        async () => {
          try {
            await refundAndVerify(chain, initiationTxId, swapParams)
          } catch (e) {
            expect(e.type).equal('AccountDoesNotExist')
            fee = new BigNumber(e.transaction_outcome.outcome.tokens_burnt).multipliedBy(2)
          } // Refund failing is ok
        },
        (before, after) => expect(fee ? after.plus(fee).eq(before) : after.eq(before)).to.be.true
      )
    }
  })

  it('Refund available after expiration', async () => {
    const secretHash = crypto.sha256(mockSecret)
    const swapParams = await getSwapParams(chain, secretHash)
    swapParams.expiration = Math.floor(Date.now() / 1000) + 60
    const initiationTxId = await initiateAndVerify(chain, swapParams)
    await expect(refundAndVerify(chain, initiationTxId, swapParams)).to.be.rejected
    await mineBlock(chain, 3)
    await refundAndVerify(chain, initiationTxId, swapParams)
  })
}

function testFee(chain: Chain) {
  describe('Set Fee', () => {
    it('Initiate & Claim', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain, secretHash)
      const expectedFee = 25
      const initiationTxId = await initiateAndVerify(chain, swapParams, expectedFee)
      await expectFee(chain, initiationTxId, expectedFee, true)
      const claimTx = await claimAndVerify(chain, initiationTxId, mockSecret, swapParams, expectedFee)
      await expectFee(chain, claimTx.hash, expectedFee, false, true)
    })

    it('Initiate & Refund', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain, secretHash)
      swapParams.expiration = Math.floor(Date.now() / 1000)
      const expectedFee = 25
      const initiationTxId = await initiateAndVerify(chain, swapParams, expectedFee)
      await expectFee(chain, initiationTxId, expectedFee, true)
      await mineUntilTimestamp(chain, swapParams.expiration)
      const refundTx = await refundAndVerify(chain, initiationTxId, swapParams, expectedFee)
      await expectFee(chain, refundTx.hash, expectedFee, false, true)
    })
  })
  ;(chain.client.wallet.canUpdateFee ? describe : describe.skip)('Update Fee', () => {
    if (!chain.id.includes('ERC20')) {
      // ERC20 initiation cannot be fee bumped
      it('Initiate', async () => {
        const secretHash = crypto.sha256(mockSecret)
        const swapParams = await getSwapParams(chain, secretHash)
        const initiationTx = await chain.client.swap.initiateSwap(swapParams, 25)
        const expectedFee = 50
        const newInitiationTx = await chain.client.chain.updateTransactionFee(initiationTx.hash, expectedFee)
        await expectFee(chain, newInitiationTx.hash, expectedFee, true)
      })
    }

    it('Claim', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain, secretHash)
      const initiationTxId = await initiateAndVerify(chain, swapParams)
      await mineBlock(chain)
      const claimTx = await chain.client.swap.claimSwap(swapParams, initiationTxId, mockSecret, 25)
      const expectedFee = 50
      const newClaimTx = await chain.client.chain.updateTransactionFee(claimTx.hash, expectedFee)
      await expectFee(chain, newClaimTx.hash, expectedFee, false, true)
    })

    it('Refund', async () => {
      const secretHash = crypto.sha256(mockSecret)
      const swapParams = await getSwapParams(chain, secretHash)
      swapParams.expiration = Math.floor(Date.now() / 1000) // now
      const initiationTxId = await initiateAndVerify(chain, swapParams)
      await mineBlock(chain)
      await mineUntilTimestamp(chain, swapParams.expiration)
      const refundTx = await chain.client.swap.refundSwap(swapParams, initiationTxId, 25)
      const expectedFee = 50
      const newRefundTx = await chain.client.chain.updateTransactionFee(refundTx.hash, expectedFee)
      await expectFee(chain, newRefundTx.hash, expectedFee, false, true)
    })
  })
}

describe('Swap Single Chain Flow', function () {
  this.timeout(TEST_TIMEOUT)

  describeExternal('Near - JS', () => {
    testSwap(chains.nearWithJs)
    testNearRefund(chains.nearWithJs)
  })

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

  describeExternal('Bitcoin Cash - Ledger', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinCashWithLedger)
      await fundWallet(chains.bitcoinCashWithLedger)
    })
    testSwap(chains.bitcoinCashWithLedger)
    testBitcoinBalance(chains.bitcoinCashWithLedger)
    testFee(chains.bitcoinCashWithLedger)
  })

  describe('Bitcoin Cash - Node', () => {
    testSwap(chains.bitcoinCashWithNode)
    testBitcoinBalance(chains.bitcoinCashWithNode)
    testFee(chains.bitcoinCashWithNode)
  })

  describe('Bitcoin Cash - Js', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinCashWithJs)
      await fundWallet(chains.bitcoinCashWithJs)
    })
    testSwap(chains.bitcoinCashWithJs)
    testBitcoinBalance(chains.bitcoinCashWithJs)
    testFee(chains.bitcoinCashWithJs)
  })

  describe('Ethereum', () => {
    clearEthMiner(chains.ethereumWithNode)

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

    describe('ERC20 - JS', () => {
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
