/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { Client } from '../../../client/lib'
import { CosmosRpcProvider } from '../../../cosmos-rpc-provider/lib'
import { CosmosWalletProvider } from '../../lib'
import { CosmosNetworks } from '../../../cosmos-networks'
import { BigNumber, cosmos } from '../../../types/lib'

chai.config.truncateThreshold = 0
chai.use(chaiAsPromised)

const mnemonic_1_TestNet = 'vacuum photo autumn dream friend table ski motion cable reason link rare'
const address_1_TestNet = 'cosmos1rcpsmmwvy7p56s3vkhq0yufa74x0z0jray5mk2'

// const mnemonic_2_TestNet = 'omit sudden employ fee ozone unfair syrup concert indoor april board age'
const address_2_TestNet = 'cosmos1ekqwvtcl2vsxlhm3pua7t2ccyywewmkafcmkaw'

const validator_1_TestNet = 'cosmosvaloper14w4fsqpd3daf0afeqqmg9fhkz2v0rvqjzq4wdw'

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
      derivationPath: `m/44'/118'/0'/0/0`
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
    it('should sign message', async () => {
      const signature = await client.wallet.signMessage(msg, address_1_TestNet)
      expect(signature).to.be.equal(msgSignature)
    })
  })

  describe('sendTransaction_missing_type', () => {
    it('should send transaction', async () => {
      const options = {
        to: address_2_TestNet,
        value: new BigNumber(1)
      } as cosmos.CosmosSendOptions

      const tx = await client.chain.sendTransaction(options)
      expect(tx._raw !== null).to.be.true
    })
  })

  describe('sendTransaction', () => {
    it('should send transaction', async () => {
      const options = {
        type: cosmos.MsgType.MsgSend,
        to: address_2_TestNet,
        value: new BigNumber(1)
      } as cosmos.CosmosSendOptions

      const tx = await client.chain.sendTransaction(options)
      expect(tx._raw !== null).to.be.true
    })
  })

  describe('delegateTransaction', () => {
    it('should delegate tokens to validators', async () => {
      const options = {
        type: cosmos.MsgType.MsgDelegate,
        to: validator_1_TestNet,
        value: new BigNumber(1)
      } as cosmos.CosmosSendOptions

      const tx = await client.chain.sendTransaction(options)
      expect(tx._raw !== null).to.be.true
    })
  })

  // leave this test only for manual testing
  xdescribe('undelegateTransaction', () => {
    it('should delegate tokens to validators', async () => {
      const options = {
        type: cosmos.MsgType.MsgUndelegate,
        to: validator_1_TestNet,
        value: new BigNumber(1)
      } as cosmos.CosmosSendOptions

      const tx = await client.chain.sendTransaction(options)
      expect(tx._raw !== null).to.be.true
    })
  })

  // leave this test only for manual testing
  xdescribe('withdrawTransaction', () => {
    it('should withdraw tokens', async () => {
      const options = {
        type: cosmos.MsgType.MsgWithdraw,
        to: validator_1_TestNet
      } as cosmos.CosmosSendOptions

      const tx = await client.chain.sendTransaction(options)
      expect(tx._raw !== null).to.be.true
    })
  })

  describe('transferTransaction', () => {
    it('should transfer tokens', async () => {
      const options = {
        sourcePort: 'transfer',
        sourceChannel: 'channel-2',
        type: cosmos.MsgType.MsgTransfer,
        to: address_2_TestNet,
        value: new BigNumber(100)
      } as cosmos.CosmosSendOptions

      const tx = await client.chain.sendTransaction(options)
      expect(tx._raw !== null).to.be.true
    })
  })
})
