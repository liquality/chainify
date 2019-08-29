/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains, importBitcoinAddresses } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

function testWallet (chain) {
  it(`${chain.id} functions should work`, async () => {
    const addresses = await chain.client.wallet.getAddresses(0, 20)

    console.log('address 19', addresses[19].address)

    const newAddress = await chain.client.getMethod('getWalletAddress')(addresses[19].address)

    console.log('newAddress', newAddress)

    const signature = await chain.client.getMethod('signMessage')('test', addresses[19].address)

    console.log('signature', signature)

    const unusedAddress = await chain.client.wallet.getUnusedAddress()
    console.log('unusedAddress', unusedAddress)

    await chains.bitcoinWithNode.client.chain.sendTransaction(unusedAddress, 1000000)
    await chains.bitcoinWithNode.client.chain.generateBlock(1)

    if (chain.id === 'Bitcoin Js') {
      const inputsForAmount = await chain.client.getMethod('getInputsForAmount')(100000)
      console.log('inputsForAmount', inputsForAmount)
    }

    const newUnusedAddress = await chain.client.wallet.getUnusedAddress()
    console.log('newUnusedAddress', newUnusedAddress)

    await chain.client.chain.sendTransaction(newUnusedAddress, 100000)
    await chains.bitcoinWithNode.client.chain.generateBlock(1)

    expect(true).to.equal(true)
  })
}

describe('Send Batch Transactions', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - JsWallet', () => {
    before(async function () {
      await importBitcoinAddresses(chains.bitcoinWithJs)
    })

    testWallet(chains.bitcoinWithJs)
  })

  describe('Bitcoin - NodeWallet', () => {
    testWallet(chains.bitcoinWithNode)
  })
})
