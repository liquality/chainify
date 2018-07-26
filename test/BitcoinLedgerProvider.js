/* eslint-env mocha */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai

const ChainAbstractionLayer = require('../')

const lib = new ChainAbstractionLayer.providers.bitcoin.BitcoinLedgerProvider()

describe('Bitcoin Ledger provider', () => {
  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.generateSwap('bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
        'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
        'ffffffffffffffffffffffffffffffffffffffff',
        1532622116403))
        .to.equal('76a97263a914ffffffffffffffffffffffffffffffffffffffff8814bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6705339665d700b16d14aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa6888ac')
    })
  })
})
