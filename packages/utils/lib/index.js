import { version } from '../package.json'

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class Address {
  constructor (address, derivationPath, publicKey) {
    if (address instanceof Address || typeof address !== 'string') {
      this._address = address.address
      this._derivationPath = address.derivationPath
      this._publicKey = address.publicKey
    } else {
      this._address = address
      this._derivationPath = derivationPath
      this._publicKey = publicKey
    }
  }

  get address () {
    return this._address
  }

  get derivationPath () {
    return this._derivationPath
  }

  get publicKey () {
    return this._publicKey
  }

  toLocaleString () {
    return this._address
  }

  toString () {
    return this._address
  }

  valueOf () {
    return this._address
  }

  equals (addr) {
    return this._address === addressToString(addr)
  }

  toObject () {
    const obj = {
      address: this._address
    }

    if (this._derivationPath) {
      obj.derivationPath = this._derivationPath
    }

    if (this._publicKey) {
      obj.publicKey = this._publicKey
    }

    return obj
  }

  toJSON () {
    return this.toObject()
  }
}

function addressToString (any) {
  if (typeof any === 'string') return any

  return String(new Address(any))
}

function asyncSetImmediate () {
  return new Promise(resolve => setImmediate(resolve))
}

function caseInsensitiveEqual (left, right) {
  left = left && left.toLowerCase()
  right = right && right.toLowerCase()

  return left === right
}

export {
  Address,
  addressToString,
  sleep,
  asyncSetImmediate,
  caseInsensitiveEqual,

  version
}
