/* eslint-env mocha */

const { expect } = require('chai').use(require('chai-as-promised'))

const { DNSParser } = require('../../src')

describe('DNSParser', () => {
  it('should generate correct uri object for http connections', () => {
    const obj = DNSParser('bitcoin://test:test@localhost:1234/')

    return expect(obj).to.deep.equal({
      baseUrl: 'http://localhost:1234',
      loggerName: 'bitcoin',
      driverName: 'bitcoin',
      timeout: undefined,
      returnHeaders: false,
      strictSSL: false,
      auth: {
        username: 'test',
        password: 'test'
      },
      version: undefined
    })
  })

  it('should generate correct uri object for https connections', () => {
    const obj = DNSParser('bitcoin+s://test:test@localhost:1234/')

    return expect(obj).to.deep.equal({
      baseUrl: 'https://localhost:1234',
      loggerName: 'bitcoin+s',
      driverName: 'bitcoin',
      timeout: undefined,
      returnHeaders: false,
      strictSSL: false,
      auth: {
        username: 'test',
        password: 'test'
      },
      version: undefined
    })
  })

  it('should generate correct uri object for connections with query string', () => {
    const obj = DNSParser('bitcoin+s://test:test@localhost:1234/?timeout=1000&strictSSL=true&version=0.16.0&loggerName=test&returnHeaders=false')

    return expect(obj).to.deep.equal({
      baseUrl: 'https://localhost:1234',
      loggerName: 'test',
      driverName: 'bitcoin',
      timeout: 1000,
      returnHeaders: false,
      strictSSL: true,
      auth: {
        username: 'test',
        password: 'test'
      },
      version: '0.16.0'
    })
  })
})
