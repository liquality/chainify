import EthereumRPCProvider from './EthereumRPCProvider'

import Transport from '@ledgerhq/hw-transport-u2f'
// import Transport from '@ledgerhq/hw-transport-node-hid'
import LedgerEth from '@ledgerhq/hw-app-eth'

export default class EthereumLedgerProvider extends EthereumRPCProvider {
  constructor (uri, user, pass) {
    super(uri, user, pass)
    this._ledgerEth = false
    this._derivationPath = `44'/60'/0'/0'/0`
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
