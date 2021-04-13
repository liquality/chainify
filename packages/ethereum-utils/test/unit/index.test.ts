/* eslint-env mocha */

import BigNumber from 'bignumber.js'
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

  describe('buildTransaction', () => {
    it('should return transaction', () => {
      const txData = EthereumUtil.buildTransaction({
        from: '322d4959c911520645c0638204b42ce0689236e9',
        to: '635d7d148054b9471d79084b80b864a166956139',
        value: new BigNumber(1000000000),
        data: '55'
      })
      expect(txData).to.deep.equal({
        from: '0x322d4959c911520645c0638204b42ce0689236e9',
        to: '0x635d7d148054b9471d79084b80b864a166956139',
        data: '0x55',
        value: '0x3b9aca00'
      })
    })

    it('should not include null value', () => {
      const txData = EthereumUtil.buildTransaction({
        from: '322d4959c911520645c0638204b42ce0689236e9',
        to: '635d7d148054b9471d79084b80b864a166956139',
        value: null,
        data: '55'
      })
      expect(txData).to.deep.equal({
        from: '0x322d4959c911520645c0638204b42ce0689236e9',
        to: '0x635d7d148054b9471d79084b80b864a166956139',
        data: '0x55',
        value: '0x0'
      })
    })
  })

  describe('normalizeTransactionObject', () => {
    it('should remove blockNumber key if it is null', () => {
      expect(
        EthereumUtil.normalizeTransactionObject({
          hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
          nonce: '0x0',
          blockNumber: null,
          transactionIndex: '0x00',
          from: '0x322d4959c911520645c0638204b42ce0689236e9',
          to: '0x635d7d148054b9471d79084b80b864a166956139',
          value: '0x186a0',
          gas: '0x015f90',
          gasPrice: '0x04a817c800',
          input: '0x0'
        })
      ).to.deep.equal({
        hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
        value: 100000,
        _raw: {
          hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
          nonce: '0x0',
          blockNumber: null,
          transactionIndex: '0x00',
          from: '0x322d4959c911520645c0638204b42ce0689236e9',
          to: '0x635d7d148054b9471d79084b80b864a166956139',
          value: '0x186a0',
          gas: '0x015f90',
          gasPrice: '0x04a817c800',
          input: '0x0'
        },
        feePrice: 20,
        fee: 1800000000000000
      })
    })

    it('should add number of confirmation if blockNumber key is not null', () => {
      expect(
        EthereumUtil.normalizeTransactionObject(
          {
            hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
            nonce: '0x0',
            blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
            blockNumber: '0x5',
            transactionIndex: '0x00',
            from: '0x322d4959c911520645c0638204b42ce0689236e9',
            to: '0x635d7d148054b9471d79084b80b864a166956139',
            value: '0x186a0',
            gas: '0x015f90',
            gasPrice: '0x04a817c800',
            input: '0x0'
          },
          10
        )
      ).to.deep.equal({
        hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
        value: 100000,
        _raw: {
          hash: 'ca218db60aaad1a3e4d7ea815750e8bf44a89d967266c3662746f796800412cd',
          nonce: '0x0',
          blockHash: '0x1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
          blockNumber: '0x5',
          transactionIndex: '0x00',
          from: '0x322d4959c911520645c0638204b42ce0689236e9',
          to: '0x635d7d148054b9471d79084b80b864a166956139',
          value: '0x186a0',
          gas: '0x015f90',
          gasPrice: '0x04a817c800',
          input: '0x0'
        },
        blockHash: '1d59ff54b1eb26b013ce3cb5fc9dab3705b415a67127a003c3e61eb445bb8df2',
        blockNumber: 5,
        confirmations: 6,
        feePrice: 20,
        fee: 1800000000000000
      })
    })
  })
})
