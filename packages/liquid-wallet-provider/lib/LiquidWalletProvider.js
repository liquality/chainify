import * as liquid from 'liquidjs-lib'
import * as slip77 from 'slip77'
import * as bip32 from 'bip32'
import { mnemonicToSeed } from 'bip39'


import { LiquidAddressTypes } from './utils'
import { Address, asyncSetImmediate } from '@liquality/utils'
import { ConfidentialAddress } from './confidentialAddress'


const ADDRESS_TYPE_TO_PREFIX = {
  'legacy': 44,
  'p2sh-segwit': 49,
  'bech32': 84,
  'legacy-confidential': 44,
  'p2sh-segwit-confidential': 49,
  'blech32': 84
}

export default class LiquidWalletProvider {

  constructor(network, mnemonic, addressType = 'blech32', superArgs = []) {
    if (!LiquidAddressTypes.includes(addressType)) {
      throw new Error(`addressType must be one of ${LiquidAddressTypes.join(',')}`)
    }

    const baseDerivationPath = `${ADDRESS_TYPE_TO_PREFIX[addressType]}'/${network.coinType}'/0'`

    //super(...superArgs)

    this._baseDerivationPath = baseDerivationPath
    this._network = network
    this._addressType = addressType
    this._addressesCache = {}

    // TODO this should be moved up in LiquidJSWalletProvider
    if (!mnemonic) throw new Error('Mnemonic should not be empty')
    this._mnemonic = mnemonic
  }

  // TODO these need to me moved up in the parent provider, for example in a LiquidJSWalletProvider. 
  async seedNode() {
    if (this._seedNode) return this._seedNode

    const seed = await mnemonicToSeed(this._mnemonic)
    this._seedNode = bip32.fromSeed(seed, this._network)

    return this._seedNode
  }

  async blindingNode() {
    if (this._blindingNode) return this._blindingNode

    const seed = await mnemonicToSeed(this._mnemonic)
    this._blindingNode = slip77.fromSeed(seed)

    return this._blindingNode
  }

  async baseDerivationNode() {
    if (this._baseDerivationNode) return this._baseDerivationNode

    const baseNode = await this.seedNode()
    this._baseDerivationNode = baseNode.derivePath(this._baseDerivationPath)

    return this._baseDerivationNode
  }

  async keyPair(derivationPath) {
    const node = await this.seedNode()
    const wif = node.derivePath(derivationPath).toWIF()
    return liquid.ECPair.fromWIF(wif, this._network)
  }

  async blindingKeyPair(scriptPubKey) {
    const node = await this.blindingNode()
    const { publicKey, privateKey } = node.derive(scriptPubKey)
    return { publicKey, privateKey }
  }


  async getConfidentialAddresses(startingIndex = 0, numAddresses = 1, change = false) {
    return this._getAddresses(startingIndex, numAddresses, change, true)
  }

  async getAddresses(startingIndex = 0, numAddresses = 1, change = false) {
    return this._getAddresses(startingIndex, numAddresses, change, false)
  }

  async _getAddresses(startingIndex, numAddresses, change, isConfidential = true) {
    if (numAddresses < 1) { throw new Error('You must return at least one address') }

    const baseDerivationNode = await this.baseDerivationNode()
    const addresses = []
    const lastIndex = startingIndex + numAddresses
    const changeVal = change ? '1' : '0'

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const subPath = changeVal + '/' + currentIndex
      const path = this._baseDerivationPath + '/' + subPath

      if (path in this._addressesCache) {
        addresses.push(this._addressesCache[path])
        continue
      }

      const publicKey = baseDerivationNode.derivePath(subPath).publicKey

      const address = this.getAddressFromPublicKey(publicKey)
      let addressObject = new Address({
        address,
        publicKey,
        derivationPath: path,
        index: currentIndex
      })

      if (isConfidential) {
        const payment = this.getPaymentVariantFromPublicKey(publicKey)
        const blindingPubKey = (await this.blindingKeyPair(payment.output)).publicKey

        const confidentialAddress = this.getConfidentialAddressFromPublicKeyAndBlinding(publicKey, blindingPubKey)

        addressObject = new ConfidentialAddress({
          address: confidentialAddress,
          publicKey,
          derivationPath: path,
          index: currentIndex,
          blindingKey: blindingPubKey
        })
      }

      this._addressesCache[path] = addressObject
      addresses.push(addressObject)

      await asyncSetImmediate()
    }

    return addresses
  }

  getAddressFromPublicKey(publicKey) {
    return this.getPaymentVariantFromPublicKey(publicKey).address
  }

  getConfidentialAddressFromPublicKeyAndBlinding(publicKey, blindingPublicKey) {
    return this.getPaymentVariantFromPublicKey(publicKey, blindingPublicKey).confidentialAddress
  }

  getPaymentVariantFromPublicKey(publicKey, blindingPublicKey) {
    switch (this._addressType) {
      case 'legacy':
        return liquid.payments.p2pkh({ pubkey: publicKey, network: this._network })
      case 'p2sh-segwit':
        return liquid.payments.p2sh({
          redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this._network }),
          network: this._network
        })
      case 'bech32':
        return liquid.payments.p2wpkh({ pubkey: publicKey, network: this._network })
      case 'legacy-confidential':
        return liquid.payments.p2pkh({ pubkey: publicKey, blindkey: blindingPublicKey, network: this._network })
      case 'p2sh-segwit-confidential':
        return liquid.payments.p2sh({
          redeem: liquid.payments.p2wpkh({ pubkey: publicKey, network: this._network }),
          blindkey: blindingPublicKey,
          network: this._network
        })
      case 'blech32':
        return liquid.payments.p2wpkh({ pubkey: publicKey, blindkey: blindingPublicKey, network: this._network })
    }
  }

}
