/* global describe, it */

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')

chai.use(chaiAsPromised)

const { expect } = chai

const ChainAbstractionLayer = require('../')

const lib = new ChainAbstractionLayer()

describe('Bitcoin methods', () => {
  describe('generateBlock', () => {
    it('should throw an error', () => {
      return expect(lib.generateBlock()).to.be.rejectedWith(Error)
    })
  })

  describe('getBlockByNumber', () => {
    it('should throw an error', async () => {
      return expect(lib.getBlockByNumber()).to.be.rejectedWith(Error)
    })
  })

  describe('getBlockHeight', () => {
    it('should throw an error', async () => {
      return expect(lib.getBlockHeight()).to.be.rejectedWith(Error)
    })
  })

  describe('getTransactionByHash', () => {
    it('should throw an error', async () => {
      return expect(lib.getTransactionByHash()).to.be.rejectedWith(Error)
    })
  })
})
