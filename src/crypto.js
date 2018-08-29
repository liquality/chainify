import cryptoHash from 'crypto-hashing'
import base58 from 'bs58'
import bech32 from 'bech32'

/**
 * Ensure message is in buffer format.
 * @param {string} message - any string.
 * @return {string} Returns Buffer of string.
 */
function ensureBuffer (message) {
  if (typeof message === 'string') {
    message = Buffer.from(message, 'hex')
  }

  return message
}

/**
 * Get hash of a message in hex.
 * @param {!string} algorithm - Hashing algorithm.
 * @param {!string|Buffer} message - Message to be hashed.
 * @return {string} Returns the hash of a string.
 */
function hashToHex (algorithm, message) {
  return cryptoHash(algorithm, ensureBuffer(message)).toString('hex')
}

/**
 * Get hash160 of message.
 * @param {!string|Buffer} message - message in string or Buffer.
 * @return {string} Returns the hash160 of a string.
 */
function hash160 (message) {
  return hashToHex('hash160', message)
}

/**
 * Get sha256 of message.
 * @param {!string|Buffer} message - message in string or Buffer.
 * @return {string} Returns the sha256 of a string.
 */
function sha256 (message) {
  return hashToHex('sha256', message)
}

/**
 * Get ripemd160 of message.
 * @param {!string|Buffer} message - message in string or Buffer.
 * @return {string} Returns the ripemd160 of a string.
 */
function ripemd160 (message) {
  return hashToHex('ripemd160', message)
}

/**
 * Pad a hex string with '0'
 * @param {string} hex - The hex string to pad.
 * @param {number} [length] - The length of the final string.
 * @return Returns a padded string with length greater or equal to the given length
 *  rounded up to the nearest even number.
 */
function padHexStart (hex, length) {
  let len = length || hex.length
  len += len % 2

  return hex.padStart(len, '0')
}

export {
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

  sha256,
  ripemd160,
  hash160,
  ensureBuffer,
  padHexStart
}
