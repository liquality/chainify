import nock from 'nock'

function mockApi() {
  nock('https://mempool.space:443', { encodedQueryParams: true })
    .get('/api/v1/fees/recommended')
    .reply(200, { fastestFee: 200, halfHourFee: 100, hourFee: 50 }, [
      'Date',
      'Tue, 26 May 2020 20:50:00 GMT',
      'Content-Type',
      'application/json; charset=utf-8',
      'Content-Length',
      '50',
      'Connection',
      'close',
      'Set-Cookie',
      '__cfduid=d626434aa86d8a02a15d07068a2e6ba8c1590526200; expires=Thu, 25-Jun-20 20:50:00 GMT; path=/; domain=.mempool.space; HttpOnly; SameSite=Lax',
      'Access-Control-Allow-Credentials',
      'true',
      'Access-Control-Allow-Origin',
      '*',
      'X-Frame-Options',
      'SAMEORIGIN',
      'X-Content-Type-Options',
      'nosniff',
      'X-XSS-Protection',
      '1; mode=block',
      'CF-Cache-Status',
      'DYNAMIC',
      'cf-request-id',
      '02f458e1910000d20855397200000001',
      'Expect-CT',
      'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
      'Server',
      'cloudflare',
      'CF-RAY',
      '599a5daf4fe5d208-MAN'
    ])
}

export { mockApi }
