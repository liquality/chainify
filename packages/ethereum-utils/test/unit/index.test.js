/* eslint-env mocha */

import { expect } from 'chai'

import * as EthereumUtil from '../../lib'

describe('Ethereum Util', () => {
  describe('ensureHexEthFormat', () => {
    it('should return hex with 0x prefix', () => {
      expect(EthereumUtil.ensureHexEthFormat('abcd')).to.equal('0xabcd')
    })

    it('should return same hex if already prefixed with-0x', () => {
      expect(EthereumUtil.ensureHexEthFormat('0xabcd')).to.equal('0xabcd')
    })
  })

  describe('ensureHexStandardFormat', () => {
    it('should return hex without 0x prefix', () => {
      expect(EthereumUtil.ensureHexStandardFormat('0xabcd')).to.equal('abcd')
    })

    it('should return same hex if not prefixed with-0x', () => {
      expect(EthereumUtil.ensureHexStandardFormat('abcd')).to.equal('abcd')
    })
  })

  describe('ensureAddressStandardFormat', () => {
    it('should return address without 0x prefix', () => {
      expect(EthereumUtil.ensureAddressStandardFormat('0xf1ffb11d20fd92a2ad9b32d2f75e9dc890b8dad19d074d8237dd60242bf13a53')).to.equal('f1ffb11d20fd92a2ad9b32d2f75e9dc890b8dad19d074d8237dd60242bf13a53')
    })

    it('should return same address if not prefixed with-0x', () => {
      expect(EthereumUtil.ensureAddressStandardFormat('f1ffb11d20fd92a2ad9b32d2f75e9dc890b8dad19d074d8237dd60242bf13a53')).to.equal('f1ffb11d20fd92a2ad9b32d2f75e9dc890b8dad19d074d8237dd60242bf13a53')
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
