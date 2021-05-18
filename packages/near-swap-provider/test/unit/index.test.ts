/* eslint-env mocha */
import { BigNumber } from '@liquality/types'
import { NearSwapProvider } from '../../lib'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)

describe('Near Swap provider', () => {
  let provider: NearSwapProvider

  beforeEach(() => {
    provider = new NearSwapProvider()
  })

  describe('Generate swap', async () => {
    describe('Swap contract address validation', async () => {
      async function testRecipientAddress(recipientAddress: string) {
        return expect(
          provider.initiateSwap({
            value: new BigNumber(111),
            recipientAddress,
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353
          })
        ).to.be.rejectedWith('Invalid address')
      }

      async function testRefundAddress(refundAddress: string) {
        return expect(
          provider.initiateSwap({
            value: new BigNumber(111),
            recipientAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            refundAddress,
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353
          })
        ).to.be.rejectedWith('Invalid address')
      }

      it('should throw error with address wrong type', async () => {
        // @ts-ignore
        testRecipientAddress(123)
        // @ts-ignore
        testRefundAddress(123)
      })

      it('should throw error with address too short', () => {
        testRecipientAddress('1')
        testRefundAddress('1')
      })

      it('should throw error with address too long', () => {
        testRecipientAddress('0a81e8be41b21f651a71aab1a85c6813b8bbccf88888888888888888888888888')
        testRefundAddress('0a81e8be41b21f651a71aab1a85c6813b8bbccf88888888888888888888888888')
      })
    })

    describe('Swap contract secretHash validation', () => {
      async function testSecretHash(secretHash: string) {
        return expect(
          provider.initiateSwap({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash,
            expiration: 1468194353
          })
        ).to.be.rejectedWith('Invalid secret hash')
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
      async function testExpirationInvalid(expiration: number) {
        return expect(
          provider.initiateSwap({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration
          })
        ).to.be.rejectedWith('Invalid expiration')
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
      async function testSecretHash(secretHash: string) {
        return expect(
          provider.initiateSwap({
            value: new BigNumber(111),
            recipientAddress: '5acbf79d0cf4139a6c3eca85b41ce2bd23ced04f',
            refundAddress: '0a81e8be41b21f651a71aab1a85c6813b8bbccf8',
            secretHash,
            expiration: 1468194353
          })
        ).to.be.rejectedWith('Invalid secret hash')
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
