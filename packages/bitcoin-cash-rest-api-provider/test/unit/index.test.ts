/* eslint-env mocha */

import chai, { expect } from 'chai'
import { Client } from '../../../client/lib'
import { BitcoinCashRestApiProvider } from '../../lib'
import { BitcoinCashNetworks } from '../../../bitcoin-networks/lib'
import mockRestApi from '../mock/mockRestApi'
chai.config.truncateThreshold = 0

describe('Bitcoin Cash Rest Api Provider', () => {
  let client: Client
  let provider: BitcoinCashRestApiProvider
  before(() => {
    mockRestApi()
  })

  beforeEach(() => {
    client = new Client()
    provider = new BitcoinCashRestApiProvider({
      url: 'https://testnet3.fullstack.cash/v4/',
      network: BitcoinCashNetworks.bitcoin_cash_testnet
    })
    client.addProvider(provider)
  })

  describe('getTransactionByHash', () => {
    it('should return a transaction', async () => {
      const tx = await provider.getTransactionByHash('21d823eb78929c6edca4e12c3f2411f7e31220bcaad19d99740bd313f393a0bd')
      expect(tx).to.deep.equal({
        hash: '21d823eb78929c6edca4e12c3f2411f7e31220bcaad19d99740bd313f393a0bd',
        value: 19983920,
        _raw: {
          txid: '21d823eb78929c6edca4e12c3f2411f7e31220bcaad19d99740bd313f393a0bd',
          hash: '21d823eb78929c6edca4e12c3f2411f7e31220bcaad19d99740bd313f393a0bd',
          version: 2,
          locktime: 1445260,
          size: 662,
          vsize: 662,
          weight: 2648,
          vin: [
            {
              txid: '6186edde20790a51ac5375a6c6526ec0e6fc118972c6c6ee2bfd3d9620829b35',
              vout: 0,
              scriptSig: {
                asm:
                  'OP_0 3044022058811d11f837bad38912c65eac4013ae94119fd4d70e4ad30e220f51163dcf7e02202db95f053ae9b2d5e894cd64594073ce2215486afc20f860f0aa2d681400e48041 304402204970f9751468b13fa7c6a7062ab88cbf5c8b66abefc5a76b3eeade8a69100edb022046e94d9729b9a67bafed8b3a825164dd9ff273074cdc887df2881dbf25ace00441 522102cddfa6f70331576ee65f475611ff37f41c0fad21ee9da9edaf194c1d1e0e85b321030fe4509d5be93a2fcb3fc17bd5e8c0c3790ec848b3aa610a869bca19967548eb210326fdb8a925f4c1e06ade3446aa9584ba00871de0ce9413223a165e77b2649b5153ae',
                hex:
                  '00473044022058811d11f837bad38912c65eac4013ae94119fd4d70e4ad30e220f51163dcf7e02202db95f053ae9b2d5e894cd64594073ce2215486afc20f860f0aa2d681400e4804147304402204970f9751468b13fa7c6a7062ab88cbf5c8b66abefc5a76b3eeade8a69100edb022046e94d9729b9a67bafed8b3a825164dd9ff273074cdc887df2881dbf25ace004414c69522102cddfa6f70331576ee65f475611ff37f41c0fad21ee9da9edaf194c1d1e0e85b321030fe4509d5be93a2fcb3fc17bd5e8c0c3790ec848b3aa610a869bca19967548eb210326fdb8a925f4c1e06ade3446aa9584ba00871de0ce9413223a165e77b2649b5153ae'
              },
              txinwitness: [],
              sequence: 4294967295
            },
            {
              txid: '73f4f3d1665e5307bad6ecd999d2f713acb5934117c8ede6913496a79b912976',
              vout: 0,
              scriptSig: {
                asm:
                  'OP_0 304402206b9757da2578035d65d3ab6621d9a391fde574d9496ce6dc80c69499ddff6e6f022031931966d1237ce8ec50747b2c5e5488971d0b152068cf26820397add17dfeb941 304402204e4caadd8db96927c93010bf2ed56ff4e874edf0f612519f5d531d5a10072d2302203d28741c41575ddd00686cf7d4af547683e32a8420ef196ea9498f8fbdedf30041 522102cbdc4cb291a3b50e396e5e7f8ada0a5deded6d7c41901b18f86a8d5727de3c512103ac6de1cb4410c1f3050944cbf40cf2502289bc64e01f75d59161f84a3a80317d2103cfaf2e275ce2d264716cab5570e45073408bd07564c6053dec2439e01fd689aa53ae',
                hex:
                  '0047304402206b9757da2578035d65d3ab6621d9a391fde574d9496ce6dc80c69499ddff6e6f022031931966d1237ce8ec50747b2c5e5488971d0b152068cf26820397add17dfeb94147304402204e4caadd8db96927c93010bf2ed56ff4e874edf0f612519f5d531d5a10072d2302203d28741c41575ddd00686cf7d4af547683e32a8420ef196ea9498f8fbdedf300414c69522102cbdc4cb291a3b50e396e5e7f8ada0a5deded6d7c41901b18f86a8d5727de3c512103ac6de1cb4410c1f3050944cbf40cf2502289bc64e01f75d59161f84a3a80317d2103cfaf2e275ce2d264716cab5570e45073408bd07564c6053dec2439e01fd689aa53ae'
              },
              txinwitness: [],
              sequence: 4294967295
            }
          ],
          vout: [
            {
              value: 0.0998392,
              n: 0,
              scriptPubKey: {
                asm: 'OP_HASH160 238b0de1eb3a7932223584297e3859ea9397247c OP_EQUAL',
                hex: 'a914238b0de1eb3a7932223584297e3859ea9397247c87',
                reqSigs: 1,
                type: 'scripthash',
                addresses: ['bchtest:pq3ckr0pava8jv3zxkzzjl3ct84f89ey0sa4e7dlwn']
              }
            },
            {
              value: 0.1,
              n: 1,
              scriptPubKey: {
                asm: 'OP_DUP OP_HASH160 aa1568b035843c32bb9883e9a58a802d39fa8c0a OP_EQUALVERIFY OP_CHECKSIG',
                hex: '76a914aa1568b035843c32bb9883e9a58a802d39fa8c0a88ac',
                reqSigs: 1,
                type: 'pubkeyhash',
                addresses: ['bchtest:qz4p269sxkzrcv4mnzp7nfv2sqknn75vpgrz0l520m']
              }
            }
          ],
          hex:
            '0200000002359b8220963dfd2beec6c6728911fce6c06e52c6a67553ac510a7920deed866100000000fc00473044022058811d11f837bad38912c65eac4013ae94119fd4d70e4ad30e220f51163dcf7e02202db95f053ae9b2d5e894cd64594073ce2215486afc20f860f0aa2d681400e4804147304402204970f9751468b13fa7c6a7062ab88cbf5c8b66abefc5a76b3eeade8a69100edb022046e94d9729b9a67bafed8b3a825164dd9ff273074cdc887df2881dbf25ace004414c69522102cddfa6f70331576ee65f475611ff37f41c0fad21ee9da9edaf194c1d1e0e85b321030fe4509d5be93a2fcb3fc17bd5e8c0c3790ec848b3aa610a869bca19967548eb210326fdb8a925f4c1e06ade3446aa9584ba00871de0ce9413223a165e77b2649b5153aeffffffff7629919ba7963491e6edc8174193b5ac13f7d299d9ecd6ba07535e66d1f3f47300000000fc0047304402206b9757da2578035d65d3ab6621d9a391fde574d9496ce6dc80c69499ddff6e6f022031931966d1237ce8ec50747b2c5e5488971d0b152068cf26820397add17dfeb94147304402204e4caadd8db96927c93010bf2ed56ff4e874edf0f612519f5d531d5a10072d2302203d28741c41575ddd00686cf7d4af547683e32a8420ef196ea9498f8fbdedf300414c69522102cbdc4cb291a3b50e396e5e7f8ada0a5deded6d7c41901b18f86a8d5727de3c512103ac6de1cb4410c1f3050944cbf40cf2502289bc64e01f75d59161f84a3a80317d2103cfaf2e275ce2d264716cab5570e45073408bd07564c6053dec2439e01fd689aa53aeffffffff02b05798000000000017a914238b0de1eb3a7932223584297e3859ea9397247c8780969800000000001976a914aa1568b035843c32bb9883e9a58a802d39fa8c0a88ac8c0d1600',
          confirmations: 0
        },
        confirmations: 0,
        blockHash: undefined,
        blockNumber: undefined
      })
    })
  })
})
