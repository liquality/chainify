/* eslint-env mocha */

import Client from '../../lib'

const { expect } = require('chai').use(require('chai-as-promised'))

describe('Client methods without providers', () => {
  let client

  beforeEach(() => {
    client = new Client()
  })

  describe('generateBlock', () => {
    it('should throw NoProviderError', async () => {
      return expect(client.chain.generateBlock(1)).to.be.rejectedWith(/No provider provided/)
    })
  })

  describe('getBlockByNumber', () => {
    it('should throw NoProviderError', async () => {
      return expect(client.chain.getBlockByNumber(1)).to.be.rejectedWith(/No provider provided/)
    })
  })

  describe('getBlockHeight', () => {
    it('should throw NoProviderError', async () => {
      return expect(client.chain.getBlockHeight()).to.be.rejectedWith(/No provider provided/)
    })
  })

  describe('getTransactionByHash', () => {
    it('should throw NoProviderError', async () => {
      return expect(client.chain.getTransactionByHash('4545')).to.be.rejectedWith(/No provider provided/)
    })
  })
})
