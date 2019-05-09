import { findKey } from 'lodash'
import { BigNumber } from 'bignumber.js'

import MetaMaskProvider from '@liquality/metamask-provider'
import networks from '@liquality/ethereum-networks'
import {
  WalletError
} from '@liquality/errors'
import {
  ensureHexEthFormat,
  ensureHexStandardFormat
} from '@liquality/ethereum-utils'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

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

    return addresses.map((address) => { return new Address({ address: address }) })
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
    const address = addressToString(addresses[0])

    return this.metamask('personal_sign', ensureHexEthFormat(hex), ensureHexEthFormat(address))
  }

  async getWalletInfo () {
    const unusedAddress = await this.getUnusedAddress()
    const balance = await this.getMethod('getBalance')(unusedAddress)

    return {
      balance,
      unusedAddress: addressToString(unusedAddress),
      usedAddresses: []
    }
  }

  async sendTransaction (to, value, data, from = null) {
    const networkId = await this.getWalletNetworkId()

    if (this._network) {
      if (networkId !== this._network.networkId) {
        throw new Error('Invalid MetaMask Network')
      }
    }

    if (to != null) {
      to = ensureHexEthFormat(addressToString(to))
    }

    if (from == null) {
      const addresses = await this.getAddresses()
      from = ensureHexEthFormat(addressToString(addresses[0]))
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
    const network = findKey(networks, network => network.networkId === networkId)

    if (networkId && !network) {
      return {
        name: 'unknown',
        networkId
      }
    }

    return networks[network]
  }
}

EthereumMetaMaskProvider.version = version
