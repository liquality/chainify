/* eslint-env mocha */

import * as crypto from '../../lib'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)

describe('Crypto library', () => {
  describe('ensureBuffer', () => {
    it('should return same input if input is a buffer', () => {
      const input = Buffer.from('LIQ')
      expect(crypto.ensureBuffer(input)).to.deep.equal(input)
    })

    it('should return buffer of a given non-hex string', () => {
      expect(crypto.ensureBuffer('LIQ')).to.deep.equal(Buffer.from('LIQ'))
    })

    it('should return buffer of a given hex string', () => {
      expect(crypto.ensureBuffer('4c4951')).to.deep.equal(Buffer.from('LIQ'))
    })

    it('should return buffer of a given object', () => {
      expect(crypto.ensureBuffer({ message: 'LIQ' })).to.deep.equal(Buffer.from(JSON.stringify({ message: 'LIQ' })))
    })
  })

  describe('isHex', () => {
    it('should return true for a hex', () => {
      expect(crypto.isHex('0c')).to.equal(true)
      expect(crypto.isHex('01')).to.equal(true)
      expect(crypto.isHex('0cab')).to.equal(true)
      expect(crypto.isHex('4c4951')).to.equal(true)
    })

    it('should return false for a hex', () => {
      expect(crypto.isHex('0')).to.equal(false)
      expect(crypto.isHex('1')).to.equal(false)
      expect(crypto.isHex('2')).to.equal(false)
      expect(crypto.isHex('k')).to.equal(false)
    })
  })

  describe('padHexStart', () => {
    it('should return same value if length of hex is a multiple of two', () => {
      expect(crypto.padHexStart('0c')).to.equal('0c')
      expect(crypto.padHexStart('01')).to.equal('01')
      expect(crypto.padHexStart('0cab')).to.equal('0cab')
      expect(crypto.padHexStart('4c4951')).to.equal('4c4951')
    })

    it('should return 0-prefixed hex', () => {
      expect(crypto.padHexStart('c')).to.equal('0c')
      expect(crypto.padHexStart('1')).to.equal('01')
      expect(crypto.padHexStart('cab')).to.equal('0cab')
      expect(crypto.padHexStart('4c495')).to.equal('04c495')
    })

    it('should return hex with 0-prefix if length is less than 2 ', () => {
      expect(crypto.padHexStart('1', 1)).to.equal('01')
      expect(crypto.padHexStart('12', 1)).to.equal('12')
      expect(crypto.padHexStart('caab', 1)).to.equal('caab')
      expect(crypto.padHexStart('4c4951', 1)).to.equal('4c4951')
      expect(crypto.padHexStart('c4951', 3)).to.equal('0c4951')
      expect(crypto.padHexStart('4c4951', 16)).to.equal('000000000000000000000000004c4951')
    })
  })
})
