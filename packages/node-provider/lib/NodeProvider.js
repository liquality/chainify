import Provider from '@liquality/provider'
import { NodeError } from '@liquality/errors'

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { get } from 'lodash'

export default class NodeProvider extends Provider {
  _node: AxiosInstance
  constructor (config: AxiosRequestConfig) {
    super()
    this._node = axios.create(config)
  }

  _handleNodeError (e: Error) {
    let { name, message, ...attrs } = e

    const data = get(e, 'response.data')
    if (data) message = data

    throw new NodeError(message, attrs)
  }

  nodeGet (url: string, params: any = {}) : Promise<any> {
    return this._node.get(url, { params })
      .then(response => response.data)
      .catch(this._handleNodeError)
  }

  nodePost (url: string, data: any) : Promise<any>  {
    return this._node.post(url, data)
      .then(response => response.data)
      .catch(this._handleNodeError)
  }
}

