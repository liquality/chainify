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
  //       '40c614f1feaa2a373139039fcfb9e8cf9a7051a9db83f47ccf8d44e973a9a034'
  //     )

  //     console.log('Block: ', block)
  //   })
  // })

  // describe('getBlockByNumber', () => {
  //   it('should return block by number', async () => {
  //     const block = await client.chain.getBlockByNumber(45242825)
  //     console.log('Block: ', block)
  //   })
  // })

  describe('getBlockHeight', () => {
    it('should return latest block height', async () => {
      const height = await client.chain.getBlockHeight()
      console.log('Height: ', height)
    })
  })
})
