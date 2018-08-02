import crypto from '../../crypto'

const networks = {
  mainnet: '00',
  testnet: '6F',
  litecoin: '30'
}

const BitcoinCrypto = {
  compressPubKey (pubKey) {
    let x = pubKey.substring(2, 66)
    let y = pubKey.substring(66, 130)
    let prefix
    let even = parseInt(y.substring(62, 64), 16) % 2 === 0
    even ? prefix = '02' : prefix = '03'
    return prefix + x
  },

  pubKeyToAddress (pubKey, network) {
    pubKey = crypto.ensureBuffer(pubKey)
    const pubKeyHash = crypto.hash160(pubKey)
    const addr = this.pubKeyHashToAddress(pubKeyHash, network)
    return addr
  },

  pubKeyHashToAddress (pubKeyHash, network) {
    pubKeyHash = crypto.ensureBuffer(pubKeyHash)
    const prefixHash = Buffer.concat([Buffer.from(networks[network], 'hex'), pubKeyHash])
    const checksum = crypto.sha256(crypto.sha256(prefixHash)).slice(0, 4)
    const addr = crypto.base58.encode(Buffer.concat([prefixHash, checksum]))
    return addr
  },

  addressToPubKeyHash (address) {
    return crypto.base58.decode(address).toString('hex').substring(2, 42)
  }
}

export default BitcoinCrypto
