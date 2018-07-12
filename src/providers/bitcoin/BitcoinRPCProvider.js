import axios from 'axios'

import { prepareRequest, praseResponse } from '../JsonRpcHelper'

export default class BitcoinRPCProvider {
  constructor (uri, user, pass) {
    this.axios = axios.create({
      baseURL: uri,
      transformRequest: [({ data }, headers) => prepareRequest(data)],
      transformResponse: [(data, headers) => praseResponse(data, headers)],
      validateStatus: (status) => status === 200
    })

    if (user || pass) {
      this.axios.defaults.auth = {
        username: user,
        password: pass
      }
    }
  }

  _rpc (method, ...params) {
    return this.axios.post('/', {
      data: { method, params }
    }).then(({ data }) => data)
  }

  async generateBlock (numberOfBlocks) {
    return this._rpc('generate', numberOfBlocks)
  }
}
