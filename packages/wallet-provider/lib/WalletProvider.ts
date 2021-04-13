import Provider from '@liquality/provider'
import { Network, WalletProvider as IWalletProvider, Address } from '@liquality/types'
import { WalletError } from '@liquality/errors'

import { isEqual } from 'lodash'

export default abstract class WalletProvider extends Provider implements IWalletProvider {
  _network: Network
  _methods: string[]

  constructor(options: { network: Network }) {
    super()
    this._network = options.network
    this._methods = Object.getOwnPropertyNames(WalletProvider.prototype).filter(
      (method) =>
        ![
          'constructor',
          '_networkMatchProxy',
          'getConnectedNetwork',
          'assertNetworkMatch',
          'isWalletAvailable'
        ].includes(method)
    )
    return this._network ? new Proxy(this, { get: this._networkMatchProxy.bind(this) }) : this
  }

  _networkMatchProxy(target: any, func: string) {
    const method = target[func]
    if (this._methods.includes(func)) {
      return async (...args: any[]) => {
        await this.assertNetworkMatch()
        return method.bind(target)(...args)
      }
    } else {
      return method
    }
  }

  async assertNetworkMatch() {
    const connectedNetwork = await this.getConnectedNetwork()
    if (!(isEqual(connectedNetwork, this._network) || connectedNetwork.name === 'unknown')) {
      throw new WalletError(
        `Network mismatch. Configured network '${this._network.name}' does not match connected network '${connectedNetwork.name}'`
      )
    }
  }

  abstract isWalletAvailable(): Promise<boolean>

  abstract getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<Address[]>

  abstract getUsedAddresses(numAddressPerCall?: number): Promise<Address[]>

  abstract getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address>

  abstract signMessage(message: string, from: string): Promise<string>

  abstract getConnectedNetwork(): Promise<any>
}
