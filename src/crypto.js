import { sha256, ripemd160 } from 'bcrypto'
import base58 from 'bs58'
import bech32 from 'bech32'

const networks = {
  mainnet: '00',
  testnet: '6F',
  litecoin: '30'
}

const crypto = {
  /**
   * Get base58 of message.
   * @param {!string} message - any string.
   * @return {string} Returns the base58 of a string.
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

  compressPubKey (pubKey) {
    let x = pubKey.substring(2, 66)
    let y = pubKey.substring(66, 130)
    let prefix
    let even = parseInt(y.substring(62, 64), 16) % 2 === 0
    even ? prefix = '02' : prefix = '03'
    return prefix + x
  },

  pubKeyToHash160 (pubKey) {
    if (typeof pubKey === 'string') {
      pubKey = Buffer.from(pubKey, 'hex')
    }
    return this.hash160(pubKey)
  },

  pubKeyToAddress (pubKey, network) {
    let h160 = this.pubKeyToHash160(pubKey)
    let prefixHash = Buffer.concat([Buffer.from(networks[network], 'hex'), h160])
    let checksum = this.sha256(this.sha256(prefixHash)).slice(0, 4)
    let addr = this.base58.encode(Buffer.concat([prefixHash, checksum]))
    return addr
  },

  addressToHash160 (address) {
    return this.base58.decode(address).toString('hex').substring(2, 42)
  }
}

export default crypto
