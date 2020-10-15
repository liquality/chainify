import { version } from '../package.json'

import { Address, asyncSetImmediate, sleep } from '@liquality/utils'

class ConfidentialAddress extends Address {
  constructor (address, derivationPath, publicKey, index, blindingPublicKey, blindingPrivateKey) {
    super(address, derivationPath, publicKey, index)

    // we assume the given address is a string
    this._blindingPublicKey = blindingPublicKey
    this._blindingPrivateKey = blindingPrivateKey

    // We override it in case is already in the form of ConfidentialAddress
    if (address instanceof ConfidentialAddress || typeof address !== 'string') {
      this._blindingPublicKey = address.blindingPublicKey
      this._blindingPrivateKey = address.blindingPrivateKey
    }
  }

  get blindingPublicKey () {
    return this._blindingPublicKey
  }

  get blindingPrivateKey () {
    return this._blindingPrivateKey
  }

  toObject () {
    const obj = super.toObject()

    if (this._blindingPublicKey) {
      obj.blindingPublicKey = this._blindingPublicKey
    }

    if (this._blindingPrivateKey) {
      obj.blindingPrivateKey = this._blindingPrivateKey
    }

    return obj
  }
}

function addressToString (any) {
  if (typeof any === 'string') return any

  return String(new ConfidentialAddress(any))
}

export {
  ConfidentialAddress,
  Address as UnconfidentialAddress,
  addressToString,
  sleep,
  asyncSetImmediate,
  version
}
