/* eslint-env mocha */

import BigNumber from 'bignumber.js'
import chai, { expect } from 'chai'

import Client from '../../../client/lib'
import BitcoinRpcProvider from '../../lib'

const mockJsonRpc = require('../../../../test/mock/mockJsonRpc')
const bitcoinRpc = require('../../../../test/mock/bitcoin/rpc')

chai.use(require('chai-bignumber')())
chai.config.truncateThreshold = 0

describe('Bitcoin RPC provider', () => {
  let client
  let provider

  beforeEach(() => {
    client = new Client()
    provider = new BitcoinRpcProvider('http://localhost:18443', 'bitcoin', 'local321')
    client.addProvider(provider)

    mockJsonRpc('http://localhost:18443', bitcoinRpc, 100)
  })

  describe('isAddressUsed', () => {
    it('should return false for an unused address', async () => {
      const isUsed = await provider.isAddressUsed('n187i8H1sA5RcFPESf2sgzufirnKcxBfhg')
      expect(isUsed).to.equal(false)
    })

    it('should return true for a used address', async () => {
      const isUsed = await provider.isAddressUsed('mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc')
      expect(isUsed).to.equal(true)
    })
  })

  describe('getFeePerByte', () => {
    it('should return default value 3 sat per byte', async () => {
      const fee = await provider.getFeePerByte()
      expect(fee).to.equal(3)
    })
  })

  describe('getBlockHeight', () => {
    it('should return correct block height', async () => {
      const height = await provider.getBlockHeight()
      expect(height).to.equal(114)
    })
  })

  describe('sendTransaction', () => {
    it('should return transaction hash', async () => {
      const tx = await provider.sendTransaction('mfZfUQ4RWLhJdFZr9m2oDXsbcZfuNfYDYi', 1000)
      expect(tx).to.equal('7a16d66f0e5abe24f6f9680da0e9dabf877577209180b9fb43c55d001ddf208b')
    })
  })

  describe('decodeRawTransaction', () => {
    it('should return decoded transaction', async () => {
      const tx = await provider.decodeRawTransaction('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000')

      expect(tx).to.deep.equal({
        'hash': 'cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4',
        'value': 50,
        '_raw': {
          'hex': '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000',
          'data': {
            'txid': 'cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4',
            'size': 99,
            'version': 1,
            'locktime': 0,
            'vin': [
              {
                'coinbase': '01660101',
                'sequence': 4294967295
              }
            ],
            'vout': [
              {
                'value': 50.0000384,
                'n': 0,
                'scriptPubKey': {
                  'asm': '03106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deff OP_CHECKSIG',
                  'hex': '2103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac',
                  'reqSigs': 1,
                  'type': 'pubkey',
                  'addresses': [
                    'mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc'
                  ]
                }
              }
            ]
          }
        }
      })
    })
  })

  describe('getBlockByHash', () => {
    it('should return a block', async () => {
      const block = await provider.getBlockByHash('191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254')
      expect(block).to.deep.equal({
        hash: '191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254',
        number: 102,
        timestamp: 1544536091,
        difficulty: 4.656542373906925e-10,
        size: 371,
        parentHash: '432e14437b326efe9ea90031729eb0713d19445b077ab442a98e6a48dde0da44',
        nonce: 1,
        transactions: [
          'cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4',
          '2f1d2ab7742e401a1e6de9ad4bd38957d8eb73085ab97961eec22528f0d126ce'
        ],
        confirmations: 13
      })
    })
  })

  describe('getBalance', () => {
    it('should return correct balance in sats', async () => {
      const balance = await provider.getBalance(['mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc'])
      expect(balance).to.be.bignumber.equal(new BigNumber(20000000))
    })
  })

  describe('getRawTransactionByHash', () => {
    it('should return a raw transaction', async () => {
      const tx = await provider.getRawTransactionByHash('cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4', false)
      expect(tx).to.equal('01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000')
    })
  })

  describe('getTransactionByHash', () => {
    it('should return a transaction', async () => {
      const tx = await provider.getTransactionByHash('cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4')
      expect(tx).to.deep.equal({
        'hash': 'cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4',
        'value': 5000003840,
        '_raw': {
          'hex': '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000',
          'txid': 'cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4',
          'size': 99,
          'version': 1,
          'locktime': 0,
          'vin': [
            {
              'coinbase': '01660101',
              'sequence': 4294967295
            }
          ],
          'vout': [
            {
              'value': 50.0000384,
              'n': 0,
              'scriptPubKey': {
                'asm': '03106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deff OP_CHECKSIG',
                'hex': '2103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac',
                'reqSigs': 1,
                'type': 'pubkey',
                'addresses': [
                  'mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc'
                ]
              }
            }
          ],
          'blockhash': '191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254',
          'height': 102,
          'confirmations': 13,
          'time': 1544536091,
          'blocktime': 1544536091
        },
        'confirmations': 13,
        'blockHash': '191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254',
        'blockNumber': 102
      })
    })
  })
})
