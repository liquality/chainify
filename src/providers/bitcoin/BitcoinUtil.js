import {
  ensureBuffer,
  hash160,
  sha256,
  base58
} from '../../crypto'
import networks from '../../networks'

/**
 * Get compressed pubKey from pubKey.
 * @param {!string} pubkey - 65 byte string with prefix, x, y.
 * @return {string} Returns the compressed pubKey of uncompressed pubKey.
 */
export function compressPubKey (pubKey) {
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
export function pubKeyToAddress (pubKey, network, type) {
  pubKey = ensureBuffer(pubKey)
  const pubKeyHash = hash160(pubKey)
  const addr = this.pubKeyHashToAddress(pubKeyHash, network, type)
  return addr
}

/**
 * Get address from pubKeyHash.
 * @param {!string} pubKeyHash - hash160 of pubKey.
 * @param {!string} network - bitcoin, testnet, or litecoin.
 * @param {!string} type - pubKeyHash or scriptHash.
 * @return {string} Returns the address derived from pubKeyHash.
 */
export function pubKeyHashToAddress (pubKeyHash, network, type) {
  pubKeyHash = ensureBuffer(pubKeyHash)
  const prefixHash = Buffer.concat([Buffer.from(networks[network][type], 'hex'), pubKeyHash])
  const checksum = Buffer.from(sha256(sha256(prefixHash)).slice(0, 4), 'hex')
  const addr = base58.encode(Buffer.concat([prefixHash, checksum]))
  return addr
}

/**
 * Get pubKeyHash from address.
 * @param {!string} address - bitcoin base58 encoded address.
 * @return {string} Returns the pubKeyHash of bitcoin address.
 */
export function addressToPubKeyHash (address) {
  return base58.decode(address).toString('hex').substring(2, 42)
}
