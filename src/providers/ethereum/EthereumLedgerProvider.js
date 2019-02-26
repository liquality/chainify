import Ethereum from '@ledgerhq/hw-app-eth'

import LedgerProvider from '../LedgerProvider'
import networks from './networks'

export default class EthereumLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.mainnet }) {
    super(Ethereum, `44'/${chain.network.coinType}'/0'/`, chain.network, 'w0w') // srs!
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    return app.signPersonalMessage(address.derivationPath, hex)
  }
}
