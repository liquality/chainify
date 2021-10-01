/* eslint-env mocha */
import chai from 'chai'
// import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { FlowWalletProvider } from '../../lib'
import { FlowNetworks } from '../../../flow-networks'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

describe('Flow Wallet provider', () => {
  let client: Client
  let walletProvider: FlowWalletProvider

  beforeEach(async () => {
    client = new Client()
    walletProvider = new FlowWalletProvider({
      network: FlowNetworks.flow_testnet,
      mnemonic: '',
      derivationPath: "m/44'/539'/771'/0'/0"
    })
    client.addProvider(walletProvider)
  })

  describe('getAddress', () => {
    it('get address', async () => {
      const data = await walletProvider.getAddresses()
      console.log('DATA: ', data)
    })
  })
})
