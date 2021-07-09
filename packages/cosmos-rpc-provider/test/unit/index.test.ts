/* eslint-env mocha */
import chai /*, {  expect  } */ from 'chai'

// import { Client } from '../../../client/lib'
import { CosmosRpcProvider } from '../../lib'
import { CosmosNetworks } from '../../../cosmos-networks'
// import { BigNumber } from '../../../types/lib'

chai.config.truncateThreshold = 0

describe('Cosmos RPC provider', () => {
  // let client: Client
  let rpcProvider: CosmosRpcProvider

  beforeEach(async () => {
    // client = new Client()
    rpcProvider = new CosmosRpcProvider(CosmosNetworks.cosmoshub_mainnet)
    await rpcProvider._initClient()
    // client.addProvider(rpcProvider)
  })

  describe('getTransactionByHash', () => {
    it('should return transaction by hash', async () => {
      console.log('...')
      const tx = await rpcProvider.getTransactionByHash(
        '0x95676CA9F71E64B948F588CEE4260FC458909B6365CC9E8B10DC38C45558A2B0'
      )
      console.log('Tx: ', tx)
    })
  })

  // describe('getBlockHeight', () => {
  //   it('should return block height', async () => {
  //     const bh = await rpcProvider.getBlockHeight()
  //     console.log('Block Height: ', bh)
  //   })
  // })

  // describe('getBalance', () => {
  //   it('should return correct balance', async () => {
  //     const balance = await client.chain.getBalance(['krasi'])
  //     expect(BigNumber.isBigNumber(balance)).to.be.true
  //   })
  // })

  // describe('getBalance', () => {
  //   it('should return correct balance for non existing account', async () => {
  //     const balance = await client.chain.getBalance(['non-existing-account'])
  //     expect(balance.eq(0)).to.be.true
  //   })
  // })
})
