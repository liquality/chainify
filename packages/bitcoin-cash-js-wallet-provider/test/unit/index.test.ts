/* eslint-env mocha */

import { generateMnemonic } from 'bip39'

import BitcoinCashNetworks from '../../../bitcoin-cash-networks/lib'
import { Address } from '../../../types/lib'
import BitcoinCashJsWalletProvider from '../../lib'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)
chai.config.truncateThreshold = 0

describe('Bitcoin Cash Wallet provider', () => {
  const mnemonic = generateMnemonic(256)
  let provider: BitcoinCashJsWalletProvider

  beforeEach(() => {
    provider = new BitcoinCashJsWalletProvider({
      network: BitcoinCashNetworks.bitcoin_cash_regtest,
      mnemonic
    })
  })

  describe('getDerivationCache', () => {
    it('should return derived addresses', async () => {
      const addresses = await provider.getAddresses(0, 1)
      const addressesFromDerivationCache = await provider.getDerivationCache()

      expect(addresses[0]).to.equal(addressesFromDerivationCache[addresses[0].derivationPath])
    })
  })

  describe('setDerivationCache', () => {
    let addressesActual: Address[]
    let addressesFromDerivationCacheExpected: { [index: string]: Address }
    let newProvider: any

    beforeEach(async () => {
      addressesActual = await provider.getAddresses(0, 1)
      addressesFromDerivationCacheExpected = provider.getDerivationCache()
    })

    it('should import to new client', async () => {
      newProvider = new BitcoinCashJsWalletProvider({
        network: BitcoinCashNetworks.bitcoin_cash_regtest,
        mnemonic
      })
      await newProvider.setDerivationCache(addressesFromDerivationCacheExpected)

      const addressesFromDerivationCacheActual = provider.getDerivationCache()
      const addressesExpected = await newProvider.getAddresses(0, 1)

      expect(addressesExpected[0]).to.equal(addressesActual[0])
      expect(addressesFromDerivationCacheExpected).to.equal(addressesFromDerivationCacheActual)
    })

    it("should fail if mnemonic doesn't match", async () => {
      newProvider = new BitcoinCashJsWalletProvider({
        network: BitcoinCashNetworks.bitcoin_cash_regtest,
        mnemonic: generateMnemonic(256)
      })
      await expect(newProvider.setDerivationCache(addressesFromDerivationCacheExpected)).to.eventually.be.rejected
    })
  })
})
