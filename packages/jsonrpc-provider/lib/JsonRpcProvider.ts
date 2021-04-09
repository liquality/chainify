import NodeProvider, { AxiosRequestConfig, AxiosResponse } from '@liquality/node-provider'
import Debug from '@liquality/debug'
import { NodeError } from '@liquality/errors'

import JSONBigInt from 'json-bigint'
import { has } from 'lodash'

const debug = Debug('jsonrpc')

const { parse, stringify } = JSONBigInt({ storeAsString: true, strict: true, useNativeBigInt: true })

export default class JsonRpcProvider extends NodeProvider {
  constructor (uri: string, username?: string, password?: string) {
    const config: AxiosRequestConfig = {
      baseURL: uri,
      responseType: 'text',
      transformResponse: undefined, // https://github.com/axios/axios/issues/907,
      validateStatus: () => true
    }

    if (username || password) {
      config.auth = { username, password }
    }

    super(config)
  }

  _prepareRequest (method: string, params: any[]) {
    const id = Date.now()
    const req = { id, method, params }

    debug('jsonrpc request', req)

    return req
  }

  _parseResponse (_data: AxiosResponse) : any {
    debug('raw jsonrpc response', _data)

    let dataString: string = (typeof _data !== 'string') ? stringify(_data) : _data

    let data = parse(dataString)

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

  async jsonrpc (method: string, ...params: any[]) {
    const data = await super.nodePost('', this._prepareRequest(method, params))

    return this._parseResponse(data)
  }
}
