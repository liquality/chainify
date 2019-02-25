module.exports = {
  'estimatesmartfee': [
    {
      params: [],
      result: { feerate: -1 }
    }
  ],
  'getblockhash': [
    {
      params: [102],
      result: '191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254'
    }
  ],
  'getblock': [
    {
      params: ['191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254'],
      result: {
        'hash': '191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254',
        'confirmations': 13,
        'size': 371,
        'height': 102,
        'version': 536870912,
        'merkleroot': '7e440d4cdd7e8a5dfca7ba2bdfe44b02fac389759d954c38c88ff8aeae47f575',
        'tx': [
          'cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4',
          '2f1d2ab7742e401a1e6de9ad4bd38957d8eb73085ab97961eec22528f0d126ce'
        ],
        'time': 1544536091,
        'mediantime': 1544535204,
        'nonce': 1,
        'bits': '207fffff',
        'difficulty': 4.656542373906925e-10,
        'chainwork': '00000000000000000000000000000000000000000000000000000000000000ce',
        'previousblockhash': '432e14437b326efe9ea90031729eb0713d19445b077ab442a98e6a48dde0da44',
        'nextblockhash': '3efb6a054596bdad28fb2f2a5472254cb150fb776e74ed633e85417748f21bc6'
      }
    }
  ],
  'getrawtransaction': [
    {
      params: ['cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4', 0],
      result: '01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000'
    },
    {
      params: ['cb14f7e8a9b7838a2f9057a19f1eebcccaf3a3aaf1b2b4802924ae41b1fc5dc4', 1],
      result: {
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
            'value': 50.00003840,
            'valueSat': 5000003840,
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
      }
    },
    {
      params: ['2f1d2ab7742e401a1e6de9ad4bd38957d8eb73085ab97961eec22528f0d126ce', 1],
      result: {
        'hex': '0100000001f834fa9d2e7e91578d271be0a3869114f63a9829cefbc76c2ab807c39ca3a3cb000000004847304402201a5a9ae682bee3972650ea2b7cb935c654f02523958f33cb675ca02ed58dcb5302204d4275e17e11720daba94957ae7cb60a6e993fa64986d8d8aabf08f0d0f629d701feffffff0200e1f505000000001976a914e983c4ef1c97ef46a94b1cc0fabfe6184ddf575488ac00021024010000001976a9147bc785319c23f39249507dd930bac3461dfe45af88ac1a000000',
        'txid': '2f1d2ab7742e401a1e6de9ad4bd38957d8eb73085ab97961eec22528f0d126ce',
        'size': 191,
        'version': 1,
        'locktime': 26,
        'vin': [
          {
            'txid': 'cba3a39cc307b82a6cc7fbce29983af6149186a3e01b278d57917e2e9dfa34f8',
            'vout': 0,
            'scriptSig': {
              'asm': '304402201a5a9ae682bee3972650ea2b7cb935c654f02523958f33cb675ca02ed58dcb5302204d4275e17e11720daba94957ae7cb60a6e993fa64986d8d8aabf08f0d0f629d7[ALL]',
              'hex': '47304402201a5a9ae682bee3972650ea2b7cb935c654f02523958f33cb675ca02ed58dcb5302204d4275e17e11720daba94957ae7cb60a6e993fa64986d8d8aabf08f0d0f629d701'
            },
            'value': 50.00000000,
            'valueSat': 5000000000,
            'sequence': 4294967294
          }
        ],
        'vout': [
          {
            'value': 1.00000000,
            'valueSat': 100000000,
            'n': 0,
            'scriptPubKey': {
              'asm': 'OP_DUP OP_HASH160 e983c4ef1c97ef46a94b1cc0fabfe6184ddf5754 OP_EQUALVERIFY OP_CHECKSIG',
              'hex': '76a914e983c4ef1c97ef46a94b1cc0fabfe6184ddf575488ac',
              'reqSigs': 1,
              'type': 'pubkeyhash',
              'addresses': [
                'n2ofbEt6EGMa3AWphjiLYFGFKSY7MGViny'
              ]
            },
            'spentTxId': 'e0ec861d8c26d93e0213e0cb984659922cf2e13895aba6cbd1c789a5b3330abf',
            'spentIndex': 0,
            'spentHeight': 103
          },
          {
            'value': 48.99996160,
            'valueSat': 4899996160,
            'n': 1,
            'scriptPubKey': {
              'asm': 'OP_DUP OP_HASH160 7bc785319c23f39249507dd930bac3461dfe45af OP_EQUALVERIFY OP_CHECKSIG',
              'hex': '76a9147bc785319c23f39249507dd930bac3461dfe45af88ac',
              'reqSigs': 1,
              'type': 'pubkeyhash',
              'addresses': [
                'mroSRZYDz2KJB8KyPXbaGVDnbFBLgPACgw'
              ]
            }
          }
        ],
        'blockhash': '191c4a31dc689cd02c3c3858838db5b4b07f8fe5af0fad61c5ea0dfb7163f254',
        'height': 102,
        'confirmations': 13,
        'time': 1544536091,
        'blocktime': 1544536091
      }
    }
  ],
  'decoderawtransaction': [
    {
      params: ['01000000010000000000000000000000000000000000000000000000000000000000000000ffffffff0401660101ffffffff010001062a01000000232103106e56019acc637afca6202e526ada2d2c8653157c19839d0ea1c32c5925deffac00000000'],
      result: {
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
            'value': 50.00003840,
            'valueSat': 5000003840,
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
  ],
  'signmessage': [
    {
      params: ['mfZfUQ4RWLhJdFZr9m2oDXsbcZfuNfYDYi', 'liquality'],
      result: 'IFv9i7jMyQfjxegy7M7x32GdUuqHhQRe6ct7Bp6HhecYXYqNOVZm8cRBp0IzJcHkq/1LnzPoUcYPmfjesBZePvM='
    }
  ],
  'sendtoaddress': [
    {
      params: ['mfZfUQ4RWLhJdFZr9m2oDXsbcZfuNfYDYi', 0.00001],
      result: '7a16d66f0e5abe24f6f9680da0e9dabf877577209180b9fb43c55d001ddf208b'
    }
  ],
  'getreceivedbyaddress': [
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
  'listunspent': [
    {
      params: [ 0, 9999999, [ 'mpJJQJzJhjceFabMVXAMB8i4VJcwwWQmcc' ] ],
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
  'getnewaddress': [
    {
      params: [],
      result: 'n3UEcXH2m85Ph47nPE3pmCkA2yZ8kVm8PJ'
    }
  ],
  'getblockcount': [
    {
      params: [],
      result: 114
    }
  ]
}
