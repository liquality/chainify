import { sha256, ripemd160 } from 'bcrypto'
import base58 from 'bs58'
import bech32 from 'bech32'

const crypto = {
  /**
   * Base58 object with decode, decodeUnsafe, and encode functions.
   */
  base58,

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
  sha256,

  /**
   * Get ripemd160 of message.
   * @param {!string} message - any string.
   * @return {string} Returns the ripemd160 of a string.
   */
  ripemd160,

  /**
   * Ensure message is in buffer format.
   * @param {string} message - any string.
   * @return {string} Returns Buffer of string.
   */
  ensureBuffer (message) {
    if (typeof message === 'string') {
      message = Buffer.from(message, 'hex')
    }
    return message
  }
}

export default crypto
