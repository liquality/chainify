import Provider from '@liquality/provider'
import { NodeError } from '@liquality/errors'

import axios from 'axios'
import { get } from 'lodash'

import { version } from '../package.json'

export default class NodeProvider extends Provider {
  constructor (config) {
    super()
    this._node = axios.create(config)
  }

  _handleNodeError (e) {
    let { name, message, ...attrs } = e

    const data = get(e, 'response.data')
    if (data) message = data

    throw new NodeError(message, attrs)
  }

  nodeGet (url, params) {
    return this._node.get(url, { params })
      .then(response => response.data)
      .catch(this._handleNodeError)
  }

  nodePost (url, data) {
    return this._node.post(url, data)
      .then(response => response.data)
      .catch(this._handleNodeError)
  }
}

NodeProvider.version = version
