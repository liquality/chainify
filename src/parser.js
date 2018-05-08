
/**
 * Module dependencies.
 */

import JSONBigInt from 'json-bigint'
import RpcError from './errors/rpc-error'
import _ from 'lodash'

/**
 * JSONBigInt parser.
 */

const { parse } = JSONBigInt({ storeAsString: true, strict: true }) // eslint-disable-line new-cap

/**
 * Get RPC response body result.
 */

/**
 * Export Parser class.
 */

export default class Parser {
  constructor ({ driver, headers } = {}) {
    this.driver = driver
    this.headers = headers
  }

  /**
   * Parse rpc response.
   */

  rpc (request, [response, body]) {
    // The RPC api returns a `text/html; charset=ISO-8859-1` encoded response with an empty string as the body
    // when an error occurs.
    if (typeof body === 'string' && response.headers['content-type'] !== 'application/json' && response.statusCode !== 200) {
      throw new RpcError(response.statusCode, response.statusMessage, { body })
    }

    // Parsing the body with custom parser to support BigNumbers.
    body = parse(body)

    if (!Array.isArray(body)) {
      return this.getRpcResult(request, body, { headers: this.headers, response })
    }

    // Batch response parsing where each response may or may not be successful.
    const batch = body.map(_body => {
      try {
        return this.getRpcResult(request, _body, { headers: false, response })
      } catch (e) {
        return e
      }
    })

    if (this.headers) {
      return [batch, response.headers]
    }

    return batch
  }

  getRpcResult (request, body, { headers = false, response } = {}) {
    if (body.error) {
      throw new RpcError(
        _.get(body, 'error.code', -32603),
        _.get(body, 'error.message', 'An error occurred while processing the RPC call')
      )
    }

    // Defensive measure. This should not happen on a RPC call.
    if (!_.has(body, 'result')) {
      throw new RpcError(-32700, 'Missing `result` on the RPC call result')
    }

    let _method

    _.forEach(this.driver.methods, (value, key) => {
      const _m = this.driver.formatter.request(key).method

      if (_m === request.method) {
        _method = key
      }
    })

    const formatter = this.driver.methods[_method].formatter || {}

    formatter.output = formatter.output || function (x) { return x }

    body.result = formatter.output(body.result)

    if (headers) {
      return [body.result, response.headers]
    }

    return body.result
  }
}
