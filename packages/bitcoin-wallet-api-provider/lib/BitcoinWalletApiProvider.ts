import { BitcoinWalletProvider } from '@liquality/bitcoin-wallet-provider'
import { WalletProvider } from '@liquality/wallet-provider'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'
import { Address, bitcoin, SendOptions } from '@liquality/types'
import { PsbtInputTarget } from '@liquality/types/dist/lib/bitcoin'

declare global {
  interface Window {
    bitcoin: {
      enable: () => Promise<Address[]>
      request: (request: { method: string; params: any[] }) => Promise<any>
    }
  }
}

interface BitcoinWalletApiProviderOptions {
  network: BitcoinNetwork
  addressType: bitcoin.AddressType
}

type WalletProviderConstructor<T = WalletProvider> = new (...args: any[]) => T

export default class BitcoinWalletApiProvider extends BitcoinWalletProvider(
  WalletProvider as WalletProviderConstructor
) {
  constructor(options: BitcoinWalletApiProviderOptions) {
    const { network, addressType = bitcoin.AddressType.BECH32 } = options
    super({ network, addressType })
  }

  async request(method: string, ...params: any[]) {
    await window.bitcoin.enable()
    return window.bitcoin.request({ method, params })
  }

  async getAddresses(index = 0, num = 1, change = false) {
    return this.request('wallet_getAddresses', index, num, change)
  }

  async signMessage(message: string, address: string) {
    return this.request('wallet_signMessage', message, address)
  }

  async sendTransaction(sendOptions: SendOptions) {
    return this.request('wallet_sendTransaction', { ...sendOptions, value: sendOptions.value.toNumber() })
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
