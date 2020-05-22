/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import * as bitcoin from 'bitcoinjs-lib'
import { hash160 } from '../../../packages/crypto/lib'
import { calculateFee } from '../../../packages/bitcoin-utils/lib'
import { addressToString } from '../../../packages/utils/lib'
import { chains, importBitcoinAddresses, getNewAddress, getRandomBitcoinAddress, mineBlock, fundWallet, describeExternal, connectMetaMask, deployERC20Token, stopEthAutoMining, sleep } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

async function expectFee (chain, txHash, gasPrice) {
  const tx = await chain.client.chain.getTransactionByHash(txHash)
  expect(parseInt(tx._raw.gasPrice, 16)).to.equal(gasPrice)
}

function testTransaction (chain) {
  it('Sent value to 1 address', async () => {
    const addr = await getNewAddress(chain)
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    await chain.client.chain.sendTransaction(addr, value)
    await mineBlock(chain)
    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })

  it('Send transaction with fee', async () => {
    const addr = await getNewAddress(chain)
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    const txHash = await chain.client.chain.sendTransaction(addr, value, undefined, 10)
    await mineBlock(chain)

    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
    await expectFee(chain, txHash, 10)
  })

  it('Update transaction fee', async () => {
    const addr = await getNewAddress(chain)
    const value = config[chain.name].value

    const balBefore = await chain.client.chain.getBalance(addr)
    const txHash = await chain.client.chain.sendTransaction(addr, value, undefined, 10)
    await expectFee(chain, txHash, 10)

    const newTxHash = await chain.client.chain.updateTransactionFee(txHash, 20)
    expect(newTxHash).to.not.equal(txHash)
    await expectFee(chain, newTxHash, 20)
    await mineBlock(chain)

    const balAfter = await chain.client.chain.getBalance(addr)

    expect(balBefore.plus(value).toString()).to.equal(balAfter.toString())
  })
}

describe.only('Transactions', function () {
  this.timeout(config.timeout)

  stopEthAutoMining(chains.ethereumWithNode)

  describe('Ethereum - Node', () => {
    testTransaction(chains.ethereumWithNode)
  })

  describe('Ethereum - Js', () => {
    before(async function () {
      await fundWallet(chains.ethereumWithJs)
    })
    testTransaction(chains.ethereumWithJs)
  })

  describeExternal('Ethereum - Ledger', () => {
    before(async function () {
      await fundWallet(chains.ethereumWithLedger)
    })
    testTransaction(chains.ethereumWithLedger)
  })

  describeExternal('Ethereum - Metamask', () => {
    connectMetaMask()
    before(async function () {
      await fundWallet(chains.ethereumWithMetaMask)
    })
    testTransaction(chains.ethereumWithMetaMask)
  })

  describe('ERC20 - Node', () => {
    before(async function () {
      await deployERC20Token(chains.erc20WithNode)
    })
    testTransaction(chains.erc20WithNode)
  })

  describe('ERC20 - Js', () => {
    before(async function () {
      await fundWallet(chains.erc20WithJs)
      await deployERC20Token(chains.erc20WithJs)
    })
    testTransaction(chains.erc20WithJs)
  })

  describeExternal('ERC20 - Ledger', () => {
    before(async function () {
      await fundWallet(chains.erc20WithLedger)
      await deployERC20Token(chains.erc20WithLedger)
    })
    testTransaction(chains.erc20WithLedger)
  })

  describeExternal('ERC20 - Metamask', () => {
    connectMetaMask()
    before(async function () {
      await fundWallet(chains.erc20WithMetaMask)
      await deployERC20Token(chains.erc20WithMetaMask)
    })
    testTransaction(chains.erc20WithMetaMask)
  })
})
