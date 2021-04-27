import BitcoinCashWalletProvider from '../../bitcoin-cash-wallet-provider' //'@liquality/bitcoin-cash-wallet-provider'
import WalletProvider from '@liquality/wallet-provider'
import { BitcoinCashNetwork } from '../../bitcoin-cash-networks' //'@liquality/bitcoin-cash-networks'
import { Address, SendOptions } from '@liquality/types'
import { PsbtInputTarget } from '@liquality/types/dist/lib/bitcoin'

declare global {
  interface Window {
    bitcoinCash: {
      enable: () => Promise<Address[]>
      request: (request: { method: string; params: any[] }) => Promise<any>
    }
  }
}

interface BitcoinCashWalletApiProviderOptions {
  network: BitcoinCashNetwork
}

type WalletProviderConstructor<T = WalletProvider> = new (...args: any[]) => T

export default class BitcoinCashWalletApiProvider extends BitcoinCashWalletProvider(
  WalletProvider as WalletProviderConstructor
) {
  constructor(options: BitcoinCashWalletApiProviderOptions) {
    const { network } = options
    super({ network })
  }

  async request(method: string, ...params: any[]) {
    await window.bitcoinCash.enable()
    return window.bitcoinCash.request({ method, params })
  }

  async getAddresses(index = 0, num = 1, change = false) {
    return this.request('wallet_getAddresses', index, num, change)
  }

  async signMessage(message: string, address: string) {
    return this.request('wallet_signMessage', message, address)
  }

  async sendTransaction(sendOptions: SendOptions) {
    return this.request('wallet_sendTransaction', sendOptions)
  }

  async signPSBT(data: string, inputs: PsbtInputTarget[]) {
    return this.request('wallet_signPSBT', data, inputs)
  }

  async getConnectedNetwork() {
    return this.request('wallet_getConnectedNetwork')
  }

  async isWalletAvailable() {
    const addresses = await this.getAddresses()
    return addresses.length > 0
  }
}
