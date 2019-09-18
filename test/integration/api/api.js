/* eslint-env mocha */
import chai, { expect } from 'chai'
import chaiAsPromised from 'chai-as-promised'
import { chains } from '../common'
import config from '../config'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chai.use(chaiAsPromised)
chai.use(require('chai-bignumber')())

function testGetFeePerByte (chain) {
  it('Should get the correct feePerByte', async () => {
    const feePerByte = await chain.client.getMethod('getFeePerByte')(1)

    expect(feePerByte).to.equal(1)
  })
}

describe('API', function () {
  this.timeout(config.timeout)

  describe('Bitcoin Esplora - Js', () => {
    testGetFeePerByte(chains.bitcoinWithEsplora)
  })
})
