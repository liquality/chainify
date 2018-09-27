import Provider from '../Provider'

import Transport from '@ledgerhq/hw-transport-node-hid'

export default class LedgerProvider extends Provider {
  static isSupported () {
    return Transport.isSupported()
  }

  constructor (App, baseDerivationPath) {
    super()

    this._App = App
    this._baseDerivationPath = baseDerivationPath
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

  getDerivationPathFromIndex (index) {
    return this._baseDerivationPath + index
  }

  async getDerivationPathFromAddress (address) {
    let path = false
    let index = 0

    while (!path) {
      const addr = await this.getAddresses(index, 1)
      if (String(addr) === address) path = this.getDerivationPathFromIndex(index)
      index++
    }

    return path
  }

  async getAddressFromIndex (addressIndex) {
    const path = this.getDerivationPathFromIndex(addressIndex)
    return this.getAddressFromDerivationPath(path)
  }

  async getAddresses (startingIndex = 0, numAddresses = 1) {
    const addresses = []
    const lastIndex = startingIndex + numAddresses

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const address = await this.getAddressFromIndex(currentIndex)
      addresses.push(address)
    }

    return addresses
  }
}
