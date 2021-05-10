/* eslint-env mocha */

import chai, { expect } from 'chai'
import { Client } from '../../../client/lib'
import { BitcoinEsploraBatchApiProvider } from '../../lib'
import { BitcoinNetworks } from '../../../bitcoin-networks/lib'
import mockBatchEsploraApi from '../mock/mockBatchEsploraApi'
chai.config.truncateThreshold = 0

describe('Bitcoin Esplora Api Provider', () => {
  let client: Client
  let provider: BitcoinEsploraBatchApiProvider
  before(() => {
    mockBatchEsploraApi()
  })

  beforeEach(() => {
    client = new Client()
    provider = new BitcoinEsploraBatchApiProvider({
      url: 'https://blockstream.info/testnet/api',
      network: BitcoinNetworks.bitcoin_testnet,
      // or 'https://liquality.io/electrs-testnet-batch',
      batchUrl: 'https://blockstream.info/electrs-testnet-batch'
    })
    client.addProvider(provider)
  })

  describe('getUnspentTransactions', () => {
    it('should get unspent transactions', async () => {
      const tx = await provider.getUnspentTransactions(['2N4N393YJx9KuZV5D4HMkzHZ7QoFp6tJG1b'])
      expect(tx).to.deep.equal([
        {
          address: '2N4N393YJx9KuZV5D4HMkzHZ7QoFp6tJG1b',
          amount: 0.10384287,
          blockHeight: 1973185,
          satoshis: 10384287,
          status: {
            block_hash: '0000000000edbe057f877fdb0de069f636f6a9b03451aa748e8fa77546fcbbf8',
            block_height: 1973185,
            block_time: 1619775030,
            confirmed: true
          },
          txid: '374d22560325e43a314f15120ba8d3ab1840e87695119d3208308dd2868cf9a3',
          value: 10384287,
          vout: 0
        }
      ])
    })
  })

  describe('getAddressTransactionCounts', () => {
    it('should get tx counts', async () => {
      const tx = await provider.getAddressTransactionCounts(['2N4N393YJx9KuZV5D4HMkzHZ7QoFp6tJG1b'])
      expect(tx).to.deep.equal({ '2N4N393YJx9KuZV5D4HMkzHZ7QoFp6tJG1b': 2 })
    })
  })
})
