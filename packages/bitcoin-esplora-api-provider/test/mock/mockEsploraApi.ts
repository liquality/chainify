import nock from 'nock'

function mockEsploraApi() {
  nock('https://blockstream.info:443', { encodedQueryParams: true })
    .get('/testnet/api/tx/d4b1add055db58343500157a6525a73ceb9c8850f0fb435f1f60071e8cad6540')
    .reply(
      200,
      {
        txid: 'd4b1add055db58343500157a6525a73ceb9c8850f0fb435f1f60071e8cad6540',
        version: 1,
        locktime: 0,
        vin: [
          {
            txid: 'cc03b91ab4c7b9fd97d8e49cef7a9386f45c9da51e77faf8b1d77be070577a44',
            vout: 1,
            prevout: {
              scriptpubkey: 'a914b1ca47496d9e10b431358ab9cb013b6fe006991087',
              scriptpubkey_asm: 'OP_HASH160 OP_PUSHBYTES_20 b1ca47496d9e10b431358ab9cb013b6fe0069910 OP_EQUAL',
              scriptpubkey_type: 'p2sh',
              scriptpubkey_address: '2N9THuntcLXpjnkN5KWAeVMTYMDQyARMzXz',
              value: 976798
            },
            scriptsig: '2200200153e49dbc4a122f47a87755382629dbdf7ede36e3c1c42b52da81f93ca3e6c3',
            scriptsig_asm: 'OP_PUSHBYTES_34 00200153e49dbc4a122f47a87755382629dbdf7ede36e3c1c42b52da81f93ca3e6c3',
            witness: [
              '',
              '30440220232266d87dfba9ffd31632d4622a2067b9b00585a576f9e556e165fd19e73f2f022016277e17a658ec3d5d9c4f2d1cc224c38324f3af79227c61ece057e78ed6bc5b01',
              '30440220285b4e87b91a521e164f206e551b40ddc1bfd3780a7390511d069ebcae49353602207ab1c35a9b550c799bbb7ec3f0fcdcb60df637e39b1707fa5d9220aad1c470db01',
              '5221021b082273dfca34fa34501dd892968815ecb9dc1f0601db1e91c37ef85834c6ec210300dc67d16010e32b98bd66690ab0ea56e9e24cd0287a5fa22ac8040fbe9f7c7652ae'
            ],
            is_coinbase: false,
            sequence: 4294967295,
            inner_redeemscript_asm:
              'OP_0 OP_PUSHBYTES_32 0153e49dbc4a122f47a87755382629dbdf7ede36e3c1c42b52da81f93ca3e6c3',
            inner_witnessscript_asm:
              'OP_PUSHNUM_2 OP_PUSHBYTES_33 021b082273dfca34fa34501dd892968815ecb9dc1f0601db1e91c37ef85834c6ec OP_PUSHBYTES_33 0300dc67d16010e32b98bd66690ab0ea56e9e24cd0287a5fa22ac8040fbe9f7c76 OP_PUSHNUM_2 OP_CHECKMULTISIG'
          }
        ],
        vout: [
          {
            scriptpubkey: 'a9149d3c916e0ebea90c4fc385aed2f8a5bed9595c2987',
            scriptpubkey_asm: 'OP_HASH160 OP_PUSHBYTES_20 9d3c916e0ebea90c4fc385aed2f8a5bed9595c29 OP_EQUAL',
            scriptpubkey_type: 'p2sh',
            scriptpubkey_address: '2N7acdkCmEdifRvoWtX7GCiGMoKSM68AgjB',
            value: 100000
          },
          {
            scriptpubkey: 'a914b1ca47496d9e10b431358ab9cb013b6fe006991087',
            scriptpubkey_asm: 'OP_HASH160 OP_PUSHBYTES_20 b1ca47496d9e10b431358ab9cb013b6fe0069910 OP_EQUAL',
            scriptpubkey_type: 'p2sh',
            scriptpubkey_address: '2N9THuntcLXpjnkN5KWAeVMTYMDQyARMzXz',
            value: 850018
          }
        ],
        size: 370,
        weight: 820,
        fee: 26780,
        status: {
          confirmed: true,
          block_height: 1574469,
          block_hash: '000000000000015df12c1a2656f4284edc7c8130d68112d5e522b5d22f79b2b0',
          block_time: 1565777199
        }
      },
      [
        'Server',
        'nginx',
        'Date',
        'Sat, 22 Aug 2020 13:17:34 GMT',
        'Content-Type',
        'application/json',
        'Content-Length',
        '2234',
        'Vary',
        'Accept-Encoding',
        'Access-Control-Allow-Origin',
        '*',
        'Via',
        '1.1 google',
        'Cache-Control',
        'public, max-age=157784630',
        'Age',
        '32887',
        'Alt-Svc',
        'clear',
        'Connection',
        'close'
      ]
    )

  nock('https://blockstream.info:443', { encodedQueryParams: true })
    .get('/testnet/api/blocks/tip/height')
    .reply(200, '1808100', [
      'Server',
      'nginx',
      'Date',
      'Sat, 22 Aug 2020 22:25:40 GMT',
      'Content-Type',
      'text/plain',
      'Content-Length',
      '7',
      'Access-Control-Allow-Origin',
      '*',
      'Via',
      '1.1 google',
      'Cache-Control',
      'public, max-age=10',
      'Age',
      '2',
      'Alt-Svc',
      'clear',
      'Connection',
      'close'
    ])

  nock('https://blockstream.info:443', { encodedQueryParams: true })
    .get('/testnet/api/tx/d4b1add055db58343500157a6525a73ceb9c8850f0fb435f1f60071e8cad6540/hex')
    .reply(
      200,
      '01000000000101447a5770e07bd7b1f8fa771ea59d5cf486937aef9ce4d897fdb9c7b41ab903cc01000000232200200153e49dbc4a122f47a87755382629dbdf7ede36e3c1c42b52da81f93ca3e6c3ffffffff02a08601000000000017a9149d3c916e0ebea90c4fc385aed2f8a5bed9595c298762f80c000000000017a914b1ca47496d9e10b431358ab9cb013b6fe00699108704004730440220232266d87dfba9ffd31632d4622a2067b9b00585a576f9e556e165fd19e73f2f022016277e17a658ec3d5d9c4f2d1cc224c38324f3af79227c61ece057e78ed6bc5b014730440220285b4e87b91a521e164f206e551b40ddc1bfd3780a7390511d069ebcae49353602207ab1c35a9b550c799bbb7ec3f0fcdcb60df637e39b1707fa5d9220aad1c470db01475221021b082273dfca34fa34501dd892968815ecb9dc1f0601db1e91c37ef85834c6ec210300dc67d16010e32b98bd66690ab0ea56e9e24cd0287a5fa22ac8040fbe9f7c7652ae00000000',
      [
        'Server',
        'nginx',
        'Date',
        'Sat, 22 Aug 2020 22:25:42 GMT',
        'Content-Type',
        'text/plain',
        'Content-Length',
        '740',
        'Vary',
        'Accept-Encoding',
        'cache-control',
        'public, max-age=157784630',
        'Access-Control-Allow-Origin',
        '*',
        'Via',
        '1.1 google',
        'Alt-Svc',
        'clear',
        'Connection',
        'close'
      ]
    )

  nock('https://blockstream.info:443', { encodedQueryParams: true }).get('/testnet/api/fee-estimates').reply(
    200,
    {
      '1': 30,
      '2': 30,
      '3': 30,
      '4': 30,
      '5': 10,
      '6': 30,
      '7': 30,
      '8': 30,
      '9': 30,
      '10': 30,
      '11': 30,
      '12': 30,
      '13': 30,
      '14': 30,
      '15': 30,
      '16': 30,
      '17': 30,
      '18': 30,
      '19': 30,
      '20': 30,
      '21': 30,
      '22': 30,
      '23': 30,
      '24': 30,
      '25': 30,
      '144': 30,
      '504': 30,
      '1008': 30
    },
    [
      'Server',
      'nginx',
      'Date',
      'Thu, 09 Jul 2020 13:00:41 GMT',
      'Content-Type',
      'application/json',
      'Content-Length',
      '248',
      'Vary',
      'Accept-Encoding',
      'cache-control',
      'public, max-age=10',
      'Access-Control-Allow-Origin',
      '*',
      'Via',
      '1.1 google',
      'Alt-Svc',
      'clear',
      'Connection',
      'close'
    ]
  )
}

export default mockEsploraApi
