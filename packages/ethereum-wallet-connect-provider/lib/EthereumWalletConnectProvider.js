import { findKey } from 'lodash'
import { BigNumber } from 'bignumber.js'

import Provider from '@liquality/provider'
import WalletConnect from '@walletconnect/browser'
import WalletConnectQRCodeModal from '@walletconnect/qrcode-modal'
import networks from '@liquality/ethereum-networks'
import {
  WalletError
} from '@liquality/errors'
import {
  ensure0x,
  remove0x
} from '@liquality/ethereum-utils'
import {
  Address,
  addressToString
} from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumWalletConnectProvider extends Provider {
  constructor (network, bridge = 'https://bridge.walletconnect.org') {
    super()
    this._network = network
    this._bridge = bridge
  }

  async connect () {
    if (!this._connector) {
      this._connector = new WalletConnect({
        bridge: this._bridge
      })

      if (this._connector.connected) return

      const promise = new Promise((resolve, reject) => {
        this._connector.on('connect', (error, payload) => {
          if (error) {
            reject(error)
          }
          // Close QR Code Modal
          WalletConnectQRCodeModal.close()
          // Get provided accounts and chainId
          const { accounts, chainId } = payload.params[0]
          resolve({ accounts, chainId })
        })
      })

      this._connector.on('disconnect', (error, payload) => {
        if (error) {
          throw error
        }

        delete this._connector
      })

      await this._connector.createSession()
      const uri = this._connector.uri
      WalletConnectQRCodeModal.open(uri)

      return promise
    }
  }

  async isWalletAvailable () {
    const addresses = this._connector.accounts
    return addresses.length > 0
  }

  async getAddresses () {
    await this.connect()

    const addresses = this._connector.accounts

    if (addresses.length === 0) {
      throw new WalletError('WalletConnect: No addresses available from wallet')
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
    await this.connect()

    const hex = Buffer.from(message).toString('hex')

    const addresses = await this.getAddresses()
    const address = addressToString(addresses[0])

    return this._connector.signPersonalMessage([ensure0x(hex), ensure0x(address)])
  }

  async sendTransaction (to, value, data, from) {
    await this.connect()

    const networkId = await this.getWalletNetworkId()

    if (this._network) {
      if (networkId !== this._network.networkId) {
        throw new Error('Invalid MetaMask Network')
      }
    }

    if (!from) {
      const addresses = await this.getAddresses()
      from = addressToString(addresses[0])
    }

    const tx = {
      from: ensure0x(from),
      value: ensure0x(BigNumber(value).toString(16))
    }

    if (to) tx.to = ensure0x(addressToString(to))
    if (data) tx.data = ensure0x(data)

    tx.gas = ensure0x((await this.getMethod('estimateGas')(tx)).toString(16))

    const txHash = await this._connector.sendTransaction(tx)

    return remove0x(txHash)
  }

  async getWalletNetworkId () {
    await this.connect()

    return this._connector.chainId
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

EthereumWalletConnectProvider.version = version
