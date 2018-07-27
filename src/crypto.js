import sha256 from 'crypto-js/sha256'
import ripemd160 from 'crypto-js/ripemd160'
import basex from 'base-x'
import bech32 from 'bech32'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

const crypto = {
  base58: basex(BASE58),
  bech32: bech32,

  hash160 (message) {
    const sha256Hashed = this.sha256(message)
    const ripemd160Hashed = this.ripemd160(sha256Hashed)
    return ripemd160Hashed
  },

  sha256 (message) {
    return sha256(message).toString()
  },

  ripemd160 (message) {
    return ripemd160(message).toString()
  }
}

export default crypto
