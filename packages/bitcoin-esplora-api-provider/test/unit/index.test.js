/* eslint-env mocha */

import chai, { expect } from 'chai'
import Client from '../../../client/lib'
import BitcoinEsploraApiProvider from '../../lib'
import mockEsploraApi from '../mock/mockEsploraApi'
chai.use(require('chai-bignumber')())
chai.config.truncateThreshold = 0

describe('Bitcoin Esplora Api Provider', () => {
  let client
  let provider
  before(() => {
    mockEsploraApi()
  })

  beforeEach(() => {
    client = new Client()
    provider = new BitcoinEsploraApiProvider('https://blockstream.info/testnet/api')
    client.addProvider(provider)
  })

  describe('getFeePerByte', () => {
    it('should return the right fee', async () => {
      const fee = await provider.getFeePerByte(5)
      expect(fee).to.equal(10)
    })
  })

  describe('getTransactionByHash', () => {
    it('should return a transaction', async () => {
      const tx = await provider.getTransactionByHash('d4b1add055db58343500157a6525a73ceb9c8850f0fb435f1f60071e8cad6540')
      expect(tx).to.deep.equal({
        'hash': 'd4b1add055db58343500157a6525a73ceb9c8850f0fb435f1f60071e8cad6540',
        'value': 950018,
        '_raw': {
          'txid': 'd4b1add055db58343500157a6525a73ceb9c8850f0fb435f1f60071e8cad6540',
          'version': 1,
          'locktime': 0,
          'vin': [
            {
              'txid': 'cc03b91ab4c7b9fd97d8e49cef7a9386f45c9da51e77faf8b1d77be070577a44',
              'vout': 1,
              'scriptSig': {
                'asm': 'OP_PUSHBYTES_34 00200153e49dbc4a122f47a87755382629dbdf7ede36e3c1c42b52da81f93ca3e6c3',
                'hex': '2200200153e49dbc4a122f47a87755382629dbdf7ede36e3c1c42b52da81f93ca3e6c3'
              },
              'txinwitness': [
                '',
                '30440220232266d87dfba9ffd31632d4622a2067b9b00585a576f9e556e165fd19e73f2f022016277e17a658ec3d5d9c4f2d1cc224c38324f3af79227c61ece057e78ed6bc5b01',
                '30440220285b4e87b91a521e164f206e551b40ddc1bfd3780a7390511d069ebcae49353602207ab1c35a9b550c799bbb7ec3f0fcdcb60df637e39b1707fa5d9220aad1c470db01',
                '5221021b082273dfca34fa34501dd892968815ecb9dc1f0601db1e91c37ef85834c6ec210300dc67d16010e32b98bd66690ab0ea56e9e24cd0287a5fa22ac8040fbe9f7c7652ae'
              ]
            }
          ],
          'vout': [
            {
              'value': 0.001,
              'n': 0,
              'scriptPubKey': {
                'asm': 'OP_HASH160 OP_PUSHBYTES_20 9d3c916e0ebea90c4fc385aed2f8a5bed9595c29 OP_EQUAL',
                'hex': 'a9149d3c916e0ebea90c4fc385aed2f8a5bed9595c2987',
                'type': 'p2sh',
                'addresses': [
                  '2N7acdkCmEdifRvoWtX7GCiGMoKSM68AgjB'
                ]
              }
            },
            {
              'value': 0.00850018,
              'n': 1,
              'scriptPubKey': {
                'asm': 'OP_HASH160 OP_PUSHBYTES_20 b1ca47496d9e10b431358ab9cb013b6fe0069910 OP_EQUAL',
                'hex': 'a914b1ca47496d9e10b431358ab9cb013b6fe006991087',
                'type': 'p2sh',
                'addresses': [
                  '2N9THuntcLXpjnkN5KWAeVMTYMDQyARMzXz'
                ]
              }
            }
          ],
          'size': 370,
          'weight': 820,
          'fee': 26780,
          'status': {
            'confirmed': true,
            'block_height': 1574469,
            'block_hash': '000000000000015df12c1a2656f4284edc7c8130d68112d5e522b5d22f79b2b0',
            'block_time': 1565777199
          }
        },
        'blockHash': '000000000000015df12c1a2656f4284edc7c8130d68112d5e522b5d22f79b2b0',
        'blockNumber': 1574469,
        'confirmations': 204,
        'totalFee': 26780,
        'fee': 131
      })
    })
  })
})
