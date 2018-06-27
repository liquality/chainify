import JSONBigInt from 'json-bigint'
import { get, has, includes } from 'lodash'

import RpcError from './errors/rpc-error'

const { parse } = JSONBigInt({ storeAsString: true, strict: true }) // eslint-disable-line new-cap

export default class JsonRpcHelper {
  constructor ({ unsupported = [], version } = {}) {
    this.unsupported = unsupported
    this.version = version
  }

  prepareRequest ({ method, params = [], suffix }) {
    if (this.version && includes(this.unsupported, method)) {
      throw new Error(`Method "${method}" is not supported by version "${this.version}"`)
    }

    return JSON.stringify({
      id: `${Date.now()}${suffix !== undefined ? `-${suffix}` : ''}`,
      method: method,
      params: params
    })
  }

  parseResponse (response) {
    // console.log(response)
    // The RPC api returns a `text/html; charset=ISO-8859-1` encoded response with an empty string as the body
    // when an error occurs.
    if (typeof response.body === 'string' && response.headers['content-type'] !== 'application/json' && response.statusCode !== 200) {
      throw new RpcError(response.statusCode, response.statusMessage, { body: response.body })
    }

    // Parsing the body with custom parser to support BigNumbers.
    response.body = parse(response.body)

    return this.getRpcResult(response)
  }

  getRpcResult ({ body }) {
    if (body.error) {
      throw new RpcError(
        get(body, 'error.code', -32603),
        get(body, 'error.message', 'An error occurred while processing the RPC call')
      )
    }

    // Defensive measure. This should not happen on a RPC call.
    if (!has(body, 'result')) {
      throw new RpcError(-32700, 'Missing `result` on the RPC call result')
    }

    return body.result
  }
}
