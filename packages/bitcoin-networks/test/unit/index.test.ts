/* eslint-env mocha */

import { expect } from 'chai'

import { version } from '../../lib'

describe('BitcoinNetworks', () => {
  describe('Versions', () => {
    it('has version string', async () => {
      expect(version.length).to.gt(0)
    })
  })
})
