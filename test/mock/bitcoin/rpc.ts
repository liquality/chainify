export default {
  estimatesmartfee: [
    {
      params: [],
      result: { feerate: -1 }
    },
    {
      params: [1],
      result: {
        feerate: 0.0002,
        blocks: 2
      }
    },
    {
      params: [3],
      result: {
        feerate: 0.0001,
        blocks: 3
      }
    },
    {
      params: [6],
      result: {
        feerate: 0.00005,
        blocks: 6
      }
    }
  ],
  getblockhash: [
    {
      params: [630],
      result: '494a5c635fd483c82a4a684f3982f52af27a29ee5217a0409cdad45afc2709d7'
    }
  ],
  getblock: [
    {
      params: ['494a5c635fd483c82a4a684f3982f52af27a29ee5217a0409cdad45afc2709d7'],
      result: {
        hash: '494a5c635fd483c82a4a684f3982f52af27a29ee5217a0409cdad45afc2709d7',
        confirmations: 30,
        strippedsize: 415,
        size: 451,
        weight: 1696,
        height: 630,
        version: 536870912,
        versionHex: '20000000',
        merkleroot: '19cd3bf0e92dffb49151783d835842866fdc8227daa890714f9765b750935260',
        tx: [
          '9f4d7c7e4e42ebf11e3985c9c4057c47b0513039ea437a33c390164bcd00bb5a',
          '504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd'
        ],
        time: 1590563814,
        mediantime: 1590562814,
        nonce: 0,
        bits: '207fffff',
        difficulty: 4.656542373906925e-10,
        chainwork: '00000000000000000000000000000000000000000000000000000000000004ee',
        nTx: 2,
        previousblockhash: '42aea9df22bc513317d9a21d319ed102c6a36d02e823c720dbead2bbec69eebc',
        nextblockhash: '46c9ab8f82a55f81adb288c6ad0d56b2a155f94f9e2d19cc46829fd9499c9874'
      }
    },
    {
      params: ['2960608e7f70c2c72c116b38e984d2fe304812cd448188740348d9600c242376'],
      result: {
        hash: '2960608e7f70c2c72c116b38e984d2fe304812cd448188740348d9600c242376',
        confirmations: 181,
        strippedsize: 228,
        size: 264,
        weight: 948,
        height: 482,
        version: 536870912,
        versionHex: '20000000',
        merkleroot: 'a420e1221cb6148023974244fdff81a539a05e563163c96343fed00f415711ff',
        tx: ['a420e1221cb6148023974244fdff81a539a05e563163c96343fed00f415711ff'],
        time: 1590509697,
        mediantime: 1590508698,
        nonce: 0,
        bits: '207fffff',
        difficulty: 4.656542373906925e-10,
        chainwork: '00000000000000000000000000000000000000000000000000000000000003c6',
        nTx: 1,
        previousblockhash: '1bd529c8ca2950eaf816d1c03361b95f22b1988ce5e017b05422b8b46c69f7c3',
        nextblockhash: '115ef50fdb58bfcbc8dbd4f6a8cf23c8c9c8b8d1b62c4be974ab858badcd477a'
      }
    }
  ],
  getrawtransaction: [
    {
      params: ['504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd', 0],
      result:
        '0200000001ff1157410fd0fe4363c96331565ea039a581fffd444297238014b61c22e120a4000000004847304402206797722ab2d452a41d3dbccbe046712218a3263596db92c432cdfade9d06355f02200b3c68caad6906d01eb589686d725551de1c3b3adb7874cb11271a91a323f12301feffffff0200e1f5050000000017a91448f1346b4453d0a208cef9d6b1722d87c6b3f11e87a4ce4a1f0000000017a9143acc14bffd075dcaeff623d4c4ac11472a1fcff78775020000'
    },
    {
      params: ['504fc23592b61c262902e8574d5a053e8eb3f7d9d80d3c49f20ef4cd9167d2fd', 1],
      result: {
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
      }
    },
    {
      params: ['a420e1221cb6148023974244fdff81a539a05e563163c96343fed00f415711ff', 1],
      result: {
        txid: 'a420e1221cb6148023974244fdff81a539a05e563163c96343fed00f415711ff',
        hash: '4e0fa5e226519ae1d730c8857eca131e2c6af66a002208055046527c88e22ce0',
        version: 2,
        size: 183,
        vsize: 156,
        weight: 624,
        locktime: 0,
        vin: [
          {
            coinbase: '02e2010101',
            sequence: 4294967295
          }
        ],
        vout: [
          {
            value: 6.25,
            n: 0,
            scriptPubKey: {
              asm: '033daf00bd93223d27328d7f9f7693baee0c985a68a9ac92ff8556d5b563508cdb OP_CHECKSIG',
              hex: '21033daf00bd93223d27328d7f9f7693baee0c985a68a9ac92ff8556d5b563508cdbac',
              reqSigs: 1,
              type: 'pubkey',
              addresses: ['mzDk3vhn4cGiziYLL5gdjH3ekMw56LKbEt']
            }
          },
          {
            value: 0.0,
            n: 1,
            scriptPubKey: {
              asm: 'OP_RETURN aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf9',
              hex: '6a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf9',
              type: 'nulldata'
            }
          }
        ],
        hex:
          '020000000001010000000000000000000000000000000000000000000000000000000000000000ffffffff0502e2010101ffffffff0240be4025000000002321033daf00bd93223d27328d7f9f7693baee0c985a68a9ac92ff8556d5b563508cdbac0000000000000000266a24aa21a9ede2f61c3f71d1defd3fa999dfa36953755c690689799962b48bebd836974e8cf90120000000000000000000000000000000000000000000000000000000000000000000000000',
        blockhash: '2960608e7f70c2c72c116b38e984d2fe304812cd448188740348d9600c242376',
        confirmations: 170,
        time: 1590509697,
        blocktime: 1590509697
      }
    }
  ],
  decoderawtransaction: [
    {
      params: [
        '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000'
      ],
      result: {
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
      }
    }
  ],
  signmessage: [
    {
      params: ['mfZfUQ4RWLhJdFZr9m2oDXsbcZfuNfYDYi', 'liquality'],
      result: 'IFv9i7jMyQfjxegy7M7x32GdUuqHhQRe6ct7Bp6HhecYXYqNOVZm8cRBp0IzJcHkq/1LnzPoUcYPmfjesBZePvM='
    }
  ],
  sendtoaddress: [
    {
      params: ['2MxxsHz5Y9KM847ttEoZNcmmaKSCQDa5Z23', 0.00001, '', '', false, true],
      result: '8d2ef62766cb1c15744228335483d37a7addc2a2f88d47413527e55e212ef8cd'
    }
  ],
  gettransaction: [
    {
      params: ['8d2ef62766cb1c15744228335483d37a7addc2a2f88d47413527e55e212ef8cd', true],
      result: {
        amount: 0,
        fee: -0.0000374,
        confirmations: 0,
        trusted: true,
        txid: '8d2ef62766cb1c15744228335483d37a7addc2a2f88d47413527e55e212ef8cd',
        walletconflicts: [],
        time: 1597754379,
        timereceived: 1597754379,
        'bip125-replaceable': 'no',
        details: [
          {
            address: '2MxxsHz5Y9KM847ttEoZNcmmaKSCQDa5Z23',
            category: 'send',
            amount: -0.0001,
            label: '',
            vout: 1,
            fee: -0.0000374,
            abandoned: false
          },
          {
            address: '2MxxsHz5Y9KM847ttEoZNcmmaKSCQDa5Z23',
            category: 'receive',
            amount: 0.0001,
            label: '',
            vout: 1
          }
        ],
        hex:
          '020000000144559fe3bc19957925cbd45bd8a7378ca964892ea375d09535fcc9725285634200000000484730440220653f079162334a15dd60275552e2cd2ab7a57978667d5120aec926a5d55a4cce02200d0ae39fa2a60e52223a4a8fec90222804160592fdd745b3f18d734674a76ee701feffffff0254bc052a0100000017a914c55f29c3225858086d2c71979f04e45bff09251987102700000000000017a9143eb8d2fbe1f6614b55d5f31eecc074667cb690c08766000000'
      }
    }
  ],
  getreceivedbyaddress: [
    {
      params: ['n187i8H1sA5RcFPESf2sgzufirnKcxBfhg'],
      result: 0
    },
    {
      params: ['mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc'],
      result: 0.6
    },
    {
      params: ['n3UEcXH2m85Ph47nPE3pmCkA2yZ8kVm8PJ'],
      result: 0
    }
  ],
  listunspent: [
    {
      params: [0, 9999999, ['mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc']],
      result: [
        {
          txid: '467dec8ca158d0939e27e49e86dddf996020e707e1c68a68e6990a6770833474',
          vout: 0,
          address: 'mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc',
          scriptPubKey: '76a9146054827fc57f5656f5401f172c55d4f981b643ed88ac',
          amount: 0.1,
          confirmations: 10,
          spendable: true
        },
        {
          txid: 'b62aecea21d3e1c0c65b1dc46dd97bcbb3977b65589f19bff1748c10b6af717c',
          vout: 0,
          address: 'mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc',
          scriptPubKey: '76a9146054827fc57f5656f5401f172c55d4f981b643ed88ac',
          amount: 0.1,
          confirmations: 10,
          spendable: true
        }
      ]
    }
  ],
  getnewaddress: [
    {
      params: ['', 'legacy'],
      result: 'n3UEcXH2m85Ph47nPE3pmCkA2yZ8kVm8PJ'
    }
  ],
  getblockcount: [
    {
      params: [],
      result: 114
    }
  ]
}
