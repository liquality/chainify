import { version } from '../package.json'

import { Address, asyncSetImmediate, sleep } from '@liquality/utils'

class ConfidentialAddress extends Address {
  constructor (address, derivationPath, publicKey, index, blindingKey) {
    super(address, derivationPath, publicKey, index)

    // we assume the given address is a string
    this._blindingKey = blindingKey

    // We override it in case is already in the form of ConfidentialAddress
    if (address instanceof ConfidentialAddress || typeof address !== 'string') {
      this._blindingKey = address.blindingKey
    }
  }

  get blindingKey () {
    return this._blindingKey
  }

  toObject () {
    const obj = super.toObject()

    if (this._blindingKey) {
      obj.blindingKey = this._blindingKey
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
