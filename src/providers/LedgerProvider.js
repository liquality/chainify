import Provider from '../Provider'

import Transport from '@ledgerhq/hw-transport-node-hid'
// import bitcoinjs from 'bitcoinjs-lib'

export default class LedgerProvider extends Provider {
  static isSupported () {
    return Transport.isSupported()
  }

  constructor (App, baseDerivationPath) {
    super()

    this._App = App
    this._baseDerivationPath = baseDerivationPath
    this._addressCache = {}
  }

  async createTransport () {
    if (!LedgerProvider.transport) {
      LedgerProvider.transport = await Transport.create()
      LedgerProvider.transport.on('disconnect', () => {
        this._appInstance = null
        LedgerProvider.transport = null
      })
    }
  }

  async getApp () {
    await this.createTransport()

    if (!this._appInstance) {
      this._appInstance = new this._App(LedgerProvider.transport)
    }

    return this._appInstance
  }

  getDerivationPathFromIndex (index, change = false) {
    const changePath = change ? '1/' : '0/'
    return this._baseDerivationPath + changePath + index
  }

  async getDerivationPathFromAddress (address) {
    let path = false
    let index = 0
    let change = false

    // A maximum number of addresses to lookup after which it is deemed
    // that the wallet does not contain this address
    const maxAddresses = 50

    while (!path && index < maxAddresses) {
      const addr = await this.getAddresses(index, 1)
      if (addr[0].address === address) path = this.getDerivationPathFromIndex(index, change)
      index++
      if (index === maxAddresses && change === false) {
        index = 0
        change = true
      }
    }

    if (!path) {
      throw new Error('Ledger: Wallet does not contain address')
    }

    return path
  }

  async getAddressFromIndex (addressIndex, change = false) {
    const path = this.getDerivationPathFromIndex(addressIndex, change)
    if (path in this._addressCache) {
      return this._addressCache[path]
    }
    const address = await this.getAddressFromDerivationPath(path)
    this._addressCache[path] = address
    return address
  }

  async getAddressExtendedPubKeys (startingIndex = 0, numAddresses = 1) {
    const xpubkeys = []
    const lastIndex = startingIndex + numAddresses

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const xpubkey = await this.getAddressExtendedPubKey(currentIndex)
      xpubkeys.push(xpubkey)
    }

    return xpubkeys
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this.getAddresses(startingIndex, numAddresses, change)
  }

  // async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
  //   console.log("dsa")
  //   const addresses = []
  //   const lastIndex = startingIndex + numAddresses
  //
  //   for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
  //     const address = await this.getAddressFromIndex(currentIndex, change)
  //     console.log(address)
  //     addresses.push(address)
  //   }
  //
  //   return addresses
  // }
}
