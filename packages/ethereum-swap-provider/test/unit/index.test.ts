/* eslint-env mocha */

import { BigNumber } from '@liquality/types'
import EthereumSwapProvider from '../../lib'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)

describe('Ethereum Swap provider', () => {
  let provider: EthereumSwapProvider

  beforeEach(() => {
    provider = new EthereumSwapProvider()
  })

  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(
        provider.createSwapScript({
          value: new BigNumber(111),
          recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
          refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
          secretHash: '91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e',
          expiration: 1615566223
        })
      ).to.equal(
        '60c880600b6000396000f36020806000803760218160008060026048f136602014167f91d6a24697ed31932537ae598d3de3131e1fcd0641b9ac4be7afcb376386d71e6021511416604f5736156400604b958f421116608c57fe5b7f8c1d64e3bd87387709175b9ef4e7a1d7a8364559fc0e2ad9d77953909a0d1eb360206000a1735acbf79d0cf4139a6c3eca85b41ce2bd23ced04fff5b7f5d26862916391bf49478b2f5103b0720a842b45ef145a268f2cd1fb2aed55178600080a1730a81e8be41b21f651a71aab1a85c6813b8bbccf8ff'
      )
    })

    describe('Swap contract address validation', () => {
      function testRecipientAddress(recipientAddress: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress,
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidAddressError')
      }

      function testRefundAddress(refundAddress: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            refundAddress,
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidAddressError')
      }

      it('should throw error with address wrong type', () => {
        // @ts-ignore
        testRecipientAddress(123)
        // @ts-ignore
        testRefundAddress(123)
      })

      it('should throw error with address wrong format', () => {
        testRecipientAddress('zzzzzzzz41b21f651a71aab1a85c6813b8bbccf8')
        testRefundAddress('zzzzzzzz41b21f651a71aab1a85c6813b8bbccf8')
      })

      it('should throw error with address too short', () => {
        testRecipientAddress('e8be41b21f651a71aab1a85c6813b8bbccf8')
        testRefundAddress('e8be41b21f651a71aab1a85c6813b8bbccf8')
      })

      it('should throw error with address too long', () => {
        testRecipientAddress('0a81e8be41b21f651a71aab1a85c6813b8bbccf888888888')
        testRefundAddress('0a81e8be41b21f651a71aab1a85c6813b8bbccf888888888')
      })
    })

    describe('Swap contract secretHash validation', () => {
      function testSecretHash(secretHash: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash,
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidSecretError')
      }

      it('should throw when secretHash too small', () => {
        testSecretHash('ffff')
      })

      it('should throw when secretHash too large', () => {
        testSecretHash('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      })

      it('should throw when secretHash not hex', () => {
        testSecretHash('OPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOP')
      })

      it('should throw error when secret hash is hash of secret 0', () => {
        testSecretHash('66687aadf862bd776c8fc18b8e9f8e20089714856ee233b3902a591d0d5f2925')
      })
    })

    describe('Swap contract expiration validation', () => {
      function testExpirationInvalid(expiration: number) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration
          })
        )
          .to.throw()
          .property('name', 'InvalidExpirationError')
      }

      it('should throw error with 0 expiration', () => {
        testExpirationInvalid(0)
      })

      it('should throw error with expiration too small', () => {
        testExpirationInvalid(5000000)
      })

      it('should throw error with expiration too big', () => {
        testExpirationInvalid(1234567891234567)
      })

      it('should throw error with expiration not number', () => {
        // @ts-ignore
        testExpirationInvalid('123')
      })
    })

    describe('Swap contract secretHash validation', () => {
      it('should accept valid secretHash', () => {
        provider.createSwapScript({
          value: new BigNumber(111),
          recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
          refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
          secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          expiration: 1468194353
        })
      })

      function testSecretHash(secretHash: string) {
        return expect(() =>
          provider.createSwapScript({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash,
            expiration: 1468194353
          })
        )
          .to.throw()
          .property('name', 'InvalidSecretError')
      }

      it('should throw when secretHash too small', () => {
        testSecretHash('ffff')
      })

      it('should throw when secretHash too large', () => {
        testSecretHash('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
      })

      it('should throw when secretHash not hex', () => {
        testSecretHash('OPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOPOP')
      })
    })
  })
})
