import Provider from '@liquality/provider'
import { Address, addressToString } from '@liquality/utils'
import { normalizeTransactionObject } from '@liquality/near-utils'

import { InMemorySigner, KeyPair } from 'near-api-js'
import { InMemoryKeyStore } from 'near-api-js/lib/key_stores'
import { transfer } from 'near-api-js/lib/transaction'
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

  getSigner () {
    return new InMemorySigner(this._keyStore)
  }

  async signMessage (message) {
    const addresses = await this.getAddresses()

    const signed = await this.getSigner().signMessage(
      Buffer.from(message),
      addressToString(addresses[0]),
      this._network.networkId
    )

    return Buffer.from(signed.signature).toString('hex')
  }

  async sendTransaction (to, value, actions) {
    const addresses = await this.getAddresses()
    const from = await this.getMethod('getAccount')(
      addressToString(addresses[0]),
      this.getSigner()
    )

    if (!actions) {
      actions = [transfer(value)]
    }

    const tx = await from.signAndSendTransaction(to, actions)
    return normalizeTransactionObject(tx)
  }

  async sendSweepTransaction (address) {
    const addresses = await this.getAddresses()
    const from = await this.getMethod('getAccount')(
      addresses[0].address,
      this.getSigner()
    )

    const tx = await from.deleteAccount(address)
    return normalizeTransactionObject(tx)
  }

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
