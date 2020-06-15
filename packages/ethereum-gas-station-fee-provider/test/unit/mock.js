
import nock from 'nock'

function mockApi () {
  nock('https://ethgasstation.info:443', { 'encodedQueryParams': true })
    .get('/api/ethgasAPI.json')
    .reply(200, { 'fast': 200, 'fastest': 310, 'safeLow': 50, 'average': 100, 'block_time': 15.973684210526315, 'blockNum': 10143490, 'speed': 0.8992414279544055, 'safeLowWait': 20, 'avgWait': 1, 'fastWait': 0.5, 'fastestWait': 0.5, 'gasPriceRange': { '4': 266.2, '6': 266.2, '8': 266.2, '10': 266.2, '20': 266.2, '30': 266.2, '40': 266.2, '50': 266.2, '60': 266.2, '70': 266.2, '80': 266.2, '90': 266.2, '100': 266.2, '110': 266.2, '120': 266.2, '130': 266.2, '140': 266.2, '150': 266.2, '160': 266.2, '170': 266.2, '180': 266.2, '190': 266.2, '210': 266.2, '230': 266.2, '250': 21.4, '270': 1, '280': 0.5, '290': 0.5, '310': 0.5 } }, [
      'Date',
      'Tue, 26 May 2020 20:25:10 GMT',
      'Content-Type',
      'application/json; charset=utf-8',
      'Transfer-Encoding',
      'chunked',
      'Connection',
      'close',
      'Set-Cookie',
      '__cfduid=d0bf26c1a2bf182a1c53231830f80c7fb1590524710; expires=Thu, 25-Jun-20 20:25:10 GMT; path=/; domain=.ethgasstation.info; HttpOnly; SameSite=Lax',
      'X-Powered-By',
      'Express',
      'Access-Control-Allow-Origin',
      '*',
      'X-RateLimit-Limit',
      '10',
      'X-RateLimit-Remaining',
      '8',
      'X-RateLimit-Reset',
      '1590524712',
      'ETag',
      'W/"219-ja2t1Lf8lPtBPnkJRuBpoHwthTs"',
      'CF-Cache-Status',
      'DYNAMIC',
      'cf-request-id',
      '02f44225d8000036399781c200000001',
      'Set-Cookie',
      '__cfduid=d32f43e0343ae807449b2850f8496302e1590524710; expires=Thu, 25-Jun-20 20:25:10 GMT; path=/; domain=.concourseopen.com; HttpOnly; SameSite=Lax',
      'Set-Cookie',
      'AWSALB=BWaQY2dIU1WnzXIoS7OdaoxHQX/pcHXOd3eo8G7qDxLAKNfoPmFlkdPoqbXTkBgWjIB0mXm3GA0xts5ocPfi8EN31ulTI5b8RaMUsW9tkoJhF7a1t3y4f6o9KwdQ; Expires=Tue, 02 Jun 2020 20:25:10 GMT; Path=/',
      'Set-Cookie',
      'AWSALBCORS=BWaQY2dIU1WnzXIoS7OdaoxHQX/pcHXOd3eo8G7qDxLAKNfoPmFlkdPoqbXTkBgWjIB0mXm3GA0xts5ocPfi8EN31ulTI5b8RaMUsW9tkoJhF7a1t3y4f6o9KwdQ; Expires=Tue, 02 Jun 2020 20:25:10 GMT; Path=/; SameSite=None',
      'Expect-CT',
      'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
      'Server',
      'cloudflare',
      'CF-RAY',
      '599a394fc97f3639-MAN'
    ])
}

export { mockApi }
