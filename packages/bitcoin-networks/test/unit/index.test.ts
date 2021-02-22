/* eslint-env mocha */

import { expect } from 'chai'

import BitcoinNetworks from '../../lib'

describe('BitcoinNetworks', () => {
  describe('Versions', () => {
    it('has version string', async () => {
      expect(BitcoinNetworks.bitcoin.name).to.equal('bitcoin')
    })
  })
})
