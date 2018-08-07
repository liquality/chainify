/* eslint-env mocha */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const { expect } = chai

const { providers: { bitcoin: { BitcoinSwapProvider } } } = require('../')

const lib = new BitcoinSwapProvider()

describe('Bitcoin Swap provider', () => {
  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.generateSwap('1J7eFp9p48g3U3yCREyhd6LJzhnkywhi5s',
        '1GZQKjsC97yasxRj1wtYf5rC61AxpR1zmr',
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        1532622116403))
        .to.equal('76a97263a820ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8814bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6705339665d700b16d14aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa6888ac')
    })
  })
})
