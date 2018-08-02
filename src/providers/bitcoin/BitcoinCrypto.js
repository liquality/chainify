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

  pubKeyToHash160 (pubKey) {
    if (typeof pubKey === 'string') {
      pubKey = Buffer.from(pubKey, 'hex')
    }
    return crypto.hash160(pubKey)
  },

  pubKeyToAddress (pubKey, network) {
    let h160 = this.pubKeyToHash160(pubKey)
    let prefixHash = Buffer.concat([Buffer.from(networks[network], 'hex'), h160])
    let checksum = crypto.sha256(crypto.sha256(prefixHash)).slice(0, 4)
    let addr = crypto.base58.encode(Buffer.concat([prefixHash, checksum]))
    return addr
  },

  addressToHash160 (address) {
    return crypto.base58.decode(address).toString('hex').substring(2, 42)
  }
}

export default BitcoinCrypto
