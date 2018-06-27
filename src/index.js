import _ from 'lodash'
import semver from 'semver'
import Promise from 'bluebird'

import DNSParser from './DsnParser'
import JsonRpcHelper from './JsonRpcHelper'

import providers from './providers'

// DEV: hack
const request = require('request-promise')

export default class Client {
  constructor (uri) {
    const {
      baseUrl,
      driverName,
      timeout,
      returnHeaders,
      strictSSL,
      auth,
      version
    } = DNSParser(uri)

    this.transforms = {
      methodToRpc (method) {
        return method.toLowerCase()
      },
      value (val, unit) {
        return val
      }
    }

    this.methods = {}

    // unused. remove later
    this.rpcMethods = {}

    this.chainName = driverName
    this.baseUrl = baseUrl
    this.timeout = timeout
    this.returnHeaders = returnHeaders
    this.strictSSL = strictSSL
    this.auth = auth
    this.version = version

    this.jsonRpcHelper = new JsonRpcHelper({ version })
    this.request = request.defaults({
      baseUrl: this.baseUrl,
      strictSSL: this.strictSSL,
      timeout: this.timeout,
      resolveWithFullResponse: true
    })

    // load default providers
    if (providers[driverName]) {
      providers[driverName].forEach(provider => this.addProvider(provider))
    }
  }

  addProvider (provider) {
    provider.setClient(this)

    _.forOwn(provider.transforms(), (fn, transform) => {
      this.transforms[transform] = fn
    })

    const methods = provider.methods()

    if (this.version) {
      const result = /[0-9]+\.[0-9]+\.[0-9]+/.exec(this.version)

      if (!result) {
        throw new Error(`Invalid version "${this.version}"`, { version: this.version })
      }

      const [ version ] = result

      this.unsupportedMethods = _.chain(methods)
        .pickBy(method => !semver.satisfies(version, method.version))
        .keys()
        .value()
    }

    _.forOwn(provider.methods(), (obj, method) => {
      this.methods[method] = obj

      if (obj.rpc) {
        if (_.isFunction(obj.rpc)) {
          this[method] = _.partial(obj.rpc)
        } else {
          this[method] = _.partial(this.rpcWrapper, method, obj.rpc)
        }
      } else {
        const rpcMethod = this.getRpcMethod(method, obj)

        if (!this.rpcMethods[rpcMethod]) this.rpcMethods[rpcMethod] = obj
        this[method] = _.partial(this.rpcWrapper, method, rpcMethod)
      }
    })
  }

  getRpcMethod (method, obj) {
    if (obj.alias) {
      return this.getRpcMethod(obj.alias, this.methods[obj.alias])
    } else {
      return this.transforms.methodToRpc(method)
    }
  }

  handleTransformation (transformation, result) {
    if (_.isFunction(transformation)) {
      return Promise.resolve(transformation(result))
    } else if (transformation.rpc) {
      return this.rpc(transformation.rpc, result)
    } else if (_.isArray(transformation)) {
      const [ obj ] = transformation

      return Promise
        .map(result, param => this.handleTransformation(obj, param))
    } else {
      return Promise.reject(new Error('This type of mapping is not implemented yet.'))
    }
  }

  rpcWrapper (method, rpcMethod, ...args) {
    return this.rpc(rpcMethod, ...args)
      .then(result => {
        const { transform } = this.methods[method]

        if (transform) {
          return Promise
            .map(
              Object.keys(transform),
              field => {
                return this
                  .handleTransformation(transform[field], result[field])
                  .then(transformedField => {
                    result[field] = transformedField
                  })
              }
            )
            .then(__ => result)
        } else {
          return result
        }
      })
      .then(result => {
        const { type } = this.methods[method]

        if (type) {
          Object
            .keys(type)
            .forEach(key => {
              const t = type[key]

              if (typeof t === 'string') {
                result[key] = result[type[key]]
              } else if (_.isFunction(t)) {
                result[key] = t(key, result)
              } else {
                throw new Error('This type of mapping is not implemented yet.')
              }
            })
        }

        return result
      })
  }

  rpc (_method, ...args) {
    const methods = _method.split('|')

    return Promise
      .reduce(methods, (params, method) => {
        if (!_.isArray(params)) params = [ params ]

        const requestBody = this.jsonRpcHelper.prepareRequest({ method, params })

        return this.request.post({
          auth: _.pickBy(this.auth, _.identity),
          body: requestBody,
          uri: '/'
        }).then(this.jsonRpcHelper.parseResponse.bind(this.jsonRpcHelper))
      }, args)
  }
}

Client.providers = providers
