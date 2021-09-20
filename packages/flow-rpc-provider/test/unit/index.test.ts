/* eslint-env mocha */
import chai /* expect */ from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { FlowRpcProvider } from '../../lib'
import { FlowNetworks } from '../../../flow-networks'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

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
  //     const block = await client.chain.getBlockByHash(
  //       '32e4e4eaed92156b839e7045770cd367023c95a896fcf0313d00bd1caec25187'
  //     )

  //     console.log('Block: ', block)
  //   })
  // })

  // describe('getBlockByNumber', () => {
  //   it('should return block by number', async () => {
  //     const block = await client.chain.getBlockByNumber(45310104)
  //     console.log('Block: ', block)
  //   })
  // })

  // describe('getBlockHeight', () => {
  //   it('should return latest block height', async () => {
  //     const height = await client.chain.getBlockHeight()
  //     console.log('Height: ', height)
  //   })
  // })

  // describe('getTransactionByHash', () => {
  //   it('should return transaction by hash', async () => {
  //     const tx = await client.chain.getTransactionByHash(
  //       '81ba9ddcea40f3f7330ecd9aed464f83bd03b8f6233f52f1be2dac4aef0a175c'
  //     )
  //     console.log('Tx: ', tx)
  //   })
  // })

  describe('getBalance', () => {
    it('should return accounts balances', async () => {
      const tx = await client.chain.getBalance(['faa9821df84e8530', 'f086a545ce3c552d'])
      console.log('Balance: ', tx)
    })
  })
})
