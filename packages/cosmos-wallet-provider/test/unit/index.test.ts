/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { CosmosRpcProvider } from '../../../cosmos-rpc-provider/lib'
import { CosmosWalletProvider } from '../../lib'
import { CosmosNetworks } from '../../../cosmos-networks'
import { BigNumber } from '../../../types/lib'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

const mnemonic_1_TestNet = 'vacuum photo autumn dream friend table ski motion cable reason link rare'
const address_1_TestNet = 'cosmos1rcpsmmwvy7p56s3vkhq0yufa74x0z0jray5mk2'

// const mnemonic_2_TestNet = 'omit sudden employ fee ozone unfair syrup concert indoor april board age'
const address_2_TestNet = 'cosmos1cvm7vja680lpcn5w2g2hmu8pt70z6gxlf5c6gh'

const msg = 'liquality'
const msgSignature =
  '82002de786ae15ea24a8280023d2f69f3bf190e980754b5f1b789a99c6d2d97039cc814ad4902a18bc96bba00961ca8390c9bc6c0a5f4096e50aca0145e3af761'

describe('Cosmos Wallet provider', () => {
  let client: Client
  let rpcProvider: CosmosRpcProvider
  let walletProvider: CosmosWalletProvider

  beforeEach(async () => {
    client = new Client()

    rpcProvider = new CosmosRpcProvider(CosmosNetworks.cosmoshub_testnet_photon)
    client.addProvider(rpcProvider)

    walletProvider = new CosmosWalletProvider({
      network: CosmosNetworks.cosmoshub_testnet_photon,
      mnemonic: mnemonic_1_TestNet,
      derivationPath: ''
    })
    client.addProvider(walletProvider)
  })

  describe('getAddresses', () => {
    it('should return valid address', async () => {
      const [address] = await client.wallet.getAddresses()
      expect(address.address).to.be.equal(address_1_TestNet)
    })
  })

  describe('isWalletAvailable', () => {
    it('should have a initialized wallet', async () => {
      const state = await client.wallet.isWalletAvailable()
      expect(state).to.be.true
    })
  })

  describe('getConnectedNetwork', () => {
    it('should have a correct network', async () => {
      const network = await client.wallet.getConnectedNetwork()
      expect(network).to.be.equal(CosmosNetworks.cosmoshub_testnet_photon)
    })
  })

  describe('signMessage', () => {
    it('should have a correct network', async () => {
      const signature = await client.wallet.signMessage(msg, address_1_TestNet)
      expect(signature).to.be.equal(msgSignature)
    })
  })

  describe('sendTransaction', () => {
    it('should send transaction', async () => {
      const tx = await client.chain.sendTransaction({ to: address_2_TestNet, value: new BigNumber(1) })
      expect(tx._raw !== null).to.be.true
    })
  })
})
