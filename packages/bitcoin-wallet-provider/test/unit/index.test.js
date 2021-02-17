/* eslint-env mocha */

import chai, { expect } from 'chai'
import { generateMnemonic } from 'bip39'

import Client from '../../../client/lib'
import BitcoinNetworks from '../../../bitcoin-networks/lib'
import BitcoinJsWalletProvider from '../../../bitcoin-js-wallet-provider/lib'

chai.use(require('chai-bignumber')())
chai.config.truncateThreshold = 0

describe('Bitcoin Wallet provider', () => {
  const mnemonic = generateMnemonic(256)
  let client
  let provider

  beforeEach(() => {
    client = new Client()
    provider = new BitcoinJsWalletProvider(BitcoinNetworks.bitcoin_regtest, mnemonic)
    client.addProvider(provider)
  })

  describe('getDerivationCache', () => {
    it('should return derived addresses', async () => {
      const addresses = await provider.getMethod('getAddresses')(0, 1)
      const addressesFromDerivationCache = await provider.getMethod('getDerivationCache')()

      expect(addresses[0]).to.equal(addressesFromDerivationCache[addresses[0].derivationPath])
    })

    it('should be importable to new client', async () => {
      const addressesActual = await provider.getMethod('getAddresses')(0, 1)
      const addressesFromDerivationCacheExpected = await provider.getMethod('getDerivationCache')()

      const newClient = new Client()
      const newProvider = new BitcoinJsWalletProvider(
        BitcoinNetworks.bitcoin_regtest, mnemonic, 'bech32', addressesFromDerivationCacheExpected
      )
      newClient.addProvider(newProvider)

      const addressesFromDerivationCacheActual = await provider.getMethod('getDerivationCache')()
      const addressesExpected = await newProvider.getMethod('getAddresses')(0, 1)

      expect(addressesExpected[0]).to.equal(addressesActual[0])
      expect(addressesFromDerivationCacheExpected).to.equal(addressesFromDerivationCacheActual)
    })
  })
})
