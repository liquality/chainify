import Provider from '@liquality/provider'
import { Address } from '@liquality/utils'
import { InMemorySigner, KeyPair } from 'near-api-js'
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores'
import { parseSeedPhrase } from 'near-seed-phrase'

import { version } from '../package.json'

export default class NearJsWalletProvider extends Provider {
  constructor (network, mnemonic) {
    super()
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = `m/44'/${network.coinType}'/0'`
    this._keyStore = new InMemoryKeyStore()
  }

  async getAddresses () {
    const { publicKey, secretKey } = parseSeedPhrase(
      this._mnemonic,
      this._derivationPath
    )

    const keyPair = KeyPair.fromString(secretKey)
    const address = await this.getMethod('getAccounts')(publicKey, 0)
    await this._keyStore.setKey(this._network.networkId, address, keyPair)

    return [new Address(address, this._derivationPath, publicKey, 0)]
  }

  async getUnusedAddress () {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async getUsedAddresses () {
    return this.getAddresses()
  }

  async signMessage (message) {
    return new InMemorySigner(this._keyStore).signMessage(Buffer.from(message))
  }

  async sendTransaction (to, value, data, _gasPrice) {}

  async sendSweepTransaction (address, _gasPrice) {}

  async isWalletAvailable () {
    const addresses = await this.getAddresses()
    return addresses.length > 0
  }

  async getWalletNetworkId () {
    return this._network.networkId
  }

  canUpdateFee () {
    return false
  }
}

NearJsWalletProvider.version = version
