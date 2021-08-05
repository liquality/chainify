/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { CosmosRpcProvider } from '../../lib'
import { CosmosNetworks } from '../../../cosmos-networks'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

const parentHash_TestNet = '358AA62B27E9082FD43A616A65708E01BD5E797E7D9D8B820B28E12FBB6153FB'
const blockHash_TestNet = '5560F547AB6B7C482FB1B872316E0863AFA63F039AC1C91541E02E433049500F'
const txHash_TestNet = '12222DB9AE10ED1ABF1311743EA437B051E520911AF73369A44877ECA4A06469'
const blockHeight_TestNet = 979038
const address_1_TestNet = 'cosmos1eejyfynksgjap5kwhkkf57l80rnwkfsswvel8a'
const address_2_TestNet = 'cosmos1cvm7vja680lpcn5w2g2hmu8pt70z6gxlf5c6gh'
const address_3_TestNet = 'cosmos1rcpsmmwvy7p56s3vkhq0yufa74x0z0jray5mk2'
const validator_address_1_TestNet = 'cosmosvaloper14w4fsqpd3daf0afeqqmg9fhkz2v0rvqjzq4wdw'

describe('Cosmos RPC provider', () => {
  let client: Client
  let rpcProvider: CosmosRpcProvider

  beforeEach(async () => {
    client = new Client()
    rpcProvider = new CosmosRpcProvider(CosmosNetworks.cosmoshub_testnet_photon)
    client.addProvider(rpcProvider)
  })

  describe('getBlockByHash', () => {
    it('should return block by hash', async () => {
      const block = await client.chain.getBlockByHash('0x' + blockHash_TestNet)

      expect(block.number).to.be.equal(blockHeight_TestNet)
      expect(block.hash).to.be.equal(blockHash_TestNet)
      expect(block.parentHash).to.be.equal(parentHash_TestNet)
      expect(block.transactions.length).to.be.equal(1)
      expect(block.transactions[0].hash).to.be.equal(txHash_TestNet)
    })
  })

  describe('getBlockByNumber', () => {
    it('should return block by height', async () => {
      const block = await client.chain.getBlockByNumber(blockHeight_TestNet)

      expect(block.number).to.be.equal(blockHeight_TestNet)
      expect(block.hash).to.be.equal(blockHash_TestNet)
      expect(block.parentHash).to.be.equal(parentHash_TestNet)
      expect(block.transactions.length).to.be.equal(1)
      expect(block.transactions[0].hash).to.be.equal(txHash_TestNet)
    })
  })

  describe('getBlockHeight', () => {
    it('should return current height', async () => {
      await client.getMethod('getBlockHeight')()
    })
  })

  describe('getTransactionByHash', () => {
    it('should return transaction by hash', async () => {
      const tx = await client.chain.getTransactionByHash('0x' + txHash_TestNet)

      expect(tx.hash).to.be.equal(txHash_TestNet)
      expect(tx.blockHash).to.be.equal(blockHash_TestNet)
      expect(tx.blockNumber).to.be.equal(blockHeight_TestNet)
      expect(tx._raw !== null).to.be.true
    })
  })

  describe('getBalance', () => {
    it('should return correct balance for account', async () => {
      const balance = await client.chain.getBalance([address_1_TestNet, address_2_TestNet])

      expect(balance.isGreaterThan(0)).to.be.true
    })
  })

  describe('getFees', () => {
    it('should return correct fees', async () => {
      const fees = await client.chain.getFees()

      expect(CosmosNetworks.cosmoshub_testnet_photon.minimalGasPrice).to.be.equal(fees.slow.fee)
    })
  })

  describe('getDelegatedAmount', () => {
    it('should return correct delegated amount of tokens to validator', async () => {
      await client.getMethod('getDelegatedAmount')(address_3_TestNet, validator_address_1_TestNet)
    })
  })

  describe('getReward', () => {
    it('should return correct reward from delegation of tokens to validator', async () => {
      await client.getMethod('getReward')(address_3_TestNet, validator_address_1_TestNet)
    })
  })
})
