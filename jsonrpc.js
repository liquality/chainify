const crypto = require('crypto')

const rp = require('request-promise')

class JsonRPC {
  constructor (opts) {
    this.configure(opts)
  }

  configure (opts) {
    const protocol = opts.params.secure ? 'https' : 'http'

    this.uri = `${protocol}://${opts.host}:${opts.port}`
    this.username = opts.user || false
    this.password = opts.password || false

    if (this.username && this.password) {
      this.auth = Buffer.from(`${this.username}:${this.password}`).toString('base64')
    }
  }

  _getRandomBytes (size = 32) {
    return crypto.randomBytes(size).toString('hex')
  }

  _call (method, params = []) {
    if (!Array.isArray(params)) {
      params = [ params ]
    }

    const opts = {
      uri: this.uri,
      method: 'POST',
      body: {
        id: this._getRandomBytes(32),
        jsonrpc: '2.0',
        method: method,
        params: params
      },
      json: true
    }

    if (this.auth) {
      if (!opts.headers) opts.headers = {}

      opts.headers['Authorization'] = `Basic ${this.auth}`
    }

    return rp(opts).then(data => {
      if (data.error) {
        return Promise.reject(data.error)
      }

      return data.result
    })
  }
}

module.exports = JsonRPC
