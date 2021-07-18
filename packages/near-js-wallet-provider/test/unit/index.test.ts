/* eslint-env mocha */
import chai, { expect } from 'chai'

import { Client } from '../../../client/lib'
import { NearJsWalletProvider } from '../../lib'
import { NearRpcProvider } from '../../../near-rpc-provider'
import { NearNetworks } from '../../../near-networks'
import { describeExternal } from '../../../../test/integration/common'

chai.config.truncateThreshold = 0

const network = NearNetworks.near_testnet
const derivationPath = `m/44'/397'/0'`
const rpcProvider = new NearRpcProvider(network)

describe('Near JS Wallet Provider provider', () => {
  describeExternal('getAddresses', () => {
    it('should return top level account', async () => {
      const client = new Client()
      const provider = new NearJsWalletProvider({
        network,
        mnemonic: 'floor shoot fish orbit chef jar unit woman attack tag peasant share',
        derivationPath
      })
      client.addProvider(provider)
      client.addProvider(rpcProvider)
      const address = await client.wallet.getAddresses()
      expect(address[0].address).to.be.equal('implicit.testnet')
    })

    it('should return implicit account', async () => {
      const client = new Client()
      const provider = new NearJsWalletProvider({
        network,
        mnemonic: 'vapor reform dice donor verify race oven virus wrong cook inquiry pilot',
        derivationPath
      })
      client.addProvider(provider)
      client.addProvider(rpcProvider)
      expect(true)

      const address = await client.wallet.getAddresses()
      expect(address[0].address).to.be.equal('e9f034f2692e6bb7e50a237a016bb09c1573a17a40da97db3caef4f9dc35b027')
    })
  })
})
