/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { TEST_TIMEOUT, Chain, chains, importBitcoinAddresses, fundAddress, describeExternal } from '../common'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 'TEST_TIMEOUT'

chai.use(chaiAsPromised)

function testWallet (chain: Chain) {
  describe('getAddresses', () => {
    it('should return the correct number of addresses starting at the correct index and return the right derivation path', async () => {
      const startingIndex = 0
      const numAddresses = 20
      const expectedAddress0DerivationPath = `84'/1'/0'/0/0`
      const expectedAddress19DerivationPath = `84'/1'/0'/0/19`

      const addresses = await chain.client.wallet.getAddresses(startingIndex, numAddresses)

      expect(addresses.length).to.equal(numAddresses)
      expect(addresses[0].derivationPath).to.equal(expectedAddress0DerivationPath)
      expect(addresses[19].derivationPath).to.equal(expectedAddress19DerivationPath)
    })

    it('should fail if numAddresses is 0', async () => {
      const startingIndex = 0
      const numAddresses = 0

      await expect(chain.client.wallet.getAddresses(startingIndex, numAddresses)).to.be.rejected
    })

    it('should return the correct number of addresses starting at the correct index and return the right derivation path for change addresses', async () => {
      const startingIndex = 0
      const numAddresses = 20
      const change = true
      const expectedAddress0DerivationPath = `84'/1'/0'/1/0`
      const expectedAddress19DerivationPath = `84'/1'/0'/1/19`

      const addresses = await chain.client.wallet.getAddresses(startingIndex, numAddresses, change)

      expect(addresses.length).to.equal(numAddresses)
      expect(addresses[0].derivationPath).to.equal(expectedAddress0DerivationPath)
      expect(addresses[19].derivationPath).to.equal(expectedAddress19DerivationPath)
    })
  })

  describe('getWalletAddress', () => {
    it('should return address if derivation is within 1000 address index places', async () => {
      const startingIndex = 0
      const numAddresses = 1000

      const addresses = await chain.client.wallet.getAddresses(startingIndex, numAddresses)

      const { address, derivationPath, publicKey } = addresses[numAddresses - 1]

      const { derivationPath: expectedDerivationPath, publicKey: expectedPublicKey } = await chain.client.getMethod('getWalletAddress')(address)

      expect(derivationPath).to.equal(expectedDerivationPath)
      expect(publicKey).to.equal(expectedPublicKey.toString('hex'))
    })

    it('should return change address if dervaition is within 1000 address index places', async () => {
      const startingIndex = 0
      const numAddresses = 1000
      const change = true

      const addresses = await chain.client.wallet.getAddresses(startingIndex, numAddresses, change)

      const { address, derivationPath, publicKey } = addresses[numAddresses - 1]

      const { derivationPath: expectedDerivationPath, publicKey: expectedPublicKey } = await chain.client.getMethod('getWalletAddress')(address)

      expect(derivationPath).to.equal(expectedDerivationPath)
      expect(publicKey).to.equal(expectedPublicKey.toString('hex'))
    })
  })

  describe('getUnusedAddress', () => {
    it('should return next derivation path address', async () => {
      const firstAddress = await chain.client.wallet.getUnusedAddress()
      const firstIndex = parseInt(firstAddress.derivationPath.split('/').pop())

      await fundAddress(chain, firstAddress.address)

      const { address: actualAddress, derivationPath: actualDerivationPath } = await chain.client.wallet.getUnusedAddress()

      const expectedSecondIndex = firstIndex + 1
      const addresses = await chain.client.wallet.getAddresses(0, 1 + expectedSecondIndex)

      const { address: expectedAddress, derivationPath: expectedDerivationPath } = addresses[expectedSecondIndex]

      expect(actualAddress).to.equal(expectedAddress)
      expect(actualDerivationPath).to.equal(expectedDerivationPath)
    })

    it('should return next derivation path change address', async () => {
      const change = true
      const firstAddress = await chain.client.wallet.getUnusedAddress(change)
      const firstIndex = parseInt(firstAddress.derivationPath.split('/').pop())

      await fundAddress(chain, firstAddress.address)

      const { address: actualAddress, derivationPath: actualDerivationPath } = await chain.client.wallet.getUnusedAddress(change)

      const expectedSecondIndex = firstIndex + 1
      const addresses = await chain.client.wallet.getAddresses(0, 1 + expectedSecondIndex, change)

      const { address: expectedAddress, derivationPath: expectedDerivationPath } = addresses[expectedSecondIndex]

      expect(actualAddress).to.equal(expectedAddress)
      expect(actualDerivationPath).to.equal(expectedDerivationPath)
    })
  })

  describe('getUsedAddresses', () => {
    it('should include address recently sent funds to in array', async () => {
      const { address: expectedAddress } = await chain.client.wallet.getUnusedAddress()

      await fundAddress(chain, expectedAddress)

      const usedAddresses = await chain.client.wallet.getUsedAddresses()

      const { address: actualAddress } = usedAddresses[usedAddresses.length - 1]

      expect(expectedAddress).to.equal(actualAddress)
    })
  })

  describe('signMessage', () => {
    it('should return hex of signed message', async () => {
      const addresses = await chain.client.wallet.getAddresses(0, 1)
      const { address } = addresses[0]

      const signedMessage = await chain.client.wallet.signMessage('secret', address)

      const signedMessageBuffer = Buffer.from(signedMessage, 'hex')

      expect(signedMessage).to.equal(signedMessageBuffer.toString('hex'))
    })

    it('should return the same hex if signed twice', async () => {
      const addresses = await chain.client.wallet.getAddresses(0, 1)
      const { address } = addresses[0]

      const signedMessage1 = await chain.client.wallet.signMessage('secret', address)
      const signedMessage2 = await chain.client.wallet.signMessage('secret', address)

      expect(signedMessage1).to.equal(signedMessage2)
    })
  })
}

describe('Wallet Interaction', function () {
  this.timeout(TEST_TIMEOUT)

  describe('Bitcoin - JsWallet', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithJs)
    })

    testWallet(chains.bitcoinWithJs)
  })

  describeExternal('Bitcoin - Ledger', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithLedger)
    })

    testWallet(chains.bitcoinWithLedger)
  })
})
