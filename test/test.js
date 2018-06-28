var ChainAbstractionLayer = require('../')
var assert = require('assert');

var bitcoin = new ChainAbstractionLayer('bitcoin://bitcoin:local321@localhost:18332/?timeout=200&version=0.13.0')

describe('bitcoin rpc calls', function() {
  describe('generate', function() {
    it('should return hash of generated block', function() {
      bitcoin.generate(10).then((result) => {
        assert.equal(result.length, 10)
      })
    })
  })
})
