/* eslint-env mocha */

import { expect } from 'chai'

import * as EthereumUtil from '../../lib'

describe('Ethereum Util', () => {
  describe('ensure0x', () => {
    it('should return hex with 0x prefix', () => {
      expect(EthereumUtil.ensure0x('abcd')).to.equal('0xabcd')
    })

    it('should return same hex if already prefixed with-0x', () => {
      expect(EthereumUtil.ensure0x('0xabcd')).to.equal('0xabcd')
    })
  })

  describe('remove0x', () => {
    it('should return hex without 0x prefix', () => {
      expect(EthereumUtil.remove0x('0xabcd')).to.equal('abcd')
    })

    it('should return same hex if not prefixed with-0x', () => {
      expect(EthereumUtil.remove0x('abcd')).to.equal('abcd')
    })
  })

  describe('normalizeTransactionObject', () => {
    it('should remove blockNumber key if it is null', () => {
      expect(EthereumUtil.normalizeTransactionObject({
        blockNumber: null
      })).to.deep.equal({})
    })

    it('should add number of confirmation if blockNumber key is not null', () => {
      expect(EthereumUtil.normalizeTransactionObject({
        blockNumber: 5
      }, 10)).to.deep.equal({
        blockNumber: 5,
        confirmations: 6
      })
    })
  })
})
