import Provider from '../../Provider'
import crypto from './BitcoinCrypto'
const { addressToPubKeyHash } = crypto

export default class BitcoinSwapProvider extends Provider {
  generateSwap (recipientAddress, refundAddress, secretHash, expiration) {
    let expirationHex = expiration.toString(16)
    if (expirationHex.length % 2 === 1) {
      expirationHex = '0' + expirationHex
    }
    expirationHex = expirationHex.match(/.{2}/g).reverse()
    expirationHex.length = Math.min(expirationHex.length, 5)
    expirationHex[expirationHex.length - 1] = '00'

    const recipientPubKeyHash = addressToPubKeyHash(recipientAddress)
    const refundPubKeyHash = addressToPubKeyHash(refundAddress)
    const expirationPushDataOpcode = expirationHex.length.toString(16).padStart(2, '0')
    const expirationHexEncoded = expirationHex.join('')

    return [
      '76', 'a9', // OP_DUP OP_HASH160
      '72', // OP_2SWAP
      '63', // OP_IF
      'a8', // OP_SHA256
      '20', secretHash, // OP_PUSHDATA20 {secretHash}
      '88', // OP_EQUALVERIFY
      '14', recipientPubKeyHash, // OP_PUSHDATA20 {recipientPubKeyHash}
      '67', // OP_ELSE
      expirationPushDataOpcode, // OP_PUSHDATA{expirationHexLength}
      expirationHexEncoded, // {expirationHexEncoded}
      'b1', // OP_CHECKLOCKTIMEVERIFY
      '6d', // OP_2DROP
      '14', refundPubKeyHash, // OP_PUSHDATA20 {refundPubKeyHash}
      '68', // OP_ENDIF
      '88', 'ac' // OP_EQUALVERIFY OP_CHECKSIG
    ].join('')
  }
}
