import { version } from '../package.json'

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class ConfidentialAddress {
  constructor(address, derivationPath, publicKey, index, blindingKey) {
    if (address instanceof ConfidentialAddress || typeof address !== 'string') {
      this._address = address.address
      this._derivationPath = address.derivationPath
      this._publicKey = address.publicKey
      this._index = address.index
      this._blindingKey = address.blindingKey
    } else {
      this._address = address
      this._derivationPath = derivationPath
      this._publicKey = publicKey
      this._index = index
      this._blindingKey = blindingKey

    }
  }

  get address() {
    return this._address
  }

  get derivationPath() {
    return this._derivationPath
  }

  get publicKey() {
    return this._publicKey
  }

  get index() {
    return this._index
  }

  get blindingKey() {
    return this._blindingKey
  }

  toLocaleString() {
    return this._address
  }

  toString() {
    return this._address
  }

  valueOf() {
    return this._address
  }

  equals(addr) {
    return this._address === addressToString(addr)
  }

  toObject() {
    const obj = {
      address: this._address
    }

    if (this._derivationPath) {
      obj.derivationPath = this._derivationPath
    }

    if (this._publicKey) {
      obj.publicKey = this._publicKey
    }

    if (this._index !== undefined && this._index !== null) {
      obj.index = this._index
    }

    if (this._blindingKey) {
      obj.blindingKey = _blindingKey
    }

    return obj
  }

  toJSON() {
    return this.toObject()
  }
}

function addressToString(any) {
  if (typeof any === 'string') return any

  return String(new ConfidentialAddress(any))
}

function asyncSetImmediate() {
  return new Promise(resolve => setImmediate(resolve))
}

export {
  ConfidentialAddress,
  addressToString,
  sleep,
  asyncSetImmediate,

  version
}
