/* global describe, it */

const ChainAbstractionLayer = require('../')
const assert = require('assert')

const bitcoin = new ChainAbstractionLayer('bitcoin://bitcoin:local321@localhost:18332/?timeout=200&version=0.13.0')

describe('bitcoin rpc calls', () => {
  describe('generate', () => {
    it('should return hash of generated block and increment block height', async () => {
      const initialBlockHeight = await bitcoin.getBlockHeight()
      const generatedBlockHashes = await bitcoin.generate(10)
      const finalBlockHeight = await bitcoin.getBlockHeight()

      assert.equal(generatedBlockHashes.length, 10)
      assert.equal(finalBlockHeight, initialBlockHeight + 10)
    })
  })
})
