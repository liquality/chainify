import Provider from '@liquality/provider'

import { version } from '../package.json'

export default class KibaProvider extends Provider {
  constructor (kibaProvider, network) {
    super()

    this._kibaProvider = kibaProvider
    this._network = network
  }

  async kiba (method, params) {
    const blockchain = this._network.name.startsWith('bitcoin') ? 'bitcoin' : 'ethereum'

    await this._kibaProvider.request('ENABLE', { networkPreferences: [{ blockchain }] })

    return this._kibaProvider.request(method, params)
  }
}

KibaProvider.version = version
