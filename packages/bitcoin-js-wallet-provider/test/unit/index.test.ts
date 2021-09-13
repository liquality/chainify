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
  console.log(mnemonic)
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

    xit('should import to new client', async () => {
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

    xit("should fail if mnemonic doesn't match", async () => {
      newProvider = new BitcoinJsWalletProvider({
        network: BitcoinNetworks.bitcoin_regtest,
        baseDerivationPath: `m/84'/${BitcoinNetworks.bitcoin_regtest.coinType}'/0`,
        mnemonic: generateMnemonic(256)
      })
      await expect(newProvider.setDerivationCache(addressesFromDerivationCacheExpected)).to.eventually.be.rejected
    })

    it('Should return correct private key for provided mnemonic', async () => {
      const mnemonic =
        'unveil fault vacant drum suggest ocean try muscle emotion island economy crawl attitude rotate tunnel scene jazz pride motor thumb coral potato jelly ring'

      provider = new BitcoinJsWalletProvider({
        network: BitcoinNetworks.bitcoin_regtest,
        baseDerivationPath: `m/84'/${BitcoinNetworks.bitcoin_regtest.coinType}'/0`,
        mnemonic
      })

      const privateKey = await provider.getPrivateKey("m/84'/1'/0/0/0")
      expect(privateKey).to.equal('29914dde04cf6bbe5ed2f0f92e8d448660647e09b0f9cf202bcde7b90482f792')
    })
  })
})
