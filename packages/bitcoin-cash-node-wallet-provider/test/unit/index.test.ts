/* eslint-env mocha */

import chai, { expect } from 'chai'
import BigNumber from 'bignumber.js'

import Client from '../../../client/lib'
import BitcoinCashNetworks from '../../../bitcoin-cash-networks/lib'
import BitcoinCashNodeWalletProvider from '../../lib'

import mockJsonRpc from '../../../../test/mock/mockJsonRpc'
import bitcoinCashRpc from '../../../../test/mock/bitcoin-cash/rpc'

chai.config.truncateThreshold = 0

describe('Bitcoin Cash RPC provider', () => {
  let client: Client
  let provider: BitcoinCashNodeWalletProvider

  beforeEach(() => {
    client = new Client()
    provider = new BitcoinCashNodeWalletProvider({
      network: BitcoinCashNetworks.bitcoin_cash_testnet,
      uri: 'http://localhost:18543',
      username: 'bitcoin',
      password: 'local321'
    })
    client.addProvider(provider)

    mockJsonRpc('http://localhost:18543', bitcoinCashRpc, 100)
  })

  describe('signMessage', () => {
    it('should return signature', async () => {
      const sig = await provider.signMessage('liquality', 'bchtest:qqqgxd953k7guk4wurwnnsmww8mud9tuyqqcgmnumd')
      expect(sig).to.equal(
        '205bfd8bb8ccc907e3c5e832eccef1df619d52ea8785045ee9cb7b069e8785e7185d8a8d395666f1c441a7423325c1e4abfd4b9f33e851c60f99f8deb0165e3ef3'
      )
    })
  })

  describe('sendTransaction', () => {
    it('should return transaction', async () => {
      const tx = await provider.sendTransaction({
        to: 'bchtest:pqlt35hmu8mxzj646he3amxqw3n8ed5scqj34qn9gw',
        value: new BigNumber(1000)
      })
      expect(tx.hash).to.equal('8d2ef62766cb1c15744228335483d37a7addc2a2f88d47413527e55e212ef8cd')
    })
  })
})
