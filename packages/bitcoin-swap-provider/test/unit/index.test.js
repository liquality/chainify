/* eslint-env mocha */

import BitcoinSwapProvider from '../../lib'

const { expect } = require('chai').use(require('chai-as-promised'))

describe('Bitcoin Swap provider', () => {
  let lib

  beforeEach(() => {
    lib = new BitcoinSwapProvider()
  })

  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getSwapOutput('n3F7jE262SfYXBRTvi54HyyYmWnrWisRV9',
        'n3F7jE262SfYXBRTvi54HyyYmWnrWisRV9',
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        1468194353).toString('hex'))
        .to.equal('6382012088a820ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8876a914ee53fca8c7e918379b8dacc21747ed123e89e0dd670431de8257b17576a914ee53fca8c7e918379b8dacc21747ed123e89e0dd6888ac')
    })
  })

  describe('Redeem swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getSwapInput(
        Buffer.from('3045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c01', 'hex'),
        Buffer.from('04edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d', 'hex'),
        true,
        '01020304050607080900').toString('hex'))
        .to.equal('483045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c014104edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d0a0102030405060708090051')
    })
  })

  describe('Refund swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getSwapInput(
        Buffer.from('3045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c01', 'hex'),
        Buffer.from('04edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d', 'hex'),
        false).toString('hex'))
        .to.equal('483045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c014104edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d00')
    })
  })
})
