import * as liquid from 'liquidjs-lib'

import { LiquidAddressTypes } from './utils'
import { ConfidentialAddress, UnconfidentialAddress, asyncSetImmediate } from './confidentialAddress'

const ADDRESS_TYPE_TO_PREFIX = {
  'legacy': 44,
  'p2sh-segwit': 49,
  'bech32': 84,
  'legacy-confidential': 44,
  'p2sh-segwit-confidential': 49,
  'blech32': 84
}

export default superclass => class LiquidWalletProvider extends superclass {
  constructor (network, addressType = 'blech32', superArgs = []) {
    if (!LiquidAddressTypes.includes(addressType)) {
      throw new Error(`addressType must be one of ${LiquidAddressTypes.join(',')}`)
    }

    const baseDerivationPath = `${ADDRESS_TYPE_TO_PREFIX[addressType]}'/${network.coinType}'/0'`

    super(...superArgs)

    this._baseDerivationPath = baseDerivationPath
    this._network = network
    this._addressType = addressType
    this._addressesCache = {}
  }

  async getConfidentialAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this._getAddresses(startingIndex, numAddresses, change, true)
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this._getAddresses(startingIndex, numAddresses, change, false)
  }

  async _getAddresses (startingIndex, numAddresses, change, isConfidential = true) {
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
      let addressObject = new UnconfidentialAddress({
        address,
        publicKey,
        derivationPath: path,
        index: currentIndex
      })

      if (isConfidential) {
        const payment = this.getPaymentVariantFromPublicKey(publicKey)
        const blindingKeyPair = await this.blindingKeyPair(payment.output)

        const confidentialAddress = this.getConfidentialAddressFromPublicKeyAndBlinding(publicKey, blindingKeyPair.publicKey)

        addressObject = new ConfidentialAddress({
          address: confidentialAddress,
          publicKey,
          derivationPath: path,
          index: currentIndex,
          blindingPublicKey: blindingKeyPair.publicKey,
          blindingPrivateKey: blindingKeyPair.privateKey
        })
      }

      this._addressesCache[path] = addressObject
      addresses.push(addressObject)

      await asyncSetImmediate()
    }

    return addresses
  }

  async getWalletAddress (address) {
    let index = 0
    let change = false

    // A maximum number of addresses to lookup after which it is deemed
    // that the wallet does not contain this address
    const maxAddresses = 1000
    const addressesPerCall = 50

    let getAddrs = () => this.getAddresses(index, addressesPerCall, change)

    if (isConfidentialAddress(address)) {
      getAddrs = () => this.getConfidentialAddresses(index, addressesPerCall, change)
    }

    while (index < maxAddresses) {
      const addrs = await getAddrs()
      const addr = addrs.find(addr => addr.equals(address))
      if (addr) return addr

      index += addressesPerCall
      if (index === maxAddresses && change === false) {
        index = 0
        change = true
      }
    }

    throw new Error('Wallet does not contain address')
  }

  getAddressFromPublicKey (publicKey) {
    return this.getPaymentVariantFromPublicKey(publicKey).address
  }

  getConfidentialAddressFromPublicKeyAndBlinding (publicKey, blindingPublicKey) {
    return this.getPaymentVariantFromPublicKey(publicKey, blindingPublicKey).confidentialAddress
  }

  getPaymentVariantFromPublicKey (publicKey, blindingPublicKey) {
    switch (this._addressType) {
      case 'legacy':
        return liquid.payments.p2pkh({ pubkey: publicKey, network: this._network })
      case 'p2sh-segwit':
        return liquid.payments.p2sh({
          redeem: liquid.payments.p2wpkh({ pubkey: publicKey, network: this._network }),
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

function isConfidentialAddress (value) {
  try {
    liquid.address.fromConfidential(value)
    return true
  } catch (ignore) {
    return false
  }
}
