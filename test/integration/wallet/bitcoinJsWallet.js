/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

function testJsWallet (chain) {
  it('Should return addresses', async () => {
    const addresses = await chain.client.wallet.getAddresses(0, 20)
    console.log('addresses', addresses)
  })
}

describe('Wallet Functions', function () {
  this.timeout(config.timeout)

  describe('Bitcoin - JsWallet', () => {
    testJsWallet(chains.bitcoinWithJs)
  })
})
