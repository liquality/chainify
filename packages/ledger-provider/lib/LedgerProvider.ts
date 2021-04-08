import WalletProvider from '@liquality/wallet-provider'
import { WalletError } from '@liquality/errors'
import { Network, Address } from '@liquality/types'
import HwTransport from '@ledgerhq/hw-transport'
import Debug from '@liquality/debug'

const debug = Debug('ledger')

interface IApp {
  transport: any
} 

export type Newable<T> = { new (...args: any[]): T; };

export default abstract class LedgerProvider<TApp extends IApp> extends WalletProvider {
  _App: any
  _network: Network
  _ledgerScrambleKey: string
  _transport: HwTransport
  _Transport: any
  _appInstance: TApp

  constructor (options: { App: Newable<TApp>, Transport: any, network: Network, ledgerScrambleKey: string }) {
    super({ network: options.network })

    this._App = options.App
    this._Transport = options.Transport
    this._network = options.network
    // The ledger scramble key is required to be set on the ledger transport
    // if communicating with the device using `transport.send` for the first time
    this._ledgerScrambleKey = options.ledgerScrambleKey
  }

  async createTransport () {
    if (!this._transport) {
      debug('creating ledger transport')
      // @ts-ignore _Transport is class and is dynamically assigned
      this._transport = await this._Transport.create()
      debug('ledger transport created')

      this._transport.on('disconnect', () => {
        debug('ledger disconnected')
        this._appInstance = null
        this._transport = null
      })
    }
  }

  errorProxy (target: any, func: string) {
    const method = target[func]
    const ctx = this
    if (Object.getOwnPropertyNames(target).includes(func) && typeof method === 'function') {
      return async (...args: any[]) => {
        debug(`calling "${func}" on ledger object`, args)

        try {
          const result = await method.bind(target)(...args)
          debug(`result from "${func}" on ledger object`, result)
          return result
        } catch (e) {
          const { name, ...errorNoName } = e
          ctx._transport = null
          ctx._appInstance = null
          console.log('error', func)
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

  async getWalletAddress (address: string) : Promise<Address> {
    let index = 0
    let change = false

    // A maximum number of addresses to lookup after which it is deemed
    // that the wallet does not contain this address
    const maxAddresses = 1000
    const addressesPerCall = 50

    while (index < maxAddresses) {
      const addrs = await this.getAddresses(index, addressesPerCall, change)
      const addr = addrs.find(addr => addr.address === address)
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
