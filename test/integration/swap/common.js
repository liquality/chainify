/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import MetaMaskConnector from 'node-metamask'
import { Client, Provider, providers, crypto } from '../../../src'
import config from './config'

chai.use(chaiAsPromised)

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const metaMaskConnector = new MetaMaskConnector({ port: config.ethereum.metaMaskConnector.port })

const bitcoinNetworks = providers.bitcoin.networks
const bitcoinWithLedger = new Client()
bitcoinWithLedger.addProvider(new providers.bitcoin.BitcoreRPCProvider(config.bitcoin.rpc.host, config.bitcoin.rpc.username, config.bitcoin.rpc.password))
bitcoinWithLedger.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: bitcoinNetworks[config.bitcoin.network], segwit: false }))
bitcoinWithLedger.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: bitcoinNetworks[config.bitcoin.network] }))

const bitcoinWithNode = new Client()
bitcoinWithNode.addProvider(new providers.bitcoin.BitcoreRPCProvider(config.bitcoin.rpc.host, config.bitcoin.rpc.username, config.bitcoin.rpc.password))
bitcoinWithNode.addProvider(new providers.bitcoin.BitcoinJsLibSwapProvider({ network: bitcoinNetworks[config.bitcoin.network] }))

// TODO: required for BITCOIN too?
class RandomEthereumAddressProvider extends Provider {
  getUnusedAddress () { // Mock unique address
    const randomString = parseInt(Math.random() * 1000000000000).toString()
    const randomHash = crypto.sha256(randomString)
    const address = randomHash.substr(0, 40)
    return { address }
  }
}

const ethereumNetworks = providers.ethereum.networks
const ethereumWithMetaMask = new Client()
ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumRPCProvider(config.ethereum.rpc.host))
ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumMetaMaskProvider(metaMaskConnector.getProvider(), ethereumNetworks[config.ethereum.network]))
ethereumWithMetaMask.addProvider(new providers.ethereum.EthereumSwapProvider())
ethereumWithMetaMask.addProvider(new RandomEthereumAddressProvider())

const ethereumWithNode = new Client()
ethereumWithNode.addProvider(new providers.ethereum.EthereumRPCProvider(config.ethereum.rpc.host))
ethereumWithNode.addProvider(new providers.ethereum.EthereumSwapProvider())
ethereumWithNode.addProvider(new RandomEthereumAddressProvider())

const chains = {
  bitcoinWithLedger: { id: 'Bitcoin Ledger', name: 'bitcoin', client: bitcoinWithLedger },
  bitcoinWithNode: { id: 'Bitcoin Node', name: 'bitcoin', client: bitcoinWithNode },
  ethereumWithMetaMask: { id: 'Ethereum MetaMask', name: 'ethereum', client: ethereumWithMetaMask },
  ethereumWithNode: { id: 'Ethereum Node', name: 'ethereum', client: ethereumWithNode }
}

async function getSwapParams (chain) {
  const recipientAddress = (await chain.client.getUnusedAddress()).address
  const refundAddress = (await chain.client.getUnusedAddress()).address
  const expiration = parseInt(Date.now() / 1000) + parseInt(Math.random() * 1000000)
  const value = config[chain.name].value

  console.log('\x1b[2m', `Swap Params for ${chain.id}`, '\x1b[0m')
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

async function initiateAndVerify (chain, secretHash, swapParams) {
  console.log('\x1b[33m', `Initiating ${chain.id}: Watch prompt on wallet`, '\x1b[0m')
  const initiationParams = [swapParams.value, swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration]
  const [ initiationTx, initiationTxId ] = await Promise.all([
    chain.client.findInitiateSwapTransaction(...initiationParams),
    chain.client.initiateSwap(...initiationParams)
  ])
  expect(initiationTx.hash).to.equal(initiationTxId)
  const isVerified = await chain.client.verifyInitiateSwapTransaction(initiationTxId, ...initiationParams)
  expect(isVerified).to.equal(true)
  console.log(`${chain.id} Initiated ${initiationTxId}`)
  return initiationTxId
}

async function claimAndVerify (chain, initiationTxId, secret, swapParams) {
  console.log('\x1b[33m', `Claiming ${chain.id}: Watch prompt on wallet`, '\x1b[0m')
  const secretHash = crypto.sha256(secret)
  const [ claimTx, claimTxId ] = await Promise.all([
    chain.client.findClaimSwapTransaction(initiationTxId, swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration),
    chain.client.claimSwap(initiationTxId, swapParams.recipientAddress, swapParams.refundAddress, secret, swapParams.expiration)
  ])
  console.log(`${chain.id} Claimed ${claimTxId}`)
  return claimTx
}

async function refund (chain, initiationTxId, secretHash, swapParams) {
  console.log('\x1b[33m', `Refunding ${chain.id}: Watch prompt on wallet`, '\x1b[0m')
  const refundTxId = await chain.client.refundSwap(initiationTxId, swapParams.recipientAddress, swapParams.refundAddress, secretHash, swapParams.expiration)
  console.log(`${chain.id} Refunded ${refundTxId}`)
  return refundTxId
}

async function expectBalance (chain, address, func, comparison) {
  const balanceBefore = await chain.client.getBalance([address])
  await func()
  await sleep(5000) // Await block time
  const balanceAfter = await chain.client.getBalance([address])
  comparison(balanceBefore, balanceAfter)
}

function mineBitcoinBlocks () {
  if (config.bitcoin.mineBlocks) {
    let interval
    before(async () => {
      interval = setInterval(() => {
        chains.bitcoinWithNode.client.generateBlock(1)
      }, 1000)
    })
    after(() => clearInterval(interval))
  }
}

function connectMetaMask () {
  before(async () => {
    console.log('\x1b[36m', 'Starting MetaMask connector on http://localhost:3333 - Open in browser to continue', '\x1b[0m')
    await metaMaskConnector.start()
  })
  after(async () => metaMaskConnector.stop())
}

export {
  chains,
  metaMaskConnector,
  initiateAndVerify,
  claimAndVerify,
  refund,
  getSwapParams,
  expectBalance,
  sleep,
  mineBitcoinBlocks,
  connectMetaMask
}
