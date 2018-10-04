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
      return expect(lib.createSwapScript('1J7eFp9p48g3U3yCREyhd6LJzhnkywhi5s',
        '1GZQKjsC97yasxRj1wtYf5rC61AxpR1zmr',
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        1532622116403))
        .to.equal('76a97263a820ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8814bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb6705339665d700b16d14aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa6888ac')
    })
  })

  describe('Redeem swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getRedeemSwapData('01020304050607080900',
        '04edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d',
        '3045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c01'))
        .to.equal('483045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c010a01020304050607080900514104edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d')
    })
  })

  describe('Refund swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getRefundSwapData('04edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d',
        '3045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c01'))
        .to.equal('483045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c0100004104edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d')
    })
  })
})
