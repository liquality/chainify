/* eslint-env mocha */

import { expect } from 'chai'

import * as BitcoinUtil from '../../lib'

describe('Bitcoin Util', () => {
  describe('calculateFee', () => {
    it('should return correct fees', () => {
      expect(BitcoinUtil.calculateFee(1, 1, 3)).to.equal(576)
      expect(BitcoinUtil.calculateFee(2, 1, 3)).to.equal(1020)
    })
  })

  describe('compressPubKey', () => {
    it('should return compressed public key', () => {
      expect(BitcoinUtil.compressPubKey('0493fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef098574ba8b41581532c09f38e47d1790dad1a09417ddbde95af5a1314f3f08c37')).to.equal('0393fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef0')

      expect(BitcoinUtil.compressPubKey('04b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b888e708bc3648c4fab3468d2f527eb0e3da99025b0962985b2563ec191c1fd158')).to.equal('02b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b8')
    })
  })
})
