/* eslint-env mocha */
import chai, { expect } from 'chai'

import Client from '../../../client/lib'
import BitcoinNetworks from '../../../bitcoin-networks/lib'
import BitcoinRpcProvider from '../../lib'

import mockJsonRpc from '../../../../test/mock/mockJsonRpc'
import bitcoinRpc from '../../../../test/mock/bitcoin/rpc'

chai.config.truncateThreshold = 0

describe('Bitcoin RPC provider', () => {
  let client: Client
  let provider: BitcoinRpcProvider

  beforeEach(() => {
    client = new Client()
    provider = new BitcoinRpcProvider({
      uri: 'http://localhost:18443',
      username: 'bitcoin',
      password: 'local321',
      network: BitcoinNetworks.bitcoin_testnet
    })
    client.addProvider(provider)

    mockJsonRpc('http://localhost:18443', bitcoinRpc, 100)
  })

  describe('getFeePerByte', () => {
    it('should return default value 3 sat per byte', async () => {
      const fee = await provider.getFeePerByte(null)
      expect(fee).to.equal(3)
    })
  })

  describe('getBlockHeight', () => {
    it('should return correct block height', async () => {
      const height = await provider.getBlockHeight()
      expect(height).to.equal(114)
    })
  })

  describe('decodeRawTransaction', () => {
    it('should return decoded transaction', async () => {
      const tx = await provider.decodeRawTransaction(
        '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000'
      )

      expect(tx).to.deep.equal({
        txid: 'cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4',
        size: 99,
        version: 1,
        locktime: 0,
        vin: [
          {
            coinbase: '01660101',
            sequence: 4294967295
          }
        ],
        vout: [
          {
            value: 50.0000384,
            n: 0,
            scriptPubKey: {
              asm: '03106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deff OP_CHECKSIG',
              hex: '2103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac',
              reqSigs: 1,
              type: 'pubkey',
              addresses: ['mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc']
            }
          }
        ]
      })
    })
  })

  describe('getBlockByHash', () => {
    it('should return a block', async () => {
      const block = await provider.getBlockByHash('494a5c635fd483c82a4a684f3982f52af27a29ee5217a0409cdad45afc2709d7')
      expect(block).to.deep.equal({
        hash: '494a5c635fd483c82a4a684f3982f52af27a29ee5217a0409cdad45afc2709d7',
        number: 630,
        timestamp: 1590562814,
        difficulty: 4.656542373906925e-10,
        size: 451,
        parentHash: '42aea9df22bc513317d9a21d319ed102c6a36d02e823c720dbead2bbec69eebc',
        nonce: 0,
        transactions: [
          '9f4d7c7e4e42ebf11e3985c9c4057c47b0513039ea437a33c390164bcd00bb5a',
          '504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd'
        ]
      })
    })
  })

  describe('getBalance', () => {
    it('should return correct balance in sats', async () => {
      const balance = await provider.getBalance(['mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc'])
      expect(balance.eq(20000000)).to.be.true
    })
  })

  describe('getRawTransactionByHash', () => {
    it('should return a raw transaction', async () => {
      const tx = await provider.getRawTransactionByHash(
        '504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd'
      )
      expect(tx).to.equal(
        '0200000001ff1157410fd0fe4363c96331565ea039a581fffd444297238014b61c22e120a4000000004847304402206797722ab2d452a41d3dbccbe046712218a3263596db92c432cdfade9d06355f02200b3c68caad6906d01eb589686d725551de1c3b3adb7874cb11271a91a323f12301feffffff0200e1f5050000000017a91448f1346b4453d0a208cef9d6b1722d87c6b3f11e87a4ce4a1f0000000017a9143acc14bffd075dcaeff623d4c4ac11472a1fcff78775020000'
      )
    })
  })

  describe('getTransactionByHash', () => {
    it('should return a transaction', async () => {
      const tx = await provider.getTransactionByHash('504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd')
      expect(tx).to.deep.equal({
        hash: '504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd',
        value: 624996260,
        _raw: {
          txid: '504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd',
          hash: '504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd',
          version: 2,
          size: 187,
          vsize: 187,
          weight: 748,
          locktime: 629,
          vin: [
            {
              txid: 'a420e1221cb6148023974244fdff81a539a05e563163c96343fed00f415711ff',
              vout: 0,
              scriptSig: {
                asm:
                  '304402206797722ab2d452a41d3dbccbe046712218a3263596db92c432cdfade9d06355f02200b3c68caad6906d01eb589686d725551de1c3b3adb7874cb11271a91a323f123[ALL]',
                hex:
                  '47304402206797722ab2d452a41d3dbccbe046712218a3263596db92c432cdfade9d06355f02200b3c68caad6906d01eb589686d725551de1c3b3adb7874cb11271a91a323f12301'
              },
              sequence: 4294967294
            }
          ],
          vout: [
            {
              value: 1.0,
              n: 0,
              scriptPubKey: {
                asm: 'OP_HASH160 48f1346b4453d0a208cef9d6b1722d87c6b3f11e OP_EQUAL',
                hex: 'a91448f1346b4453d0a208cef9d6b1722d87c6b3f11e87',
                reqSigs: 1,
                type: 'scripthash',
                addresses: ['2MytubJ9LXs6JZ8p8Sct1TeNmp1uimmM8Et']
              }
            },
            {
              value: 5.2499626,
              n: 1,
              scriptPubKey: {
                asm: 'OP_HASH160 3acc14bffd075dcaeff623d4c4ac11472a1fcff7 OP_EQUAL',
                hex: 'a9143acc14bffd075dcaeff623d4c4ac11472a1fcff787',
                reqSigs: 1,
                type: 'scripthash',
                addresses: ['2Mxc7fD9wtC1HBRDp2H9EaqMQBZGwuMy8WN']
              }
            }
          ],
          hex:
            '0200000001ff1157410fd0fe4363c96331565ea039a581fffd444297238014b61c22e120a4000000004847304402206797722ab2d452a41d3dbccbe046712218a3263596db92c432cdfade9d06355f02200b3c68caad6906d01eb589686d725551de1c3b3adb7874cb11271a91a323f12301feffffff0200e1f5050000000017a91448f1346b4453d0a208cef9d6b1722d87c6b3f11e87a4ce4a1f0000000017a9143acc14bffd075dcaeff623d4c4ac11472a1fcff78775020000',
          blockhash: '494a5c635fd483c82a4a684f3982f52af27a29ee5217a0409cdad45afc2709d7',
          confirmations: 20,
          time: 1590563814,
          blocktime: 1590563814
        },
        confirmations: 20,
        blockHash: '494a5c635fd483c82a4a684f3982f52af27a29ee5217a0409cdad45afc2709d7',
        blockNumber: 630,
        fee: 3740,
        feePrice: 20
      })
    })
  })
})
