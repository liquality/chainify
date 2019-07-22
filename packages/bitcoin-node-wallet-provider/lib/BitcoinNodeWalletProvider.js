import WalletProvider from '@liquality/wallet-provider'
import JsonRpcProvider from '@liquality/jsonrpc-provider'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class BitcoinNodeWalletProvider extends WalletProvider {
  constructor (network, uri, username, password) {
    super()
    this.network = network
    this.rpc = new JsonRpcProvider(uri, username, password)
  }

  async signMessage (message, from) {
    from = addressToString(from)
    return this.rpc.jsonrpc('signmessage', from, message).then(result => Buffer.from(result, 'base64').toString('hex'))
  }

  async dumpPrivKey (address) {
    address = addressToString(address)
    return this.rpc.jsonrpc('dumpprivkey', address)
  }

  async getNewAddress (type = 'legacy') {
    const params = type ? ['', type] : []
    const newAddress = await this.rpc.jsonrpc('getnewaddress', ...params)

    if (!newAddress) return null

    return new Address(newAddress)
  }

  async getAddresses (startingIndex = 0, numAddresses = 1) {
    const addresses = []
    const lastIndex = startingIndex + numAddresses

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const address = await this.getNewAddress()
      addresses.push(address)
    }

    return addresses
  }

  async getUnusedAddress () {
    return this.getNewAddress()
  }

  async getUsedAddresses () {
    const addresses = await this.rpc.jsonrpc('listaddressgroupings')
    const ret = []

    for (const group of addresses) {
      for (const address of group) {
        ret.push(new Address({ address: address[0] }))
      }
    }

    const emptyaddresses = await this.rpc.jsonrpc('listreceivedbyaddress', 0, true)

    for (const address of emptyaddresses) {
      ret.push(new Address({ address: address.address }))
    }

    return ret
  }

  async isWalletAvailable () {
    const newAddress = await this.getNewAddress()
    return !!newAddress
  }
}

BitcoinNodeWalletProvider.version = version
