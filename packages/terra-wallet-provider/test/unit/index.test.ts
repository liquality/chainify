/* eslint-env mocha */
import chai, { expect } from 'chai'

import { Client } from '../../../client/lib'
import { TerraWalletProvider } from '../../lib'
import { TerraRpcProvider } from '../../../terra-rpc-provider/lib'
import { TerraNetworks } from '../../../terra-networks'

chai.config.truncateThreshold = 0

const network = TerraNetworks.terra_testnet
const derivationPath = ``
const rpcProvider = new TerraRpcProvider(network)

describe('Terra Wallet Provider provider', () => {
  describe('getAddresses', () => {
    it('should return top level account', async () => {
      const client = new Client()
      const provider = new TerraWalletProvider({
        network,
        mnemonic:
          'donkey ripple napkin pulp near program profit polar mutual receive gorilla choice whale shoot vendor seat draw cost sell winter arctic crane detect daughter',
        derivationPath
      })
      client.addProvider(provider)
      client.addProvider(rpcProvider)
      const address = await client.wallet.getAddresses()
      expect(address[0].address).to.be.equal('terra1kndc26sx87rjet5ur3vvnppln449pdvf665g7p')
    })

    it('should return implicit account', async () => {
      const client = new Client()
      const provider = new TerraWalletProvider({
        network,
        mnemonic:
          'base eternal trash tent twist fog palm summer crop oppose memory absent usual ahead subject spirit end fragile gauge defy month mercy grit frost',
        derivationPath
      })
      client.addProvider(provider)
      client.addProvider(rpcProvider)
      expect(true)

      const address = await client.wallet.getAddresses()
      expect(address[0].address).to.be.equal('terra1krq0p9qh9nujpf77cvma36acyeqy7gdedfamgw')
    })
  })
})
