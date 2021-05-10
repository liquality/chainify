/* eslint-env mocha */

import { generateMnemonic } from 'bip39'

import { BitcoinNetworks } from '../../../bitcoin-networks/lib'
import { Address } from '../../../types/lib'
import { BitcoinJsWalletProvider } from '../../lib'
import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)
chai.config.truncateThreshold = 0

describe('Bitcoin Wallet provider', () => {
  const mnemonic = generateMnemonic(256)
  let provider: BitcoinJsWalletProvider

  beforeEach(() => {
    provider = new BitcoinJsWalletProvider({
      network: BitcoinNetworks.bitcoin_regtest,
      baseDerivationPath: `m/84'/${BitcoinNetworks.bitcoin_regtest.coinType}'/0`,
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
    let newProvider

    beforeEach(async () => {
      addressesActual = await provider.getAddresses(0, 1)
      addressesFromDerivationCacheExpected = provider.getDerivationCache()
    })

    it('should import to new client', async () => {
      newProvider = new BitcoinJsWalletProvider({
        network: BitcoinNetworks.bitcoin_regtest,
        baseDerivationPath: `m/84'/${BitcoinNetworks.bitcoin_regtest.coinType}'/0`,
        mnemonic
      })
      await newProvider.setDerivationCache(addressesFromDerivationCacheExpected)

      const addressesFromDerivationCacheActual = provider.getDerivationCache()
      const addressesExpected = await newProvider.getAddresses(0, 1)

      expect(addressesExpected[0]).to.equal(addressesActual[0])
      expect(addressesFromDerivationCacheExpected).to.equal(addressesFromDerivationCacheActual)
    })

    it("should fail if mnemonic doesn't match", async () => {
      newProvider = new BitcoinJsWalletProvider({
        network: BitcoinNetworks.bitcoin_regtest,
        baseDerivationPath: `m/84'/${BitcoinNetworks.bitcoin_regtest.coinType}'/0`,
        mnemonic: generateMnemonic(256)
      })
      await expect(newProvider.setDerivationCache(addressesFromDerivationCacheExpected)).to.eventually.be.rejected
    })
  })
})
