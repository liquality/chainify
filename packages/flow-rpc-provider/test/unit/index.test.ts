/* eslint-env mocha */
import chai from 'chai'
// import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { FlowRpcProvider } from '../../lib'
import { FlowNetworks } from '../../../flow-networks'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

// const txHash = '32e4e4eaed92156b839e7045770cd367023c95a896fcf0313d00bd1caec25187'

describe('Flow RPC provider', () => {
  let client: Client
  let rpcProvider: FlowRpcProvider

  beforeEach(async () => {
    client = new Client()
    rpcProvider = new FlowRpcProvider(FlowNetworks.flow_testnet)
    client.addProvider(rpcProvider)
  })

  // describe('getBlockByHash', () => {
  //   it('should return block by hash', async () => {
  //     const block = await client.chain.getBlockByHash(txHash)

  //     expect(block).not.to.be.undefined
  //     expect(block.number).to.be.equal(45310104)
  //     expect(block.hash).to.be.equal(txHash)
  //     expect(block.timestamp).to.be.equal(1631869206)
  //     expect(block.parentHash).to.be.equal('9d17c680032341d13adef9c98e9c3379017fa22a1899caeb0a54d7b2800232a7')
  //   })
  // })

  // describe('getBlockByNumber', () => {
  //   it('should return block by number', async () => {
  //     const block = await client.chain.getBlockByNumber(45310104)

  //     expect(block).not.to.be.undefined
  //     expect(block.number).to.be.equal(45310104)
  //     expect(block.hash).to.be.equal(txHash)
  //     expect(block.timestamp).to.be.equal(1631869206)
  //     expect(block.parentHash).to.be.equal('9d17c680032341d13adef9c98e9c3379017fa22a1899caeb0a54d7b2800232a7')
  //   })
  // })

  // describe('getBlockHeight', () => {
  //   it('should return latest block height', async () => {
  //     const height = await client.chain.getBlockHeight()

  //     expect(height).not.to.be.undefined
  //     expect(height).to.be.greaterThan(0)
  //   })
  // })

  // TODO: fix getTransactionByHash and getBalance tests
  // describe('getTransactionByHash', () => {
  //   it('should return transaction by hash', async () => {
  //     const tx = await client.chain.getTransactionByHash(
  //       '81ba9ddcea40f3f7330ecd9aed464f83bd03b8f6233f52f1be2dac4aef0a175c'
  //     )

  //     console.log('Tx: ', tx)
  //   })
  // })

  // describe('getBalance', () => {
  //   it('should return accounts balances', async () => {
  //     const balance = await client.chain.getBalance(['faa9821df84e8530', 'f086a545ce3c552d'])

  //     console.log('Balance: ', balance)
  //   })
  // })

  describe('getBlockByNumber', () => {
    it('should return block by number', async () => {
      const block = await client.chain.getBlockByNumber(45948018)
      console.log(block)
    })
  })
})
