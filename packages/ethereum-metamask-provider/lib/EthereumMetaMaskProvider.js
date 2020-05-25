import { findKey } from 'lodash'

import MetaMaskProvider from '@liquality/metamask-provider'
import networks from '@liquality/ethereum-networks'
import {
  WalletError
} from '@liquality/errors'
import {
  ensure0x,
  remove0x,
  buildTransaction
} from '@liquality/ethereum-utils'
import {
  Address,
  addressToString
} from '@liquality/utils'

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

    return this.metamask('personal_sign', ensure0x(hex), ensure0x(address))
  }

  async sendTransaction (to, value, data, fee) {
    const networkId = await this.getWalletNetworkId()

    if (this._network) {
      if (networkId !== this._network.networkId) {
        throw new Error('Invalid MetaMask Network')
      }
    }

    const addresses = await this.getAddresses()
    const from = addressToString(addresses[0])

    const tx = await buildTransaction(from, to, value, data, fee)

    const txHash = await this.metamask('eth_sendTransaction', tx)

    return remove0x(txHash)
  }

  canUpdateFee () {
    return false
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
