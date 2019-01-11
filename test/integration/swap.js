/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import MetaMaskConnector from 'node-metamask'
import { Client, providers, crypto } from '../../'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)

let chains

async function getSwapParams (id, chain) {
  const unusedAddress = await chain.getUnusedAddress()
  const recipientAddress = unusedAddress.address
  const refundAddress = unusedAddress.address
  const expiration = parseInt(Date.now() / 1000) + parseInt(Math.random() * 1000000)
  const value = 10000

  console.log('\x1b[2m', `Swap Params for ${id}`, '\x1b[0m')
  console.log('\x1b[2m', 'Recipient Address:', recipientAddress, '\x1b[0m')
  console.log('\x1b[2m', 'Refund Address:', refundAddress, '\x1b[0m')
  console.log('\x1b[2m', 'Expiry:', expiration, '\x1b[0m')
  console.log('\x1b[2m', 'Value:', value, '\x1b[0m')

  return {
    recipientAddress,
    refundAddress,
    expiration,
    value
  }
}

async function initiateAndVerify (chain, chainId, secretHash, swapParams) {
  console.log('\x1b[33m', `Initiating ${chainId}: Watch prompt on wallet`, '\x1b[0m')
  const initiationParams = [swapParams.value, swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration]
  const [ initiationTx, initiationTxId ] = await Promise.all([
    chain.findInitiateSwapTransaction(...initiationParams),
    chain.initiateSwap(...initiationParams)
  ])
  expect(initiationTx.hash).to.equal(initiationTxId)
  const isVerified = await chain.verifyInitiateSwapTransaction(initiationTxId, ...initiationParams)
  expect(isVerified).to.equal(true)
  console.log(`${chainId} Initiated ${initiationTxId}`)
  return initiationTxId
}

async function claimAndVerify (chain, chainId, initiationTxId, secret, swapParams) {
  console.log('\x1b[33m', `Claiming ${chainId}: Watch prompt on wallet`, '\x1b[0m')
  const secretHash = crypto.sha256(secret)
  const [ claimTx, claimTxId ] = await Promise.all([
    chain.findClaimSwapTransaction(initiationTxId, swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration),
    chain.claimSwap(initiationTxId, swapParams.recipientAddress, swapParams.refundAddress, secret, swapParams.expiration)
  ])
  expect(claimTx.hash).to.equal(claimTxId)
  console.log(`${chainId} Claimed ${claimTxId}`)
  return claimTx.secret
}

async function testSingle (id, chain) {
  const secret = await chain.generateSecret('test')
  const secretHash = crypto.sha256(secret)
  const swapParams = await getSwapParams(id, chain)

  const initiationTxId = await initiateAndVerify(chain, id, secretHash, swapParams)
  const revealedSecret = await claimAndVerify(chain, id, initiationTxId, secret, swapParams)
  expect(revealedSecret).to.equal(secret)
}

async function testSwap (chain1Id, chain1, chain2Id, chain2) {
  const secret = await chain1.generateSecret('test')
  const secretHash = crypto.sha256(secret)

  const chain1SwapParams = await getSwapParams(chain1Id, chain1)
  const chain2SwapParams = await getSwapParams(chain2Id, chain2)

  const chain1InitiationTxId = await initiateAndVerify(chain1, chain1Id, secretHash, chain1SwapParams)
  const chain2InitiationTxId = await initiateAndVerify(chain2, chain2Id, secretHash, chain2SwapParams)
  const revealedSecret = await claimAndVerify(chain1, chain2Id, chain1InitiationTxId, secret, chain1SwapParams)
  await claimAndVerify(chain2, chain2Id, chain2SwapParams, chain2InitiationTxId, revealedSecret)
}

describe('Swap E2E', function () {
  this.timeout(120000)
  const metaMaskConnector = new MetaMaskConnector({ port: 3333 })
  before(() => {
    const bitcoinNetworks = providers.bitcoin.networks
    const bitcoinWithLedger = new Client()
    bitcoinWithLedger.addProvider(new providers.bitcoin.BitcoreRPCProvider('http://localhost:18332', 'bitcoin', 'local321'))
    bitcoinWithLedger.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: bitcoinNetworks.bitcoin_testnet, segwit: false }))
    bitcoinWithLedger.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: bitcoinNetworks.bitcoin_testnet }))

    const bitcoinWithNode = new Client()
    bitcoinWithNode.addProvider(new providers.bitcoin.BitcoreRPCProvider('http://localhost:18332/', 'bitcoin', 'local321'))
    bitcoinWithNode.addProvider(new providers.bitcoin.BitcoinJsLibSwapProvider({ network: bitcoinNetworks.bitcoin_testnet }))

    const ethereumWithMetaMask = new Client()
    ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumRPCProvider('http://localhost:8545'))
    ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumMetaMaskProvider(metaMaskConnector.getProvider()))
    ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumSwapProvider())

    const ethereumWithNode = new Client()
    ethereumWithNode.addProvider(new providers.ethereum.EthereumRPCProvider('http://localhost:8545'))
    ethereumWithNode.addProvider(new providers.ethereum.EthereumSwapProvider())

    chains = {
      bitcoinWithLedger,
      bitcoinWithNode,
      ethereumWithMetaMask,
      ethereumWithNode
    }
  })

  describe('Swap Flow', () => {
    it('Bitcoin With Ledger', async () => {
      await testSingle('BitcoinLedger', chains.bitcoinWithLedger)
    })

    it('Bitcoin With Node', async () => {
      const interval = setInterval(() => {
        chains.bitcoinWithNode.generateBlock(1)
      }, 1000)
      await testSingle('BitcoinNode', chains.bitcoinWithNode)
      clearInterval(interval)
    })

    it('Ethereum With MetaMask', async () => {
      console.log('Starting MetaMask connector on http://localhost:3333 - Open in browser to continue')
      await metaMaskConnector.start()
      await testSingle('EthereumMetaMask', chains.ethereumWithMetaMask)
      await metaMaskConnector.stop()
    })

    it('Ethereum With Node', async () => {
      await testSingle('EthereumNode', chains.ethereumWithNode)
    })

    it.only('BTC-ETH Ledger, MetaMask', async () => {
      console.log('Starting MetaMask connector on http://localhost:3333 - Open in browser to continue')
      await metaMaskConnector.start()
      const interval = setInterval(() => {
        chains.bitcoinWithNode.generateBlock(1)
      }, 1000)
      await testSwap('Bitcoin Ledger', chains.bitcoinWithNode, 'Ethereum MetaMask', chains.ethereumWithMetaMask)
      await metaMaskConnector.stop()
      clearInterval(interval)
    })
  })
})
