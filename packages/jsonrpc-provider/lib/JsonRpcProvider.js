import axios from 'axios'
import JSONBigInt from 'json-bigint'
import { get, has } from 'lodash'

import Provider from '@liquality/provider'
import Debug from '@liquality/debug'
import { RpcError } from '@liquality/errors'

import { version } from '../package.json'

const debug = Debug('jsonrpc')

const { parse } = JSONBigInt({ storeAsString: true, strict: true })

export default class JsonRpcProvider extends Provider {
  constructor (uri, username, password) {
    super()

    this._uri = uri

    this._axios = axios.create({
      baseURL: uri,
      responseType: 'text',
      transformResponse: [data => data],
      validateStatus: (status) => true
    })

    if (username || password) {
      this._axios.defaults.auth = { username, password }
    }
  }

  _prepareRequest (method, params) {
    const id = Date.now()
    const req = { id, method, params }
    debug('jsonrpc request', req)
    return req
  }

  _parseResponse ({ data, status, statusText, headers }) {
    if (headers['content-type'] !== 'application/json') {
      throw new RpcError(status, statusText, { data })
    }

    data = parse(data)
    debug('parsed jsonrpc response', data)
    if (data.error != null) {
      throw new RpcError(
        get(data, 'error.code', -32603),
        get(data, 'error.message', 'An error occurred while processing the RPC call')
      )
    }

    if (!has(data, 'result')) {
      throw new RpcError(-32700, 'Missing `result` on the RPC call result')
    }

    return data.result
  }

  jsonrpc (method, ...params) {
    return this._axios.post(
      '',
      this._prepareRequest(method, params)
    )
      .then(this._parseResponse)
      .catch(e => {
        e.name = 'NodeError'

        throw e
      })
  }
}

JsonRpcProvider.version = version
