/* eslint-env mocha */

import { BitcoinSwapProvider } from '../../lib'
import { BitcoinNetworks } from '@liquality/bitcoin-networks'
import { BigNumber } from '@liquality/types'

import chai from 'chai'
import chaiAsPromised from 'chai-as-promised'

const { expect } = chai.use(chaiAsPromised)

describe('Bitcoin Swap provider', () => {
  let provider: BitcoinSwapProvider

  beforeEach(() => {
    provider = new BitcoinSwapProvider({ network: BitcoinNetworks.bitcoin_testnet })
  })

  describe('Generate swap', () => {
    it('should generate correct bytecode', () => {
      return expect(
        provider
          .getSwapOutput({
            value: new BigNumber(1),
            recipientAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
            refundAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
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
            recipientAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
            refundAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
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
          recipientAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
          refundAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
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
          refundAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
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
          recipientAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
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
          recipientAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
          refundAddress: 'tb1qwuv45ncnrmgaazjmzr8zxmcknvh43jagag3958',
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

  describe('doesTransactionMatchRedeem', () => {
    it('true when additional inputs used', () => {
      return expect(
        provider.doesTransactionMatchRedeem(
          '73a88ee970cc6a5b66b95671fa846185afc21fe16094c987a677c66dd07d42c0',
          {
            hash: '081baec82b2f4b1c4e9881a45aca67e93434a069feacc25b1b01832a9d8c67a6',
            value: 999424,
            _raw: {
              txid: '081baec82b2f4b1c4e9881a45aca67e93434a069feacc25b1b01832a9d8c67a6',
              hash: 'e847e8b4fdef527e207c8302bb57b81b2398c1df1fb1172e32eb836a2f8a5ad6',
              version: 2,
              size: 324,
              vsize: 143,
              weight: 570,
              locktime: 0,
              vin: [
                {
                  txid: '8ce4c9485ce4d0b9e2a553190f52a42f9d36ee2f8e91cac6409c3c37e7da1e11',
                  vout: 1,
                  scriptSig: { asm: '', hex: '' },
                  txinwitness: [
                    '034be26006f106d45f8823e48193de5a641b10f023cf033baf18ba1b698afccbb0',
                    '6382012088a8206357f9914ac0df2b5f1a3d5ec935863823392570ae3e53c111885d279c5970018876a914f61e151f00330d4020dc72295090ed3088b7f407670449d35460b17576a91491a7b76c3cbe7be085a26cb5ee04d4fe4851ba586888ac'
                  ],
                  sequence: 0
                },
                {
                  txid: '73a88ee970cc6a5b66b95671fa846185afc21fe16094c987a677c66dd07d42c0',
                  vout: 1,
                  scriptSig: { asm: '', hex: '' },
                  txinwitness: [
                    '304402204d16bbc9d39dc9afc9531fb22e3671e93125071b0d8fed24f0268c0a5b15781d02207472d3a58351025dc015e52dbe500d25599a566fc26a629aa1facfa51cb0a2d101',
                    '034be26006f106d45f8823e48193de5a641b10f023cf033baf18ba1b698afccbb0',
                    '7ce4c9485ce4d0b9e2a553190f52a42d9d36ee2f8e91cac6409c3c37e7da1e19',
                    '01',
                    '6382012088a8206357f9914ac0df2b5f1a3d5ec935863823392570ae3e53c111885d279c5970018876a914f61e151f00330d4020dc72295090ed3088b7f407670449d35460b17576a91491a7b76c3cbe7be085a26cb5ee04d4fe4851ba586888ac'
                  ],
                  sequence: 0
                }
              ],
              vout: [
                {
                  value: 0.00999424,
                  n: 0,
                  scriptPubKey: {
                    asm: '0 f61e151f00330d4020dc72295090ed3088b7f407',
                    hex: '0014f61e151f00330d4020dc72295090ed3088b7f407',
                    reqSigs: 1,
                    type: 'witness_v0_keyhash',
                    addresses: ['bcrt1q7c0p28cqxvx5qgxuwg54py8dxzyt0aq8l3jvjd']
                  }
                }
              ],
              hex:
                '02000000000101c0427dd06dc677a687c99460e11fc2af856184fa7156b9665b6acc70e98ea8730100000000000000000100400f0000000000160014f61e151f00330d4020dc72295090ed3088b7f4070547304402204d16bbc9d39dc9afc9531fb22e3671e93125071b0d8fed24f0268c0a5b15781d02207472d3a58351025dc015e52dbe500d25599a566fc26a629aa1facfa51cb0a2d10121034be26006f106d45f8823e48193de5a641b10f023cf033baf18ba1b698afccbb0207ce4c9485ce4d0b9e2a553190f52a42d9d36ee2f8e91cac6409c3c37e7da1e190101616382012088a8206357f9914ac0df2b5f1a3d5ec935863823392570ae3e53c111885d279c5970018876a914f61e151f00330d4020dc72295090ed3088b7f407670449d35460b17576a91491a7b76c3cbe7be085a26cb5ee04d4fe4851ba586888ac00000000',
              confirmations: 1
            },
            confirmations: 1,
            fee: 576,
            feePrice: 4,
            blockHash: '08a79c7ac07da56a9ad497132cccfefa80af04bc36c903bbe1f387821e147bf1',
            blockNumber: 107
          },
          false
        )
      ).to.be.true
    })
  })
})
