/* global window */

import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import MetaMaskProvider from '../MetaMaskProvider'
import { ensureHexEthFormat, ensureHexStandardFormat } from './EthereumUtil'
import { WalletError } from '../../errors'
import networks from './networks'

export default class EthereumMetaMaskProvider extends MetaMaskProvider {
  async isWalletAvailable () {
    const addresses = await this.metamask('eth_accounts')
    return addresses.length > 0
  }

  async getAddresses () {
    const addresses = await this.metamask('eth_accounts')
    if (addresses.length === 0) {
      throw new WalletError('Metamask: No addresses available from wallet')
    }
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

    return this.metamask('personal_sign', `0x${hex}`, `0x${address}`)
  }

  async getWalletInfo () {
    const unusedAddressObj = await this.getUnusedAddress()
    const unusedAddress = unusedAddressObj.address
    const balance = await this.getMethod('getBalance')([unusedAddress])
    return { balance, unusedAddress, usedAddresses: [] }
  }

  async sendTransaction (to, value, data, from = null) {
    const networkId = await this.getWalletNetworkId()
    if (this._network) {
      if (networkId !== this._network.networkId) {
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

    const txHash = await this.metamask('eth_sendTransaction', tx)
    return ensureHexStandardFormat(txHash)
  }

  async getWalletNetworkId () {
    const networkId = await this.metamask('net_version')

    return parseInt(networkId)
  }

  async getConnectedNetwork () {
    const networkId = await this.getWalletNetworkId()
    const network = _.findKey(networks, network => network.networkId === networkId)
    if (networkId && !network) {
      return { name: 'unknown', networkId }
    }
    return networks[network]
  }
}
