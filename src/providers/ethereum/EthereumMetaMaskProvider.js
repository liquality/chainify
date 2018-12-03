import Provider from '../../Provider'

import { isFunction } from 'lodash'
import { formatEthResponse, ensureHexEthFormat, ensureHexStandardFormat } from './EthereumUtil'
import { BigNumber } from 'bignumber.js'

export default class EthereumMetaMaskProvider extends Provider {
  constructor (metamaskProvider, networkId) {
    super()
    if (!isFunction(metamaskProvider.sendAsync)) {
      throw new Error('Invalid MetaMask Provider')
    }

    this._metamaskProvider = metamaskProvider
    this._networkId = parseInt(networkId)
  }

  _toMM (method, ...params) {
    return new Promise((resolve, reject) => {
      this
        ._metamaskProvider
        .sendAsync({ method, params }, (err, data) => {
          if (err) {
            reject(err)
            return
          }

          if (!data) {
            reject(new Error('Something went wrong'))
            return
          }

          if (typeof data.result === 'undefined') {
            reject(new Error('Something went wrong'))
            return
          }

          const formattedResult = formatEthResponse(data.result)

          resolve(formattedResult)
        })
    })
  }

  async getAddresses () {
    const addresses = await this._toMM('eth_accounts')

    return addresses.map((address) => { return { address: address } })
  }

  async getUsedAddresses (startingIndex, numAddresses) {
    return this.getAddresses()
  }

  async getUnusedAddress () {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async signMessage (message) {
    const hex = Buffer.from(message).toString('hex')

    const addresses = await this.getAddresses()
    const address = addresses[0].address

    return this._toMM('personal_sign', `0x${hex}`, `0x${address}`)
  }

  async sendTransaction (to, value, data, from = null) {
    const networkId = await this.getWalletNetworkId()

    if (this._networkId) {
      if (networkId !== this._networkId) {
        throw new Error('Invalid MetaMask Network')
      }
    }

    if (to != null) {
      to = ensureHexEthFormat(to)
    }

    if (from == null) {
      const addresses = await this.getAddresses()
      from = ensureHexEthFormat(addresses[0].address)
    }

    value = BigNumber(value).toString(16)

    const tx = {
      from: ensureHexEthFormat(from),
      to,
      value: ensureHexEthFormat(value),
      data: ensureHexEthFormat(data)
    }

    const txHash = await this._toMM('eth_sendTransaction', tx)
    return ensureHexStandardFormat(txHash)
  }

  async getWalletNetworkId () {
    const networkId = await this._toMM('net_version')

    return parseInt(networkId)
  }
}
