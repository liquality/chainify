/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains, fundWallet, describeExternal, connectMetaMask, deployERC20Token, stopEthAutoMining } from '../common'
import { testTransaction } from './common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

describe('Transactions', function () {
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
