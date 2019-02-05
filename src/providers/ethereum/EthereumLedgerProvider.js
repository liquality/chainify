import Ethereum from '@ledgerhq/hw-app-eth'

import LedgerProvider from '../LedgerProvider'
import networks from './networks'
import Address from '../../Address'

export default class EthereumLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.mainnet }) {
    super(Ethereum, `44'/${chain.network.coinType}'/0'/`, chain.network, 'w0w') // srs!
  }

  async getAddressFromDerivationPath (path) {
    const app = await this.getApp()
    const { address } = await app.getAddress(path)
    return new Address(address, path)
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    return app.signPersonalMessage(address.derivationPath, hex)
  }
}
