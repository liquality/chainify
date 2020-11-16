/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

function testWallet (chain) {
  describe('getAddresses', () => {
    it('should return first address at index 0 derivationPath', async () => {
      const expectedAddress0DerivationPath = `m/44'/60'/0'/0/0`
      const addresses = await chain.client.wallet.getAddresses()

      expect(addresses.length).to.equal(1)
      expect(addresses[0].derivationPath).to.equal(expectedAddress0DerivationPath)
    })
  })

  describe('getUnusedAddress', () => {
    it('should return first address at index 0 derivationPath', async () => {
      const expectedAddress0DerivationPath = `m/44'/60'/0'/0/0`
      const address = await chain.client.wallet.getUnusedAddress()

      expect(address.derivationPath).to.equal(expectedAddress0DerivationPath)
    })
  })

  describe('getUsedAddresses', () => {
    it('should return first address at index 0 derivationPath', async () => {
      const expectedAddress0DerivationPath = `m/44'/60'/0'/0/0`
      const addresses = await chain.client.wallet.getUsedAddresses()

      expect(addresses.length).to.equal(1)
      expect(addresses[0].derivationPath).to.equal(expectedAddress0DerivationPath)
    })
  })

  describe('signMessage', () => {
    // TODO: this whole test suite should be combined with `bitcoinWallet.js`
    it('should return hex of signed message', async () => {
      const addresses = await chain.client.wallet.getAddresses()
      const { address } = addresses[0]

      const signedMessage = await chain.client.wallet.signMessage('secret', address)

      const signedMessageBuffer = Buffer.from(signedMessage, 'hex')

      expect(signedMessage).to.equal(signedMessageBuffer.toString('hex'))
    })

    it('should return the same hex if signed twice', async () => {
      const addresses = await chain.client.wallet.getAddresses()
      const { address } = addresses[0]

      const signedMessage1 = await chain.client.wallet.signMessage('secret', address)
      const signedMessage2 = await chain.client.wallet.signMessage('secret', address)

      expect(signedMessage1).to.equal(signedMessage2)
    })
  })
}

describe('Wallet Interaction', function () {
  this.timeout(config.timeout)

  describe('Ethereum - Js', () => {
    testWallet(chains.ethereumWithJs)
  })
})
