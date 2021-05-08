import nock from 'nock'

function mockBatchEsploraApi() {
  nock('https://blockstream.info:443', { encodedQueryParams: true })
    .post('/electrs-testnet-batch/addresses/utxo', '{"addresses":["2N4N393YJx9KuZV5D4HMkzHZ7QoFp6tJG1b"]}')
    .reply(
      200,
      [
        {
          address: '2N4N393YJx9KuZV5D4HMkzHZ7QoFp6tJG1b',
          utxo: [
            {
              txid: '374d22560325e43a314f15120ba8d3ab1840e87695119d3208308dd2868cf9a3',
              vout: 0,
              status: {
                confirmed: true,
                block_height: 1973185,
                block_hash: '0000000000edbe057f877fdb0de069f636f6a9b03451aa748e8fa77546fcbbf8',
                block_time: 1619775030
              },
              value: 10384287
            }
          ]
        }
      ],
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

  nock('https://blockstream.info', { encodedQueryParams: true })
    .post('/electrs-testnet-batch/addresses', () => true)
    .reply(
      200,
      [
        {
          address: '2N4N393YJx9KuZV5D4HMkzHZ7QoFp6tJG1b',
          chain_stats: {
            funded_txo_count: 2,
            funded_txo_sum: 20633270,
            spent_txo_count: 0,
            spent_txo_sum: 0,
            tx_count: 2
          },
          mempool_stats: { funded_txo_count: 0, funded_txo_sum: 0, spent_txo_count: 0, spent_txo_sum: 0, tx_count: 0 }
        }
      ],
      [
        'Server',
        'nginx',
        'Date',
        'Sat, 22 Aug 2020 13:17:34 GMT',
        'Content-Type',
        'application/json',
        'Content-Length',
        '274',
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
}

export default mockBatchEsploraApi
