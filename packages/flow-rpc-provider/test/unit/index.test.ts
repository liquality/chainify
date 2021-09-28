/* eslint-env mocha */
// import chai from 'chai'
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { FlowRpcProvider } from '../../lib'
import { FlowNetworks } from '../../../flow-networks'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

// testnet
const blockNumber = 46371685
const blockHash = 'd9b0ff3efaa402086a7ffded1b10bcbd7c6995ccfebfc325316bc31913341f81'
const blockTime = 1632756950
const blockParentHash = '6861b31e4d7f460b773e59e52b7ba6a47c32a2ac22936cc7e01f281ec4a7af11'

const txHash = '45ee1df5b8757b19539f19cac0886abe96a076f21614166c85df1478a49494ca'
const txBlockHash = 'f9c3d080ca31fcc4bfbbdd54e541fc85827130015f27d936d0aa91fb8c3ef809'
const txBlockNumber = 46471942

describe('Flow RPC provider', () => {
  let client: Client
  let rpcProvider: FlowRpcProvider

  beforeEach(async () => {
    client = new Client()
    rpcProvider = new FlowRpcProvider(FlowNetworks.flow_testnet)
    client.addProvider(rpcProvider)
  })

  describe('getBlockByHash', () => {
    it('should return block by hash', async () => {
      const block = await client.chain.getBlockByHash(blockHash)

      expect(block).not.to.be.undefined
      expect(block.number).to.be.equal(blockNumber)
      expect(block.hash).to.be.equal(blockHash)
      expect(block.timestamp).to.be.equal(blockTime)
      expect(block.parentHash).to.be.equal(blockParentHash)
    })
  })

  describe('getBlockByNumber', () => {
    it('should return block by number', async () => {
      const block = await client.chain.getBlockByNumber(blockNumber)

      expect(block).not.to.be.undefined
      expect(block.number).to.be.equal(blockNumber)
      expect(block.hash).to.be.equal(blockHash)
      expect(block.timestamp).to.be.equal(blockTime)
      expect(block.parentHash).to.be.equal(blockParentHash)
    })
  })

  describe('getBlockHeight', () => {
    it('should return latest block height', async () => {
      const height = await client.chain.getBlockHeight()

      expect(height).not.to.be.undefined
      expect(height).to.be.greaterThan(0)
    })
  })

  describe('getTransactionByHash', () => {
    it('should return transaction by hash', async () => {
      const tx = await client.chain.getTransactionByHash(txHash)

      expect(tx).not.to.be.undefined
      expect(tx.hash).to.be.equal(txHash)
      expect(tx.blockHash).to.be.equal(txBlockHash)
      expect(tx.blockNumber).to.be.equal(txBlockNumber)
      expect(tx.confirmations).to.be.greaterThan(0)
    })
  })

  describe('getBalance', () => {
    it('should return accounts balances', async () => {
      const balance = await client.chain.getBalance(['faa9821df84e8530', 'f086a545ce3c552d'])

      expect(balance).not.to.be.undefined
      expect(balance.toNumber()).to.be.greaterThan(0)
    })
  })

  // TODO: test sendRawTransaction
})
