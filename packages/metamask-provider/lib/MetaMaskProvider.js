import { isFunction } from 'lodash'

import WalletProvider from '@liquality/wallet-provider'
import { formatEthResponse } from '@liquality/ethereum-utils'
import { WalletError } from '@liquality/errors'
import Debug from '@liquality/debug'

const debug = Debug('metamask')

export default class MetaMaskProvider extends WalletProvider {
  constructor (metamaskProvider, network) {
    super(network)
    if (!isFunction(metamaskProvider.sendAsync)) {
      throw new Error('Invalid MetaMask Provider')
    }

    this._metamaskProvider = metamaskProvider
    this._network = network
  }

  async metamask (method, ...params) {
    if (global.window) {
      await global.window.ethereum.enable() // Ensure access to MetaMask is granted
    }

    return new Promise((resolve, reject) => {
      debug('asking', method, params)
      this
        ._metamaskProvider
        .sendAsync({ method, params }, (err, data) => {
          debug('got', err, data)

          const error = err || data.error
          if (error) {
            reject(new WalletError(error.toString(), error))
            return
          }

          if (!data) {
            reject(new WalletError('Metamask response was empty'))
            return
          }

          if (typeof data.result === 'undefined') {
            reject(new WalletError('Metamask response was empty'))
            return
          }

          const formattedResult = formatEthResponse(data.result)

          resolve(formattedResult)
        })
    })
  }
}
