import axios from 'axios'
import JSONBigInt from 'json-bigint'
import { get, has } from 'lodash'

import Provider from '../Provider'
import RpcError from './RpcError'

import networks from '../networks'

const { parse } = JSONBigInt({ storeAsString: true, strict: true })

export default class JsonRpcProvider extends Provider {
  constructor (uri, username, password, chain = { network: networks.bitcoin }) {
    super()

    this._network = chain.network
    this._axios = axios.create({
      baseURL: uri,
      responseType: 'text',
      transformResponse: undefined, // https://github.com/axios/axios/issues/907,
      validateStatus: (status) => true
    })

    if (username || password) {
      this._axios.defaults.auth = { username, password }
    }
  }

  _prepareRequest (method, params) {
    const id = Date.now()
    return { id, method, params }
  }

  _parseResponse ({ data, status, statusText, headers }) {
    if (typeof data === 'string' && headers['content-type'] !== 'application/json' && status !== 200) {
      throw new RpcError(status, statusText, { data })
    }

    data = parse(data)

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
      '/',
      this._prepareRequest(method, params)
    ).then(this._parseResponse)
  }
}
