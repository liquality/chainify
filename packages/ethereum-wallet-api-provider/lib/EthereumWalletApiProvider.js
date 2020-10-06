import { findKey } from 'lodash'

import WalletProvider from '@liquality/wallet-provider'
import networks from '@liquality/ethereum-networks'
import { WalletError } from '@liquality/errors'
import { ensure0x, buildTransaction, formatEthResponse, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { Address, addressToString } from '@liquality/utils'
import Debug from '@liquality/debug'
import { version } from '../package.json'

const debug = Debug('ethereum')

// EIP1193
export default class EthereumWalletApiProvider extends WalletProvider {
  constructor (ethereumProvider, network) {
    super(network)
    this._ethereumProvider = ethereumProvider
    this._network = network
  }

  async request (method, ...params) {
    await this._ethereumProvider.enable()

    try {
      const result = await this._ethereumProvider.request({ method, params })
      debug('got success', result)
      return formatEthResponse(result)
    } catch (e) {
      debug('got error', e.message)
      throw new WalletError(e.toString(), e)
    }
  }

  async isWalletAvailable () {
    const addresses = await this.request('eth_accounts')
    return addresses.length > 0
  }

  async getAddresses () {
    const addresses = await this.request('eth_accounts')

    if (addresses.length === 0) {
      throw new WalletError('Wallet: No addresses available')
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

    return this.request('personal_sign', ensure0x(hex), ensure0x(address))
  }

  async sendTransaction (to, value, data, fee) {
    const networkId = await this.getWalletNetworkId()

    if (this._network) {
      if (networkId !== this._network.networkId) {
        throw new Error('Invalid Network')
      }
    }

    const addresses = await this.getAddresses()
    const from = addressToString(addresses[0])

    const tx = await buildTransaction(from, to, value, data, fee)

    const txHash = await this.request('eth_sendTransaction', tx)

    return normalizeTransactionObject(formatEthResponse({ ...tx, hash: txHash }))
  }

  canUpdateFee () {
    return false
  }

  async getWalletNetworkId () {
    const networkId = await this.request('net_version')

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

EthereumWalletApiProvider.version = version
