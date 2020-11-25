import NodeProvider from '@liquality/node-provider'
import Debug from '@liquality/debug'
import { NodeError } from '@liquality/errors'

import JSONBigInt from 'json-bigint'
import { has } from 'lodash'

import { version } from '../package.json'

const debug = Debug('jsonrpc')

const { parse, stringify } = JSONBigInt({ storeAsString: true, strict: true })

export default class JsonRpcProvider extends NodeProvider {
  constructor (uri, username, password) {
    const config = {
      baseURL: uri,
      responseType: 'text',
      transformResponse: undefined, // https://github.com/axios/axios/issues/907,
      validateStatus: status => true
    }

    if (username || password) {
      config.auth = { username, password }
    }

    super(config)
  }

  _prepareRequest (method, params) {
    const id = Date.now()
    const req = { id, method, params }

    debug('jsonrpc request', req)

    return req
  }

  _parseResponse (data) {
    debug('raw jsonrpc response', data)

    if (typeof data !== 'string') data = stringify(data)

    data = parse(data)

    debug('parsed jsonrpc response', data)

    const { error } = data

    if (error != null) {
      throw new NodeError(error.message || error)
    }

    if (!has(data, 'result')) {
      throw new NodeError('Missing `result` on the RPC call result')
    }

    return data.result
  }

  async jsonrpc (method, ...params) {
    const data = await this.nodePost('', this._prepareRequest(method, params))

    return this._parseResponse(data)
  }
}

JsonRpcProvider.version = version
