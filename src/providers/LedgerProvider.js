import Provider from '../Provider'

import Transport from '@alias/ledger-transport'
import LedgerBtc from '@ledgerhq/hw-app-btc'

export default class LedgerProvider extends Provider {
  static async isSupported () {
    return Transport.isSupported()
  }

  async connect () {
    if (!this._ledgerBtc) {
      const transport = await Transport.create()
      this._ledgerBtc = new LedgerBtc(transport)
    }
  }

  async disconnect () {

  }

  async isConnected () {
    // return this
  }

  async onConnected (cb) {

  }

  async onDisconnected (cb) {

  }

  async gasdA (index = 0) {
    return this._ledgerBtc.getWalletPublicKey(`49'/0'/0'/0/${index}`, false, true)
  }

  async _connectToLedger () {
    if (!this._ledgerBtc) {
      const transport = await Transport.create()
      this._ledgerBtc = new LedgerBtc(transport)
    }
  }
}
