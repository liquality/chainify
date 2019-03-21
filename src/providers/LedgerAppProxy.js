import Transport from '@ledgerhq/hw-transport-node-hid'
import { get, random } from 'lodash'

import { WalletError } from '../errors'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class LedgerAppProxy {
  static async releaseLedgerInterface () {
    if (LedgerAppProxy.pendingActions <= 0) {
      await LedgerAppProxy.transport.close()
    }
  }

  static async claimLedgerInterface (attempt = 1, maxAttempts = 3) {
    try {
      if (get(Transport, 'WebUsbDevice.configuration.interfaces[2].claimed')) {
        return
      }

      LedgerAppProxy.transport = await Transport.open(Transport.WebUsbDevice)
    } catch (e) {
      if (maxAttempts >= attempt) {
        await sleep(random(800, 1200))
        await this.claimLedgerInterface(attempt + 1)
      } else {
        throw e
      }
    }
  }

  static async initTransport () {
    LedgerAppProxy.transport = await Transport.create()
    LedgerAppProxy.transport.on('disconnect', () => {
      LedgerAppProxy.transport = null
    })

    if (Transport.isWebUSBTransport) {
      Transport.WebUsbDevice = LedgerAppProxy.transport.device
    }
  }

  static async prepareTransport () {
    try {
      if (LedgerAppProxy.transport) {
        if (Transport.isWebUSBTransport) {
          await LedgerAppProxy.claimLedgerInterface()
        }
      } else {
        await LedgerAppProxy.initTransport()
      }
    } catch (e) {
      const { name, ...errorNoName } = e
      throw new WalletError(e.toString(), errorNoName)
    }
  }

  constructor (app) {
    this._app = app
    this.app = null
    return new Proxy({}, { get: this.proxy.bind(this) })
  }

  proxy (target, prop) {
    if (prop in this._app.prototype) {
      return async (...args) => {
        if (LedgerAppProxy.busy) {
          LedgerAppProxy.pendingActions++

          await new Promise(resolve => {
            const i = setInterval(() => {
              if (!LedgerAppProxy.busy) {
                clearInterval(i)

                LedgerAppProxy.pendingActions--
                resolve()
              }
            }, 300 + (LedgerAppProxy.pendingActions * 50))
          })
        }

        LedgerAppProxy.busy = true
        await LedgerAppProxy.prepareTransport()

        if (!this.app) {
          this.app = new this._app(LedgerAppProxy.transport)
        }

        const fn = this.app[prop].bind(this.app)
        const result = await fn(...args)
        await LedgerAppProxy.releaseLedgerInterface()

        LedgerAppProxy.busy = false
        return result
      }
    } else {
      return target[prop]
    }
  }
}

LedgerAppProxy.busy = false
LedgerAppProxy.pendingActions = 0
