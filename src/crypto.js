import sha256 from 'crypto-js/sha256'
import ripemd160 from 'crypto-js/ripemd160'
import basex from 'base-x'
import bech32 from 'bech32'

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'

const crypto = {
  /**
   * Get base58 of message.
   * @param {!string} message - any string.
   * @return {string} Returns the base58 of a string.
   */
  base58: basex(BASE58),

  /**
   * Get bech32 of message.
   * @param {!string} message - any string.
   * @return {string} Returns the bech32 of a string.
   */
  bech32,

  /**
   * Get hash160 of message.
   * @param {!string} message - any string.
   * @return {string} Returns the hash160 of a string.
   */
  hash160 (message) {
    const sha256Hashed = this.sha256(message)
    const ripemd160Hashed = this.ripemd160(sha256Hashed)
    return ripemd160Hashed
  },

  /**
   * Get sha256 of message.
   * @param {!string} message - any string.
   * @return {string} Returns the sha256 of a string.
   */
  sha256 (message) {
    return sha256(message).toString()
  },

  /**
   * Get ripemd160 of message.
   * @param {!string} message - any string.
   * @return {string} Returns the ripemd160 of a string.
   */
  ripemd160 (message) {
    return ripemd160(message).toString()
  }
}

export default crypto
