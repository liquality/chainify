import nock from 'nock'

function mockApi() {
  nock('https://www.gasnow.org:443', { encodedQueryParams: true })
    .get('/api/v3/gas/price')
    .reply(
      200,
      {
        code: 200,
        data: {
          rapid: 20000000000,
          fast: 20000000000,
          standard: 10000000000,
          slow: 5000000000,
          timestamp: 1615987730198
        }
      },
      [
        'Date',
        'Wed, 17 Mar 2021 13:28:53 GMT',
        'Content-Type',
        'application/json; charset=utf-8',
        'Content-Length',
        '132',
        'Connection',
        'close',
        'Set-Cookie',
        '__cfduid=da230166cf55e05e2279d2c81121345951615987732; expires=Fri, 16-Apr-21 13:28:52 GMT; path=/; domain=.gasnow.org; HttpOnly; SameSite=Lax',
        'set-cookie',
        'csrfToken=8ZP84E6Uf8JwE_yONYePQj97; path=/',
        'x-frame-options',
        'SAMEORIGIN',
        'x-xss-protection',
        '1; mode=block',
        'x-content-type-options',
        'nosniff',
        'x-download-options',
        'noopen',
        'x-readtime',
        '0',
        'Strict-Transport-Security',
        'max-age=15768000',
        'Access-Control-Allow-Origin',
        '*',
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers',
        'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization',
        'CF-Cache-Status',
        'DYNAMIC',
        'cf-request-id',
        '08e1f9090100002be977251000000001',
        'Expect-CT',
        'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
        'Report-To',
        '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report?s=amj63yVtvt8vgrJrEvEZ7w%2FQjcxRsUnhRymO0OkCL0vl6sVtt33SdVy5a3obhoHbQmAIWgk0gu2BqUYTdEMxLeE2k63TmfOtdVTGAsAUhQ%3D%3D"}],"group":"cf-nel","max_age":604800}',
        'NEL',
        '{"max_age":604800,"report_to":"cf-nel"}',
        'Server',
        'cloudflare',
        'CF-RAY',
        '631691219fe52be9-FRA',
        'alt-svc',
        'h3-27=":443"; ma=86400, h3-28=":443"; ma=86400, h3-29=":443"; ma=86400'
      ]
    )
}

function mockApiFeesTooHigh() {
  nock('https://www.gasnow.org:443', { encodedQueryParams: true })
    .get('/api/v3/gas/price')
    .reply(
      200,
      {
        code: 200,
        data: {
          rapid: 20000000000,
          fast: 2000000000000,
          standard: 10000000000,
          slow: 5000000000,
          timestamp: 1615987730198
        }
      },
      [
        'Date',
        'Wed, 17 Mar 2021 13:28:53 GMT',
        'Content-Type',
        'application/json; charset=utf-8',
        'Content-Length',
        '132',
        'Connection',
        'close',
        'Set-Cookie',
        '__cfduid=da230166cf55e05e2279d2c81121345951615987732; expires=Fri, 16-Apr-21 13:28:52 GMT; path=/; domain=.gasnow.org; HttpOnly; SameSite=Lax',
        'set-cookie',
        'csrfToken=8ZP84E6Uf8JwE_yONYePQj97; path=/',
        'x-frame-options',
        'SAMEORIGIN',
        'x-xss-protection',
        '1; mode=block',
        'x-content-type-options',
        'nosniff',
        'x-download-options',
        'noopen',
        'x-readtime',
        '0',
        'Strict-Transport-Security',
        'max-age=15768000',
        'Access-Control-Allow-Origin',
        '*',
        'Access-Control-Allow-Methods',
        'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers',
        'DNT,X-Mx-ReqToken,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Authorization',
        'CF-Cache-Status',
        'DYNAMIC',
        'cf-request-id',
        '08e1f9090100002be977251000000001',
        'Expect-CT',
        'max-age=604800, report-uri="https://report-uri.cloudflare.com/cdn-cgi/beacon/expect-ct"',
        'Report-To',
        '{"endpoints":[{"url":"https:\\/\\/a.nel.cloudflare.com\\/report?s=amj63yVtvt8vgrJrEvEZ7w%2FQjcxRsUnhRymO0OkCL0vl6sVtt33SdVy5a3obhoHbQmAIWgk0gu2BqUYTdEMxLeE2k63TmfOtdVTGAsAUhQ%3D%3D"}],"group":"cf-nel","max_age":604800}',
        'NEL',
        '{"max_age":604800,"report_to":"cf-nel"}',
        'Server',
        'cloudflare',
        'CF-RAY',
        '631691219fe52be9-FRA',
        'alt-svc',
        'h3-27=":443"; ma=86400, h3-28=":443"; ma=86400, h3-29=":443"; ma=86400'
      ]
    )
}

export { mockApi, mockApiFeesTooHigh }
