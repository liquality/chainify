/* eslint-env mocha */

import BitcoinSwapProvider from '../../lib'
import BitcoinNetworks from '@liquality/bitcoin-networks'

const { expect } = require('chai').use(require('chai-as-promised'))

describe('Bitcoin Swap provider', () => {
  let lib

  beforeEach(() => {
    lib = new BitcoinSwapProvider(BitcoinNetworks.bitcoin_testnet)
  })

  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(lib.getSwapOutput('tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
        'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
        'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        1468194353).toString('hex'))
        .to.equal('6382012088a820ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8876a91477195a4f131ed1de8a5b10ce236f169b2f58cba8670431de8257b17576a91477195a4f131ed1de8a5b10ce236f169b2f58cba86888ac')
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
