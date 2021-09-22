/* eslint-env mocha */

import { expect } from 'chai'

import { BitcoinNetworks } from '../../../bitcoin-networks/lib'
import * as BitcoinUtil from '../../lib'

describe('Bitcoin Util', () => {
  describe('calculateFee', () => {
    it('should return correct fees', () => {
      expect(BitcoinUtil.calculateFee(1, 1, 3)).to.equal(576)
      expect(BitcoinUtil.calculateFee(2, 1, 3)).to.equal(1020)
    })
  })

  describe('compressPubKey', () => {
    it('should return compressed public key', () => {
      expect(
        BitcoinUtil.compressPubKey(
          '0493fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef098574ba8b41581532c09f38e47d1790dad1a09417ddbde95af5a1314f3f08c37'
        )
      ).to.equal('0393fc49dfd662510bc4d91b4f689d1732ebe4e2d7a67eebc37f76c8d6ec283ef0')

      expect(
        BitcoinUtil.compressPubKey(
          '04b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b888e708bc3648c4fab3468d2f527eb0e3da99025b0962985b2563ec191c1fd158'
        )
      ).to.equal('02b1c13be24ddc9f6e816d5469f0874ed965c8bef4084b465f679bf05071b676b8')
    })
  })

  describe('txHashToObject', () => {
    it('p2pkh', () => {
      const hash =
        '020000000001011182e546883117f452e149d6c41860b44aee08d78301f2c4b5c2c6ad101b7d8d0100000000feffffff02d09d0000000000001600140384470c5c402867c6e40119231e7a732ac3b4d5a8ac0000000000001600146a2418bf6c2793de2e9bd1c9d6678da8a7b040c002473044022041f7089160898e4e2cec53750d2de21246dd8266d9fd7668cfdf4533ae5768f9022037182f3e079ab520d870d83e6641d88bad7b4e2e52d4d5f67a80583c4300b55c012102ab26c5b6f37b9a6c7067bbc1d73ba83e2bb00e37154ded1792b9585c51383b1314000000'
      const object = BitcoinUtil.decodeRawTransaction(hash, BitcoinNetworks.bitcoin_testnet)
      expect(object).to.deep.equal({
        txid: '45871d937748494309804357a7ba2924c59a50fede67d25f38547d6f41d51ae3',
        hash: '53234f5d0dc8c8bcd7120652151e40a0c959618dfb45ed7d983fdbbc9ce86239',
        version: 2,
        size: 222,
        vsize: 141,
        weight: 561,
        locktime: 20,
        vin: [
          {
            txid: '8d7d1b10adc6c2b5c4f20183d708ee4ab46018c4d649e152f417318846e58211',
            vout: 1,
            scriptSig: {
              asm: '',
              hex: ''
            },
            txinwitness: [
              '3044022041f7089160898e4e2cec53750d2de21246dd8266d9fd7668cfdf4533ae5768f9022037182f3e079ab520d870d83e6641d88bad7b4e2e52d4d5f67a80583c4300b55c01',
              '02ab26c5b6f37b9a6c7067bbc1d73ba83e2bb00e37154ded1792b9585c51383b13'
            ],
            sequence: 4294967294
          }
        ],
        vout: [
          {
            value: 0.000404,
            n: 0,
            scriptPubKey: {
              asm: 'OP_0 0384470c5c402867c6e40119231e7a732ac3b4d5',
              hex: '00140384470c5c402867c6e40119231e7a732ac3b4d5',
              reqSigs: 1,
              type: 'witness_v0_keyhash',
              addresses: ['tb1qqwzywrzugq5x03hyqyvjx8n6wv4v8dx497ptcc']
            }
          },
          {
            value: 0.000442,
            n: 1,
            scriptPubKey: {
              asm: 'OP_0 6a2418bf6c2793de2e9bd1c9d6678da8a7b040c0',
              hex: '00146a2418bf6c2793de2e9bd1c9d6678da8a7b040c0',
              reqSigs: 1,
              type: 'witness_v0_keyhash',
              addresses: ['tb1qdgjp30mvy7faut5m68yaveud4znmqsxqcdtpap']
            }
          }
        ],
        hex:
          '020000000001011182e546883117f452e149d6c41860b44aee08d78301f2c4b5c2c6ad101b7d8d0100000000feffffff02d09d0000000000001600140384470c5c402867c6e40119231e7a732ac3b4d5a8ac0000000000001600146a2418bf6c2793de2e9bd1c9d6678da8a7b040c002473044022041f7089160898e4e2cec53750d2de21246dd8266d9fd7668cfdf4533ae5768f9022037182f3e079ab520d870d83e6641d88bad7b4e2e52d4d5f67a80583c4300b55c012102ab26c5b6f37b9a6c7067bbc1d73ba83e2bb00e37154ded1792b9585c51383b1314000000'
      })
    })

    it('p2wsh (swap)', () => {
      const hash =
        '0200000000010178633fee2c731ce69f8371e8d729146b53ce2fa2c9efcbe19bab6cf904c24feb00000000000000000002e49915030000000022002060a5dc9e85a041ef4ff3126f0baca6a9f78940ed6d33f4962629a7ee34d0b9c59cd6df0200000000160014cd05fe5ca22d62136d263dfa3c8adc764965f1e502483045022100e354e70ffeb5c4a6ee50b4e8bf84c5628f1d4a29e37573a99b8ab06d677361f202200cd9eff551ccafc081d6f154c3e2707383317ba75c70b62416fd9285378e254a0121034a7c401ba34336db48cd87cc3b363430bd1f85e4c7d723442a6ee1325d467ea300000000'
      const object = BitcoinUtil.decodeRawTransaction(hash, BitcoinNetworks.bitcoin)
      expect(object).to.deep.equal({
        txid: 'bea65e9461a333703c5f4f2c65a3204469a6016857df41b5aff0ecc7269f1cd9',
        hash: '0c08692041da03c3bdbb834bf4fb544f9f4b9373ec1f37af8eade84c38d074fa',
        version: 2,
        size: 235,
        vsize: 153,
        weight: 610,
        locktime: 0,
        vin: [
          {
            txid: 'eb4fc204f96cab9be1cbefc9a22fce536b1429d7e871839fe61c732cee3f6378',
            vout: 0,
            scriptSig: {
              asm: '',
              hex: ''
            },
            txinwitness: [
              '3045022100e354e70ffeb5c4a6ee50b4e8bf84c5628f1d4a29e37573a99b8ab06d677361f202200cd9eff551ccafc081d6f154c3e2707383317ba75c70b62416fd9285378e254a01',
              '034a7c401ba34336db48cd87cc3b363430bd1f85e4c7d723442a6ee1325d467ea3'
            ],
            sequence: 0
          }
        ],
        vout: [
          {
            value: 0.517473,
            n: 0,
            scriptPubKey: {
              asm: 'OP_0 60a5dc9e85a041ef4ff3126f0baca6a9f78940ed6d33f4962629a7ee34d0b9c5',
              hex: '002060a5dc9e85a041ef4ff3126f0baca6a9f78940ed6d33f4962629a7ee34d0b9c5',
              reqSigs: 1,
              type: 'witness_v0_scripthash',
              addresses: ['bc1qvzjae8595pq77nlnzfhsht9x48mcjs8dd5elf93x9xn7udxsh8zsjva57z']
            }
          },
          {
            value: 0.482239,
            n: 1,
            scriptPubKey: {
              asm: 'OP_0 cd05fe5ca22d62136d263dfa3c8adc764965f1e5',
              hex: '0014cd05fe5ca22d62136d263dfa3c8adc764965f1e5',
              reqSigs: 1,
              type: 'witness_v0_keyhash',
              addresses: ['bc1qe5zluh9z943pxmfx8harezkuweyktu09cxxkac']
            }
          }
        ],
        hex:
          '0200000000010178633fee2c731ce69f8371e8d729146b53ce2fa2c9efcbe19bab6cf904c24feb00000000000000000002e49915030000000022002060a5dc9e85a041ef4ff3126f0baca6a9f78940ed6d33f4962629a7ee34d0b9c59cd6df0200000000160014cd05fe5ca22d62136d263dfa3c8adc764965f1e502483045022100e354e70ffeb5c4a6ee50b4e8bf84c5628f1d4a29e37573a99b8ab06d677361f202200cd9eff551ccafc081d6f154c3e2707383317ba75c70b62416fd9285378e254a0121034a7c401ba34336db48cd87cc3b363430bd1f85e4c7d723442a6ee1325d467ea300000000'
      })
    })

    it('p2wsh (swap redeem)', () => {
      const hash =
        '02000000000101d91c9f26c7ecf0afb541df576801a6694420a3652c4f5f3c7033a361945ea6be00000000000000000001a45e150300000000160014c42dba1576d9ba619d92b47e26f97f8790a65b8405483045022100afbf55d5991ca4e8a9e423e39d55011f12e99fd8def7cc4a0347d777d1910ed802201aba22c141f34df7dc954dfbf0d1224c6ad05f6df70345c0903c948283532e9201210304bb3f24bd44298d578257e42c61f716f884b4743780eef03c4b1e0a30a35fe420767050193726eb46aa4efb0dc6979a53c515b061d9c4d043871b30fcb99d80220101616382012088a82014f786ddd0b839deec2c27357eb4e5a82ac2030e2b9782f5f05e0945ce5e32918876a914c42dba1576d9ba619d92b47e26f97f8790a65b846704332c3a5fb17576a914128371468880b80dd995b31e5cdef8a5acbd7f936888ac00000000'
      const object = BitcoinUtil.decodeRawTransaction(hash, BitcoinNetworks.bitcoin)
      expect(object).to.deep.equal({
        txid: '5769cc8b37a9c7b3463ed616b5df5210ea705779090e6267f8bfcd8f23560041',
        hash: '7dbfcd3a5c93ff371fe86c5e827ce97bb1d276ec38f6f0d09b387dc5a0e693b8',
        version: 2,
        size: 325,
        vsize: 143,
        weight: 571,
        locktime: 0,
        vin: [
          {
            txid: 'bea65e9461a333703c5f4f2c65a3204469a6016857df41b5aff0ecc7269f1cd9',
            vout: 0,
            scriptSig: {
              asm: '',
              hex: ''
            },
            txinwitness: [
              '3045022100afbf55d5991ca4e8a9e423e39d55011f12e99fd8def7cc4a0347d777d1910ed802201aba22c141f34df7dc954dfbf0d1224c6ad05f6df70345c0903c948283532e9201',
              '0304bb3f24bd44298d578257e42c61f716f884b4743780eef03c4b1e0a30a35fe4',
              '767050193726eb46aa4efb0dc6979a53c515b061d9c4d043871b30fcb99d8022',
              '01',
              '6382012088a82014f786ddd0b839deec2c27357eb4e5a82ac2030e2b9782f5f05e0945ce5e32918876a914c42dba1576d9ba619d92b47e26f97f8790a65b846704332c3a5fb17576a914128371468880b80dd995b31e5cdef8a5acbd7f936888ac'
            ],
            sequence: 0
          }
        ],
        vout: [
          {
            value: 0.51732132,
            n: 0,
            scriptPubKey: {
              asm: 'OP_0 c42dba1576d9ba619d92b47e26f97f8790a65b84',
              hex: '0014c42dba1576d9ba619d92b47e26f97f8790a65b84',
              reqSigs: 1,
              type: 'witness_v0_keyhash',
              addresses: ['bc1qcskm59tkmxaxr8vjk3lzd7tls7g2vkuyujtvl3']
            }
          }
        ],
        hex:
          '02000000000101d91c9f26c7ecf0afb541df576801a6694420a3652c4f5f3c7033a361945ea6be00000000000000000001a45e150300000000160014c42dba1576d9ba619d92b47e26f97f8790a65b8405483045022100afbf55d5991ca4e8a9e423e39d55011f12e99fd8def7cc4a0347d777d1910ed802201aba22c141f34df7dc954dfbf0d1224c6ad05f6df70345c0903c948283532e9201210304bb3f24bd44298d578257e42c61f716f884b4743780eef03c4b1e0a30a35fe420767050193726eb46aa4efb0dc6979a53c515b061d9c4d043871b30fcb99d80220101616382012088a82014f786ddd0b839deec2c27357eb4e5a82ac2030e2b9782f5f05e0945ce5e32918876a914c42dba1576d9ba619d92b47e26f97f8790a65b846704332c3a5fb17576a914128371468880b80dd995b31e5cdef8a5acbd7f936888ac00000000'
      })
    })
  })
})
