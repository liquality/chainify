/* eslint-env mocha */

import { expect } from 'chai'

import BitcoinCashNetworks from '../../../bitcoin-cash-networks/lib'
import * as BitcoinCashUtil from '../../lib'

describe('Bitcoin Cash Util', () => {
  describe('calculateFee', () => {
    it('should return correct fees', () => {
      expect(BitcoinCashUtil.calculateFee(1, 1, 3)).to.equal(576)
      expect(BitcoinCashUtil.calculateFee(2, 1, 3)).to.equal(1020)
    })
  })

  describe('compressPubKey', () => {
    it('should return compressed public key', () => {
      expect(
        BitcoinCashUtil.compressPubKey(
          '0493fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef098574ba8b41581532c09f38e47d1790dad1a09417ddbde95af5a1314f3f08c37'
        )
      ).to.equal('0393fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef0')

      expect(
        BitcoinCashUtil.compressPubKey(
          '04b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b888e708bc3648c4fab3468d2f527eb0e3da99025b0962985b2563ec191c1fd158'
        )
      ).to.equal('02b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b8')
    })
  })

  describe('txHashToObject', () => {
    it('p2sh (swap)', () => {
      const hash =
        '0200000001e0b3fcb18629bffc29f41f3d97292262843a0d1ed5417df54b697a3cd58e6c04010000006b483045022100a24595c0797cda919ddf191b31cfa237aee7717a14602cb3139f816ed7940bf202200b07df394ead43162a52b043795c97f7c9cb48626068d4acd7166cea1b58dfab4121033c056ade10b36e72402c6cabaf3a144c2766284a5781dbba04969b9866eb720ffeffffff02e80300000000000017a914c2c07da0d1029012de3608322affa8e3d0a0d466875b247504000000001976a91488ced5c06b367d02c8f04b436b063ed49ce0009488ac1ba40700'
      const object = BitcoinCashUtil.decodeRawTransaction(hash, BitcoinCashNetworks.bitcoin_cash)
      expect(object).to.deep.equal({
        txid: 'c46587a8709014cc644bde757a51445c9b829e73a2f08266b84ace09677c61a5',
        hash: 'c46587a8709014cc644bde757a51445c9b829e73a2f08266b84ace09677c61a5',
        version: 2,
        locktime: 500763,
        size: 224,
        vsize: 0,
        weight: 0,
        vin: [
          {
            txid: '046c8ed53c7a694bf57d41d51e0d3a84622229973d1ff429fcbf2986b1fcb3e0',
            vout: 1,
            scriptSig: {
              asm:
                '3045022100a24595c0797cda919ddf191b31cfa237aee7717a14602cb3139f816ed7940bf202200b07df394ead43162a52b043795c97f7c9cb48626068d4acd7166cea1b58dfab41 033c056ade10b36e72402c6cabaf3a144c2766284a5781dbba04969b9866eb720f',
              hex:
                '483045022100a24595c0797cda919ddf191b31cfa237aee7717a14602cb3139f816ed7940bf202200b07df394ead43162a52b043795c97f7c9cb48626068d4acd7166cea1b58dfab4121033c056ade10b36e72402c6cabaf3a144c2766284a5781dbba04969b9866eb720f'
            },
            sequence: 4294967294
          }
        ],
        vout: [
          {
            value: 0.00001,
            n: 0,
            scriptPubKey: {
              addresses: ['bitcoincash:prpvqldq6ypfqyk7xcyry2hl4r3apgx5vc8d28mgjw'],
              asm: 'OP_HASH160 c2c07da0d1029012de3608322affa8e3d0a0d466 OP_EQUAL',
              hex: 'a914c2c07da0d1029012de3608322affa8e3d0a0d46687',
              reqSigs: 1,
              type: 'scripthash'
            }
          },
          {
            value: 0.74785883,
            n: 1,
            scriptPubKey: {
              addresses: ['bitcoincash:qzyva4wqdvm86qkg7p95x6cx8m2fecqqjsnpcyllgw'],
              asm: 'OP_DUP OP_HASH160 88ced5c06b367d02c8f04b436b063ed49ce00094 OP_EQUALVERIFY OP_CHECKSIG',
              hex: '76a91488ced5c06b367d02c8f04b436b063ed49ce0009488ac',
              reqSigs: 1,
              type: 'pubkeyhash'
            }
          }
        ],
        hex:
          '0200000001e0b3fcb18629bffc29f41f3d97292262843a0d1ed5417df54b697a3cd58e6c04010000006b483045022100a24595c0797cda919ddf191b31cfa237aee7717a14602cb3139f816ed7940bf202200b07df394ead43162a52b043795c97f7c9cb48626068d4acd7166cea1b58dfab4121033c056ade10b36e72402c6cabaf3a144c2766284a5781dbba04969b9866eb720ffeffffff02e80300000000000017a914c2c07da0d1029012de3608322affa8e3d0a0d466875b247504000000001976a91488ced5c06b367d02c8f04b436b063ed49ce0009488ac1ba40700'
      })
    })

    it('p2wsh (swap redeem)', () => {
      const hash =
        '0200000001a5617c6709ce4ab86682f0a2739e829b5c44517a75de4b64cc149070a88765c400000000e0483045022100d12b8f8b16078816cd3b7f55a9c8d6b3a4bca382e148f0992e7bd2ef6c1ec82902201fda05716a0103bee8589653ac201466480ab513381c27c5dcba26aebb20f92b412103676cff7650b9e234b9ccbc2f49411824edb814d2009abb856e8f94745ee80191201c219f5aa297cd6e43370af03139c18b616c5b951489110486fe2a8774b1f357514c5163a614d179b059810d3a92f2034b3a7eda48793ac79c288876a91421cf3314cbb2ffa97d65847ce925c0fd0f12c2aa6704d80c005ab17576a914973d2163109e780cc499dcac0ab40fe0fab63af56888acffffffff01ae020000000000001976a9146e7c37283828af7148a202570c65f59febb40f0088acd80c005a'
      const object = BitcoinCashUtil.decodeRawTransaction(hash, BitcoinCashNetworks.bitcoin_cash)
      expect(object).to.deep.equal({
        txid: 'f08720cf546429c66caf3c4a4ad930c78af98a11fcdd6f53a83d79c86667ce8a',
        hash: 'f08720cf546429c66caf3c4a4ad930c78af98a11fcdd6f53a83d79c86667ce8a',
        version: 2,
        locktime: 1509952728,
        size: 309,
        vsize: 0,
        weight: 0,
        vin: [
          {
            txid: 'c46587a8709014cc644bde757a51445c9b829e73a2f08266b84ace09677c61a5',
            vout: 0,
            scriptSig: {
              asm:
                '3045022100d12b8f8b16078816cd3b7f55a9c8d6b3a4bca382e148f0992e7bd2ef6c1ec82902201fda05716a0103bee8589653ac201466480ab513381c27c5dcba26aebb20f92b41 03676cff7650b9e234b9ccbc2f49411824edb814d2009abb856e8f94745ee80191 1c219f5aa297cd6e43370af03139c18b616c5b951489110486fe2a8774b1f357 OP_1 63a614d179b059810d3a92f2034b3a7eda48793ac79c288876a91421cf3314cbb2ffa97d65847ce925c0fd0f12c2aa6704d80c005ab17576a914973d2163109e780cc499dcac0ab40fe0fab63af56888ac',
              hex:
                '483045022100d12b8f8b16078816cd3b7f55a9c8d6b3a4bca382e148f0992e7bd2ef6c1ec82902201fda05716a0103bee8589653ac201466480ab513381c27c5dcba26aebb20f92b412103676cff7650b9e234b9ccbc2f49411824edb814d2009abb856e8f94745ee80191201c219f5aa297cd6e43370af03139c18b616c5b951489110486fe2a8774b1f357514c5163a614d179b059810d3a92f2034b3a7eda48793ac79c288876a91421cf3314cbb2ffa97d65847ce925c0fd0f12c2aa6704d80c005ab17576a914973d2163109e780cc499dcac0ab40fe0fab63af56888ac'
            },
            sequence: 4294967295
          }
        ],
        vout: [
          {
            value: 0.00000686,
            n: 0,
            scriptPubKey: {
              asm: 'OP_DUP OP_HASH160 6e7c37283828af7148a202570c65f59febb40f00 OP_EQUALVERIFY OP_CHECKSIG',
              hex: '76a9146e7c37283828af7148a202570c65f59febb40f0088ac',
              reqSigs: 1,
              type: 'pubkeyhash',
              addresses: ['bitcoincash:qph8cdeg8q527u2g5gp9wrr97k07hdq0qqlxa0wxyd']
            }
          }
        ],
        hex:
          '0200000001a5617c6709ce4ab86682f0a2739e829b5c44517a75de4b64cc149070a88765c400000000e0483045022100d12b8f8b16078816cd3b7f55a9c8d6b3a4bca382e148f0992e7bd2ef6c1ec82902201fda05716a0103bee8589653ac201466480ab513381c27c5dcba26aebb20f92b412103676cff7650b9e234b9ccbc2f49411824edb814d2009abb856e8f94745ee80191201c219f5aa297cd6e43370af03139c18b616c5b951489110486fe2a8774b1f357514c5163a614d179b059810d3a92f2034b3a7eda48793ac79c288876a91421cf3314cbb2ffa97d65847ce925c0fd0f12c2aa6704d80c005ab17576a914973d2163109e780cc499dcac0ab40fe0fab63af56888acffffffff01ae020000000000001976a9146e7c37283828af7148a202570c65f59febb40f0088acd80c005a'
      })
    })
  })
})
