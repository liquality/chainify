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
  })

  describe('setDerivationCache', () => {
    let addressesActual
    let addressesFromDerivationCacheExpected
    let newClient
    let newProvider

    beforeEach(async () => {
      addressesActual = await provider.getMethod('getAddresses')(0, 1)
      addressesFromDerivationCacheExpected = provider.getMethod('getDerivationCache')()

      newClient = new Client()
    })

    it('should import to new client', async () => {
      newProvider = new BitcoinJsWalletProvider(
        BitcoinNetworks.bitcoin_regtest, mnemonic, 'bech32'
      )
      newClient.addProvider(newProvider)
      await newProvider.getMethod('setDerivationCache')(addressesFromDerivationCacheExpected)

      const addressesFromDerivationCacheActual = provider.getMethod('getDerivationCache')()
      const addressesExpected = await newProvider.getMethod('getAddresses')(0, 1)

      expect(addressesExpected[0]).to.equal(addressesActual[0])
      expect(addressesFromDerivationCacheExpected).to.equal(addressesFromDerivationCacheActual)
    })

    it('should fail if mnemonic doesn\'t match', async () => {
      newProvider = new BitcoinJsWalletProvider(
        BitcoinNetworks.bitcoin_regtest, generateMnemonic(256), 'bech32'
      )
      newClient.addProvider(newProvider)
      await expect(
        newProvider.getMethod('setDerivationCache')(addressesFromDerivationCacheExpected)
      ).to.eventually.be.rejected
    })
  })
})
