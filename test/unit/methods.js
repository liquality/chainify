/* global describe, it */

const { expect } = require('chai').use(require('chai-as-promised'))

const { Client, errors } = require('../../')

const lib = new Client()

describe('Client methods', () => {
  describe('generateBlock', () => {
    it('should throw NoProviderError', () => {
      return expect(lib.generateBlock(1)).to.be.rejectedWith(errors.NoProviderError)
    })
  })

  describe('getBlockByNumber', () => {
    it('should throw NoProviderError', async () => {
      return expect(lib.getBlockByNumber(1)).to.be.rejectedWith(errors.NoProviderError)
    })
  })

  describe('getBlockHeight', () => {
    it('should throw NoProviderError', async () => {
      return expect(lib.getBlockHeight()).to.be.rejectedWith(errors.NoProviderError)
    })
  })

  describe('getTransactionByHash', () => {
    it('should throw NoProviderError', async () => {
      return expect(lib.getTransactionByHash('4545')).to.be.rejectedWith(errors.NoProviderError)
    })
  })
})
