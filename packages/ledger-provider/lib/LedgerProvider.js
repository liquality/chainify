import WalletProvider from '@liquality/wallet-provider'
import { WalletError } from '@liquality/errors'
import Debug from '@liquality/debug'

import getTransport from './LedgerNodeTransport'
import { version } from '../package.json'

const debug = Debug('ledger')

export default class LedgerProvider extends WalletProvider {
  static getTransport (config = { useWebBle: false, useU2F: false }) {
    return getTransport(config)
  }

  static isSupported (config) {
    return getTransport(config).isSupported()
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

  useWebBle () {
    this._useWebBle = true
    return this
  }

  useU2F () {
    this._useU2F = true
    return this
  }

  async createTransport () {
    if (!this._transport) {
      debug('creating ledger transport')
      debug('useWebBle', this._useWebBle)
      debug('useU2F', this._useU2F)
      const Transport = LedgerProvider.getTransport({
        useWebBle: this._useWebBle,
        useU2F: this._useU2F
      })

      this._transport = await Transport.create()
      debug('ledger transport created')

      this._transport.on('disconnect', () => {
        debug('ledger disconnected')
        this._appInstance = null
        this._transport = null
      })
    }
  }

  errorProxy (target, func) {
    const method = target[func]
    const ctx = this
    if (Object.getOwnPropertyNames(target).includes(func) && typeof method === 'function') {
      return async (...args) => {
        debug(`calling "${func}" on ledger object`, args)

        try {
          const result = await method.bind(target)(...args)
          debug(`result from "${func}" on ledger object`, result)
          return result
        } catch (e) {
          const { name, ...errorNoName } = e
          ctx._transport = null
          ctx._appInstance = null
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
      this._appInstance = new Proxy(new this._App(this._transport), { get: this.errorProxy.bind(this) })
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
      await this._transport.send(0xe0, 0xc0, 0x00, 0x00)
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

  async getWalletAddress (address) {
    let index = 0
    let change = false

    // A maximum number of addresses to lookup after which it is deemed
    // that the wallet does not contain this address
    const maxAddresses = 1000
    const addressesPerCall = 50

    while (index < maxAddresses) {
      const addrs = await this.getAddresses(index, addressesPerCall, change)
      const addr = addrs.find(addr => addr.equals(address))
      if (addr) return addr

      index += addressesPerCall
      if (index === maxAddresses && change === false) {
        index = 0
        change = true
      }
    }

    throw new Error('Ledger: Wallet does not contain address')
  }
}

LedgerProvider.version = version
