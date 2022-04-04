/* eslint-env mocha */
import chai, { expect } from 'chai'

import { Client } from '../../../client/lib'
import { TerraWalletProvider } from '../../lib'
import { TerraRpcProvider } from '../../../terra-rpc-provider/lib'
import { TerraNetworks } from '../../../terra-networks'

chai.config.truncateThreshold = 0

const network = TerraNetworks.terra_testnet
const derivationPath = `'m/44'/330'/0'/0/0`
const rpcProvider = new TerraRpcProvider(network, 'uluna', 'uluna')

function mkClient(mnemonic: string) {
  const client = new Client()
  const provider = new TerraWalletProvider({
    network,
    mnemonic,
    derivationPath,
    asset: 'uluna',
    tokenAddress: '',
    feeAsset: 'uluna'
  })
  client.addProvider(provider)
  // @ts-ignore
  client.addProvider(rpcProvider)
  return client
}

describe('Terra Wallet Provider provider', () => {
  describe('getAddresses', () => {
    it('should return top level account', async () => {
      const client = mkClient(
        'donkey ripple napkin pulp near program profit polar mutual receive gorilla choice whale shoot vendor seat draw cost sell winter arctic crane detect daughter'
      )
      const address = await client.wallet.getAddresses()
      expect(address[0].address).to.be.equal('terra1kndc26sx87rjet5ur3vvnppln449pdvf665g7p')
    })

    it('should return implicit account', async () => {
      const client = mkClient(
        'base eternal trash tent twist fog palm summer crop oppose memory absent usual ahead subject spirit end fragile gauge defy month mercy grit frost'
      )
      const address = await client.wallet.getAddresses()
      expect(address[0].derivationPath).to.equal(`'m/44'/307'/0'/0/0`)
      expect(address[0].address).to.be.equal('terra1krq0p9qh9nujpf77cvma36acyeqy7gdedfamgw')
    })
  })

  describe('exportPrivateKey', () => {
    it('should return a string', () => {
      const client = mkClient(Array(24).fill('trash').join(' '))
      const key = client.wallet.exportPrivateKey()
      expect(key).to.eq('24d0a1e19eb85ca9d22422aef741a7214699466489b49f0532dc4c1f57398964')
    })
  })
})
