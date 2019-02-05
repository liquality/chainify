import Transport from '@ledgerhq/hw-transport-node-hid'
import WalletProvider from './WalletProvider'
import { WalletError } from '../errors'

export default class LedgerProvider extends WalletProvider {
  static isSupported () {
    return Transport.isSupported()
  }

  constructor (App, baseDerivationPath, network, ledgerScrambleKey) {
    super(network)

    this._App = App
    this._baseDerivationPath = baseDerivationPath
    this._network = network
    // The ledger scramble key is required to be set on the ledger transport
    // if communicating with the device using `transport.send` for the first time
    this._ledgerScrambleKey = ledgerScrambleKey
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

  errorProxy (target, func) {
    const method = target[func]
    if (Object.getOwnPropertyNames(target).includes(func) && typeof method === 'function') {
      return async (...args) => {
        try {
          const result = await method.bind(target)(...args)
          return result
        } catch (e) {
          const { name, ...errorNoName } = e
          throw new WalletError(e.toString(), errorNoName)
        }
      }
    } else {
      return method
    }
  }

  async getApp () {
    try {
      await this.createTransport()
    } catch (e) {
      const { name, ...errorNoName } = e
      throw new WalletError(e.toString(), errorNoName)
    }

    if (!this._appInstance) {
      this._appInstance = new Proxy(new this._App(LedgerProvider.transport), { get: this.errorProxy })
    }

    return this._appInstance
  }

  async isWalletAvailable () {
    const app = await this.getApp()
    if (!app.transport.scrambleKey) { // scramble key required before calls
      app.transport.setScrambleKey(this._ledgerScrambleKey)
    }
    const exchangeTimeout = app.transport.exchangeTimeout
    app.transport.setExchangeTimeout(2000)
    try {
      // https://ledgerhq.github.io/btchip-doc/bitcoin-technical-beta.html#_get_random
      await LedgerProvider.transport.send(0xe0, 0xc0, 0x00, 0x00)
    } catch (e) {
      return false
    } finally {
      app.transport.setExchangeTimeout(exchangeTimeout)
    }
    return true
  }

  async getConnectedNetwork () {
    // Ledger apps do not provide connected network. It is separated in firmware.
    return this._network
  }

  getDerivationPathFromIndex (index, change = false) {
    const changePath = change ? '1/' : '0/'
    return this._baseDerivationPath + changePath + index
  }

  async getWalletAddress (address) {
    let index = 0
    let change = false

    // A maximum number of addresses to lookup after which it is deemed
    // that the wallet does not contain this address
    const maxAddresses = 1000
    const addressesPerCall = 50

    while (index < maxAddresses) {
      const addrs = await this.getAddresses(index, addressesPerCall)
      const addr = addrs.find(addr => addr.address === address)
      if (addr) {
        return addr
      }
      index += addressesPerCall
      if (index === maxAddresses && change === false) {
        index = 0
        change = true
      }
    }

    throw new Error('Ledger: Wallet does not contain address')
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
