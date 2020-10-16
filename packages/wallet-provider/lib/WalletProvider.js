import { isEqual } from 'lodash'

import Provider from '@liquality/provider'
import {
  WalletError,
  UnimplementedMethodError
} from '@liquality/errors'

import { version } from '../package.json'

export default class WalletProvider extends Provider {
  constructor (network) {
    super()
    this._network = network
    this._methods = Object.getOwnPropertyNames(WalletProvider.prototype)
      .filter(method => ![
        'constructor',
        '_networkMatchProxy',
        'getConnectedNetwork',
        'assertNetworkMatch',
        'isWalletAvailable'
      ].includes(method))
    return network ? new Proxy(this, { get: this._networkMatchProxy.bind(this) }) : this
  }

  _networkMatchProxy (target, func) {
    const method = target[func]
    if (this._methods.includes(func)) {
      return async (...args) => {
        await this.assertNetworkMatch()
        return method.bind(target)(...args)
      }
    } else {
      return method
    }
  }

  async assertNetworkMatch () {
    const connectedNetwork = await this.getConnectedNetwork()
    if (!(isEqual(connectedNetwork, this._network) || connectedNetwork.name === 'unknown')) {
      throw new WalletError(`Network mismatch. Configured network '${this._network.name}' does not match connected network '${connectedNetwork.name}'`)
    }
  }

  isWalletAvailable () {
    throw new UnimplementedMethodError('isWalletAvailable not implemented.')
  }

  getAddresses () {
    throw new UnimplementedMethodError('getAddresses not implemented.')
  }

  getUsedAddresses () {
    throw new UnimplementedMethodError('getUsedAddresses not implemented.')
  }

  getUnusedAddress () {
    throw new UnimplementedMethodError('getUnusedAddress not implemented.')
  }

  signMessage () {
    throw new UnimplementedMethodError('signMessage not implemented.')
  }

  async getConnectedNetwork () {
    throw new UnimplementedMethodError('getConnectedNetwork not implemented.')
  }
}

WalletProvider.version = version
