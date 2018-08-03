import crypto from '../../crypto'

const networks = {
  mainnet: '00',
  testnet: '6F',
  litecoin: '30'
}

const BitcoinCrypto = {
  /**
   * Get compressed pubKey from pubKey.
   * @param {!string} pubkey - 65 byte string with prefix, x, y.
   * @return {string} Returns the compressed pubKey of uncompressed pubKey.
   */
  compressPubKey (pubKey) {
    let x = pubKey.substring(2, 66)
    let y = pubKey.substring(66, 130)
    let prefix
    let even = parseInt(y.substring(62, 64), 16) % 2 === 0
    even ? prefix = '02' : prefix = '03'
    return prefix + x
  },

  /**
   * Get address from pubKey.
   * @param {!string} pubkey - 65 byte uncompressed pubKey or 33 byte compressed pubKey.
   * @return {string} Returns the address of pubKey.
   */
  pubKeyToAddress (pubKey, network) {
    pubKey = crypto.ensureBuffer(pubKey)
    const pubKeyHash = crypto.hash160(pubKey)
    const addr = this.pubKeyHashToAddress(pubKeyHash, network)
    return addr
  },

  /**
   * Get address from pubKeyHash.
   * @param {!string} pubKeyHash - hash160 of pubKey.
   * @return {string} Returns the address derived from pubKeyHash.
   */
  pubKeyHashToAddress (pubKeyHash, network) {
    pubKeyHash = crypto.ensureBuffer(pubKeyHash)
    const prefixHash = Buffer.concat([Buffer.from(networks[network], 'hex'), pubKeyHash])
    const checksum = crypto.sha256(crypto.sha256(prefixHash)).slice(0, 4)
    const addr = crypto.base58.encode(Buffer.concat([prefixHash, checksum]))
    return addr
  },

  /**
   * Get pubKeyHash from address.
   * @param {!string} address - bitcoin base58 encoded address.
   * @return {string} Returns the pubKeyHash of bitcoin address.
   */
  addressToPubKeyHash (address) {
    return crypto.base58.decode(address).toString('hex').substring(2, 42)
  }
}

export default BitcoinCrypto
