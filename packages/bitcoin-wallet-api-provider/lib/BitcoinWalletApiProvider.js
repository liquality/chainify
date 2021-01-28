import BitcoinWalletProvider from '@liquality/bitcoin-wallet-provider'
import WalletProvider from '@liquality/wallet-provider'
import { Address } from '@liquality/utils'

import { version } from '../package.json'

export default class BitcoinWalletApiProvider extends BitcoinWalletProvider(WalletProvider) {
  constructor (network, addressType = 'bech32') {
    super(network, addressType, [network])
  }

  async request (method, ...params) {
    await window.bitcoin.enable()
    return window.bitcoin.request({ method, params })
  }

  async getWalletAddress (address) {
    const walletAddress = await super.getWalletAddress(address)
    walletAddress._publicKey = Buffer.from(walletAddress.publicKey.data) // TODO: this shenanigans
    return new Address(walletAddress)
  }

  async getAddresses (index = 0, num = 1, change = false) {
    const addrs = await this.request('wallet_getAddresses', index, num, change)
    return addrs.map(a => new Address(a))
  }

  async signMessage (message, address) {
    return this.request('wallet_signMessage', message, address.address)
  }

  async sendTransaction (to, value) {
    return this.request('wallet_sendTransaction', to, value)
  }

  async signPSBT (data, inputs) {
    return this.request('wallet_signPSBT', data, inputs)
  }

  async getConnectedNetwork () {
    return this.request('wallet_getConnectedNetwork')
  }

  async isWalletAvailable () {
    const addresses = await this.getAddresses()
    return addresses.length > 0
  }
}

BitcoinWalletApiProvider.version = version
