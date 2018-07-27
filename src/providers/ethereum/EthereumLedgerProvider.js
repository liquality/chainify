import Transport from '@alias/ledger-transport'
import LedgerEth from '@ledgerhq/hw-app-eth'

import EthereumRPCProvider from './EthereumRPCProvider'

export default class EthereumLedgerProvider extends EthereumRPCProvider {
  constructor (uri, user, pass) {
    super(uri, user, pass)
    this._ledgerEth = false
    this._derivationPath = `44'/60'/0'/0'/0`
  }

  setClient (client) {
    this.client = client
  }

  async _connectToLedger () {
    if (!this._ledgerEth) {
      const transport = await Transport.create()
      this._ledgerEth = new LedgerEth(transport)
    }
  }

  async _updateDerivationPath (path) {
    this._derivationPath = path
  }

  async getAddresses () {
    await this._connectToLedger()

    const { address } = await this._ledgerEth.getAddress(this._derivationPath)

    return [ address ]
  }

  async signMessage (message) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    return this._ledgerEth.signPersonalMessage(this._derivationPath, hex)
  }
}
