import nock from 'nock'

function mockApi() {
  nock('https://api.etherscan.io:443', { encodedQueryParams: true })
    .get('/api')
    .query(true)
    .reply(200, {
      code: 200,
      data: {
        status: '1',
        message: 'OK',
        result: {
          LastBlock: '13413293',
          SafeGasPrice: '5',
          ProposeGasPrice: '10',
          FastGasPrice: '20',
          suggestBaseFee: '111.542451974',
          gasUsedRatio: '0.789565366666667,0.9993161,0.996709013648173,0.117291083798627,0.165070101946548'
        }
      }
    })
}

function mockApiFeesTooHigh() {
  nock('https://api.etherscan.io:443', { encodedQueryParams: true })
    .get('/api')
    .query(true)
    .reply(200, {
      code: 200,
      data: {
        status: '1',
        message: 'OK',
        result: {
          LastBlock: '13413293',
          SafeGasPrice: '2000',
          ProposeGasPrice: '2000',
          FastGasPrice: '2000',
          suggestBaseFee: '999',
          gasUsedRatio: '♾'
        }
      }
    })
}

export { mockApi, mockApiFeesTooHigh }
