import BitcoinRPCProvider from './BitcoinRPCProvider'

import Transport from '@ledgerhq/hw-transport-u2f'
// import Transport from '@ledgerhq/hw-transport-node-hid'
import LedgerBtc from '@ledgerhq/hw-app-btc'

export default class BitcoinLedgerProvider extends BitcoinRPCProvider {
  constructor (uri, user, pass) {
    super(uri, user, pass)
    this._ledgerBtc = false
    this._derivationPath = `44'/0'/0'/0`
  }

  async _connectToLedger () {
    if (!this._ledgerBtc) {
      const transport = await Transport.create()
      this._ledgerBtc = new LedgerBtc(transport)
    }
  }

  async _updateDerivationPath (path) {
    this._derivationPath = path
  }

  async getAddresses () {
    await this._connectToLedger()

    const { bitcoinAddress } = await this._ledgerBtc.getWalletPublicKey(this._derivationPath)

    return [ bitcoinAddress ]
  }

  async signMessage (message, from) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    return this._ledgerBtc.signMessageNew(this._derivationPath, hex)
  }
}
