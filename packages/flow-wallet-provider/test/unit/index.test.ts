/* eslint-env mocha */
import chai from 'chai'
// import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { FlowWalletProvider } from '../../lib'
import { FlowNetworks } from '../../../flow-networks'
import { FlowRpcProvider } from '../../../flow-rpc-provider'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

describe('Flow Wallet provider', () => {
  let client: Client
  let rpcProvider: FlowRpcProvider
  let walletProvider: FlowWalletProvider

  beforeEach(async () => {
    client = new Client()

    rpcProvider = new FlowRpcProvider(FlowNetworks.flow_testnet)
    client.addProvider(rpcProvider)

    walletProvider = new FlowWalletProvider({
      network: FlowNetworks.flow_testnet,
      mnemonic:
        'thumb proud solar any north rely grow ceiling pattern dress under illegal relief brief flock ensure tumble green million earth lesson absent horse snap',
      derivationPath: `m/44'/${FlowNetworks.flow_testnet.coinType}'/771'/0'/0`
    })
    client.addProvider(walletProvider)
  })
})
