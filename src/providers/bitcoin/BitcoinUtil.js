import {
  ensureBuffer,
  hash160,
  sha256,
  base58
} from '../../crypto'

import networks from './networks'

/**
 * Get compressed pubKey from pubKey.
 * @param {!string} pubKey - 65 byte string with prefix, x, y.
 * @return {string} Returns the compressed pubKey of uncompressed pubKey.
 */
function compressPubKey (pubKey) {
  const x = pubKey.substring(2, 66)
  const y = pubKey.substring(66, 130)
  let prefix
  const even = parseInt(y.substring(62, 64), 16) % 2 === 0
  even ? prefix = '02' : prefix = '03'
  return prefix + x
}

/**
 * Get address from pubKey.
 * @param {!string|Buffer} pubKey - 65 byte uncompressed pubKey or 33 byte compressed pubKey.
 * @param {!string} network - bitcoin, testnet, or litecoin.
 * @param {!string} type - pubKeyHash or scriptHash.
 * @return {string} Returns the address of pubKey.
 */
function pubKeyToAddress (pubKey, network, type) {
  pubKey = ensureBuffer(pubKey)
  const pubKeyHash = hash160(pubKey)
  const addr = pubKeyHashToAddress(pubKeyHash, network, type)
  return addr
}

/**
 * Get address from pubKeyHash.
 * @param {!string} pubKeyHash - hash160 of pubKey.
 * @param {!string} network - bitcoin, testnet, or litecoin.
 * @param {!string} type - pubKeyHash or scriptHash.
 * @return {string} Returns the address derived from pubKeyHash.
 */
function pubKeyHashToAddress (pubKeyHash, network, type) {
  pubKeyHash = ensureBuffer(pubKeyHash)
  const prefixHash = Buffer.concat([Buffer.from(networks[network][type], 'hex'), pubKeyHash])
  const checksum = Buffer.from(sha256(sha256(prefixHash)).slice(0, 8), 'hex')
  const addr = base58.encode(Buffer.concat([prefixHash, checksum]).slice(0, 25))
  return addr
}

/**
 * Get pubKeyHash from address.
 * @param {!string} address - bitcoin base58 encoded address.
 * @return {string} Returns the pubKeyHash of bitcoin address.
 */
function addressToPubKeyHash (address) {
  return base58.decode(address).toString('hex').substring(2, 42)
}

function reverseBuffer (src) {
  let buffer = Buffer.alloc(src.length)

  for (let i = 0, j = src.length - 1; i <= j; ++i, --j) {
    buffer[i] = src[j]
    buffer[j] = src[i]
  }

  return buffer
}

function scriptNumSize (i) {
  return i > 0x7fffffff ? 5
    : i > 0x7fffff ? 4
      : i > 0x7fff ? 3
        : i > 0x7f ? 2
          : i > 0x00 ? 1
            : 0
}

function scriptNumEncode (number) {
  var value = Math.abs(number)
  var size = scriptNumSize(value)
  var buffer = Buffer.allocUnsafe(size)
  var negative = number < 0

  for (var i = 0; i < size; ++i) {
    buffer.writeUInt8(value & 0xff, i)
    value >>= 8
  }

  if (buffer[size - 1] & 0x80) {
    buffer.writeUInt8(negative ? 0x80 : 0x00, size - 1)
  } else if (negative) {
    buffer[size - 1] |= 0x80
  }

  return buffer
}

function toHexDigit (number) {
  var digits = '0123456789abcdef'
  return digits.charAt(number >> 4) + digits.charAt(number & 0x0f)
}

function toHexInt (number) {
  return (
    toHexDigit((number >> 24) & 0xff) +
    toHexDigit((number >> 16) & 0xff) +
    toHexDigit((number >> 8) & 0xff) +
    toHexDigit(number & 0xff)
  )
}

export {
  toHexInt,
  compressPubKey,
  pubKeyToAddress,
  pubKeyHashToAddress,
  addressToPubKeyHash,
  reverseBuffer,
  scriptNumEncode
}
