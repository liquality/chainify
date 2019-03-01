/* eslint-env mocha */

const { expect } = require('chai').use(require('chai-as-promised'))

const BitcoinUtil = require('../../../../src/providers/bitcoin/BitcoinUtil')

describe('Bitcoin Util', () => {
  describe('compressPubKey', () => {
    it('should return compressed public key', () => {
      expect(BitcoinUtil.compressPubKey('0493fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef098574ba8b41581532c09f38e47d1790dad1a09417ddbde95af5a1314f3f08c37')).to.equal('0393fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef0')

      expect(BitcoinUtil.compressPubKey('04b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b888e708bc3648c4fab3468d2f527eb0e3da99025b0962985b2563ec191c1fd158')).to.equal('02b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b8')
    })
  })

  describe('pubKeyHashToAddress', () => {
    it('should return bitcoin address from public key hash', () => {
      expect(BitcoinUtil.pubKeyHashToAddress('9cd62b45a1af8c1a900258b382a1dc7acf9b606b', 'bitcoin', 'pubKeyHash')).to.equal('1FJGyejzu35XZapZ3BeCtGNLjxAegysDe3')
      expect(BitcoinUtil.pubKeyHashToAddress('16dd4d31677f55dcdd7bf1669dca50399a6fd8a5', 'bitcoin', 'pubKeyHash')).to.equal('135tyXBwMT6GNBViBqPZuh1SyU4D9Gykim')

      expect(BitcoinUtil.pubKeyHashToAddress('9cd62b45a1af8c1a900258b382a1dc7acf9b606b', 'bitcoin_testnet', 'pubKeyHash')).to.equal('mupEGhpyi4WnLhJAkkcaiBafbwmMca7AkR')
      expect(BitcoinUtil.pubKeyHashToAddress('16dd4d31677f55dcdd7bf1669dca50399a6fd8a5', 'bitcoin_testnet', 'pubKeyHash')).to.equal('mhbrGaGvAUXX9HyKuQMwjcDmqTev7XNKH6')
    })
  })

  describe('pubKeyToAddress', () => {
    it('should return bitcoin address from public key', () => {
      expect(BitcoinUtil.pubKeyToAddress('0393fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef0', 'bitcoin', 'pubKeyHash')).to.equal('1FJGyejzu35XZapZ3BeCtGNLjxAegysDe3')
      expect(BitcoinUtil.pubKeyToAddress('02b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b8', 'bitcoin', 'pubKeyHash')).to.equal('135tyXBwMT6GNBViBqPZuh1SyU4D9Gykim')

      expect(BitcoinUtil.pubKeyToAddress('0393fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef0', 'bitcoin_testnet', 'pubKeyHash')).to.equal('mupEGhpyi4WnLhJAkkcaiBafbwmMca7AkR')
      expect(BitcoinUtil.pubKeyToAddress('02b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b8', 'bitcoin_testnet', 'pubKeyHash')).to.equal('mhbrGaGvAUXX9HyKuQMwjcDmqTev7XNKH6')
    })
  })

  describe('addressToPubKeyHash', () => {
    it('should return public key hash from address', () => {
      expect(BitcoinUtil.addressToPubKeyHash('1FJGyejzu35XZapZ3BeCtGNLjxAegysDe3')).to.equal('9cd62b45a1af8c1a900258b382a1dc7acf9b606b')
      expect(BitcoinUtil.addressToPubKeyHash('mhbrGaGvAUXX9HyKuQMwjcDmqTev7XNKH6')).to.equal('16dd4d31677f55dcdd7bf1669dca50399a6fd8a5')
    })
  })

  describe('reverseBuffer', () => {
    it('should return reversed buffer', () => {
      expect(BitcoinUtil.reverseBuffer(Buffer.from('abcdef', 'hex'))).to.deep.equal(Buffer.from('efcdab', 'hex'))
    })
  })
})
