/* global describe, it */

const { expect } = require('chai').use(require('chai-as-promised'))

const ChainAbstractionLayer = require('../')
const { errors } = ChainAbstractionLayer

const lib = new ChainAbstractionLayer()

describe('Client methods', () => {
  describe('generateBlock', () => {
    it('should throw NoProviderError', () => {
      return expect(lib.generateBlock()).to.be.rejectedWith(errors.NoProviderError)
    })
  })

  describe('getBlockByNumber', () => {
    it('should throw NoProviderError', async () => {
      return expect(lib.getBlockByNumber()).to.be.rejectedWith(errors.NoProviderError)
    })
  })

  describe('getBlockHeight', () => {
    it('should throw NoProviderError', async () => {
      return expect(lib.getBlockHeight()).to.be.rejectedWith(errors.NoProviderError)
    })
  })

  describe('getTransactionByHash', () => {
    it('should throw NoProviderError', async () => {
      return expect(lib.getTransactionByHash()).to.be.rejectedWith(errors.NoProviderError)
    })
  })
})
