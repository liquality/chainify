/**
 * Module dependencies.
 */

import Promise from 'bluebird'
import _ from 'lodash'
import semver from 'semver'
import debugnyan from 'debugnyan'

import Parser from './parser'
import Requester from './requester'
import drivers from './drivers'
import request from './request'
import DNSParser from './dsnParser'

/**
 * Constructor.
 */

class Client {
  constructor (uri) {
    const {
      baseUrl,
      loggerName,
      driverName,
      timeout,
      returnHeaders,
      strictSSL,
      auth,
      version
    } = DNSParser(uri)

    const driver = drivers[driverName]

    if (!driver) throw new Error(`${driverName} is not supported, yet.`)

    this.driver = driver
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.returnHeaders = returnHeaders
    this.strictSSL = strictSSL

    this.auth = auth
    this.hasNamedParametersSupport = false

    // Find unsupported methods according to version.
    let unsupported = []

    if (version) {
      // Capture X.Y.Z when X.Y.Z.A is passed to support oddly formatted Bitcoin Core
      // versions such as 0.15.0.1.
      const result = /[0-9]+\.[0-9]+\.[0-9]+/.exec(version)

      if (!result) {
        throw new Error(`Invalid Version "${version}"`, { version })
      }

      const [ v ] = result

      if (this.driver === 'bitcoin') {
        this.hasNamedParametersSupport = semver.satisfies(v, '>=0.14.0')
      }

      unsupported = _.chain(driver.methods)
        .pickBy(method => !semver.satisfies(v, method.version))
        .keys()
        .value()
    }

    const req = request(driver, debugnyan(loggerName))

    this.request = Promise.promisifyAll(req.defaults({
      baseUrl: this.baseUrl,
      strictSSL: this.strictSSL,
      timeout: this.timeout
    }), { multiArgs: true })
    this.requester = new Requester({ driver, unsupported, version })
    this.parser = new Parser({ driver, headers: this.returnHeaders })

    /**
     * Add all known RPC methods.
     */

    _.forOwn(driver.methods, (range, method) => {
      const objMethod = driver.formatter.objMethod(method)
      this[objMethod] = _.partial(this.command, method)
    })
  }

  /**
   * Execute `rpc` command.
   */

  command (...args) {
    let body
    let callback
    let params = _.tail(args)
    const method = _.head(args)
    const lastArg = _.last(args)

    if (_.isFunction(lastArg)) {
      callback = lastArg
      params = _.dropRight(params)
    }

    if (this.hasNamedParametersSupport && params.length === 1 && _.isPlainObject(params[0])) {
      params = params[0]
    }

    return Promise.try(() => {
      if (Array.isArray(method)) {
        body = method.map((method, index) => this.requester.prepare({ method: method.method, params: method.params, suffix: index }))
      } else {
        body = this.requester.prepare({ method: method, params })
      }

      return this.request.postAsync({
        auth: _.pickBy(this.auth, _.identity),
        body: JSON.stringify(body),
        uri: '/'
      }).bind(this)
        .then((...data) => this.parser.rpc(body, ...data))
    }).asCallback(callback)
  }
}

/**
 * Export Client class (ESM).
 */

export default Client

/**
 * Export Client class (CJS) for compatibility with require.
 */

module.exports = Client
