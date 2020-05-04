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
    it('should return v, r, s with v as a number, and r, s as hex', async () => {
      const addresses = await chain.client.wallet.getAddresses()
      const { address } = addresses[0]

      const { v, r, s } = await chain.client.wallet.signMessage('secret', address)

      const rBuffer = Buffer.from(r, 'hex')
      const sBuffer = Buffer.from(s, 'hex')

      expect(Number.isInteger(v)).to.equal(true)
      expect(r).to.equal(rBuffer.toString('hex'))
      expect(s).to.equal(sBuffer.toString('hex'))
    })

    it('should return the same v, r, s values if signed twice', async () => {
      const addresses = await chain.client.wallet.getAddresses()
      const { address } = addresses[0]

      const { v: v1, r: r1, s: s1 } = await chain.client.wallet.signMessage('secret', address)
      const { v: v2, r: r2, s: s2 } = await chain.client.wallet.signMessage('secret', address)

      expect(v1).to.equal(v2)
      expect(r1).to.equal(r2)
      expect(s1).to.equal(s2)
    })
  })
}

describe('Wallet Interaction', function () {
  this.timeout(config.timeout)

  describe('Ethereum - Js', () => {
    testWallet(chains.ethereumWithJs)
  })
})
