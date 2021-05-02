/* eslint-env mocha */

import BitcoinCashSwapProvider from '../../lib'
import BitcoinCashNetworks from '../../../bitcoin-cash-networks' //'@liquality/bitcoin-cash-networks'
import { BigNumber } from '@liquality/types'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)

describe('Bitcoin Cash Swap provider', () => {
  let provider: BitcoinCashSwapProvider

  beforeEach(() => {
    provider = new BitcoinCashSwapProvider({ network: BitcoinCashNetworks.bitcoin_cash_testnet })
  })

  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(
        provider
          .getSwapOutput({
            value: new BigNumber(1),
            recipientAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
            refundAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353
          })
          .toString('hex')
      ).to.equal(
        '6382012088a820ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8876a91477195a4f131ed1de8a5b10ce236f169b2f58cba8670431de8257b17576a91477195a4f131ed1de8a5b10ce236f169b2f58cba86888ac'
      )
    })

    it('should generate correct bytecode with big expiration', () => {
      return expect(
        provider
          .getSwapOutput({
            value: new BigNumber(1),
            recipientAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
            refundAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
            secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
            expiration: 1468194353000
          })
          .toString('hex')
      ).to.equal(
        '6382012088a820ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8876a91477195a4f131ed1de8a5b10ce236f169b2f58cba8670568ef33d700b17576a91477195a4f131ed1de8a5b10ce236f169b2f58cba86888ac'
      )
    })
  })
  describe('Swap contract expiration validation', () => {
    function testExpirationInvalid(expiration: any) {
      return expect(() =>
        provider.getSwapOutput({
          value: new BigNumber(1),
          recipientAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
          refundAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
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
      testExpirationInvalid('123')
    })
  })

  describe('Swap contract address validation', () => {
    function testRecipientAddress(recipientAddress: any) {
      return expect(() =>
        provider.getSwapOutput({
          value: new BigNumber(1),
          recipientAddress,
          refundAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
          secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          expiration: 1468194353
        })
      )
        .to.throw()
        .property('name', 'InvalidAddressError')
    }

    function testRefundAddress(refundAddress: any) {
      return expect(() =>
        provider.getSwapOutput({
          value: new BigNumber(1),
          recipientAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
          refundAddress,
          secretHash: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          expiration: 1468194353
        })
      )
        .to.throw()
        .property('name', 'InvalidAddressError')
    }

    it('should throw error with address wrong type', () => {
      testRecipientAddress(123)
      testRefundAddress(123)
    })

    it('should throw error with address wrong format', () => {
      testRecipientAddress('tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958wrong')
      testRefundAddress('tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958wrong')
    })

    it('should throw error with address wrong network', () => {
      testRecipientAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')
      testRefundAddress('bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq')
    })
  })

  describe('Swap contract secretHash validation', () => {
    function testSecretHash(secretHash: string) {
      return expect(() =>
        provider.getSwapOutput({
          value: new BigNumber(1),
          recipientAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
          refundAddress: 'bchtest:qpm3jkj0zv0drh52tvgvugm0z6dj7kxt4qyjfthvfm',
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

  describe('Redeem swap', () => {
    it('should generate correct bytecode', () => {
      return expect(
        provider
          .getSwapInput(
            Buffer.from(
              '3045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c01',
              'hex'
            ),
            Buffer.from(
              '04edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d',
              'hex'
            ),
            true,
            '01020304050607080900'
          )
          .toString('hex')
      ).to.equal(
        '483045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c014104edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d0a0102030405060708090051'
      )
    })
  })

  describe('Refund swap', () => {
    it('should generate correct bytecode', () => {
      return expect(
        provider
          .getSwapInput(
            Buffer.from(
              '3045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c01',
              'hex'
            ),
            Buffer.from(
              '04edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d',
              'hex'
            ),
            false
          )
          .toString('hex')
      ).to.equal(
        '483045022041b51d5980e4d319ff05291fcf9049a10b86cc54c5836f2de8ea6bb8ecf419a60221006013a4da68758f2738bfbb9598697758c51dfb96c60a3182517ed8751c603c0c014104edde15dab6b611928fd34406dd465e369a616d789ee42a97f69fe0dcac6399871e7085925dcd012da78ecda5836f616c010afbcd3a8292b62ea6963281a65a9d00'
      )
    })
  })
})
