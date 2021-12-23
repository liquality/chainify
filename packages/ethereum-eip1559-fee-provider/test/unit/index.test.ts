/* eslint-env mocha */
import { Client } from '../../../client/lib'

import { EthereumEIP1559FeeProvider } from '../../lib'
import { EthereumRpcProvider } from '../../../ethereum-rpc-provider/lib'

import mockJsonRpc from '../../../../test/mock/mockJsonRpc'
import ethereumRpc from '../../../../test/mock/ethereum/rpc'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)
chai.config.truncateThreshold = 0

describe('Ethereum EIP1559 Fee provider', () => {
  let client: Client

  beforeEach(() => {
    client = new Client()
    client.addProvider(new EthereumRpcProvider({ uri: 'http://localhost:8545' }))
    client.addProvider(new EthereumEIP1559FeeProvider({ uri: 'http://localhost:8545' }))

    mockJsonRpc('http://localhost:8545', ethereumRpc, 100)
  })

  describe('getFees', () => {
    it('Should return correct fees', async () => {
      const fees = await client.chain.getFees()

      expect(fees.slow.fee).to.deep.equal({ baseFeePerGas: 102, maxFeePerGas: 143, maxPriorityFeePerGas: 3 })
      expect(fees.average.fee).to.deep.equal({ baseFeePerGas: 102, maxFeePerGas: 143, maxPriorityFeePerGas: 4 })
      expect(fees.fast.fee).to.deep.equal({ baseFeePerGas: 102, maxFeePerGas: 143, maxPriorityFeePerGas: 4 })
    })
  })
})
