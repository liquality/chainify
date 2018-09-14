import Provider from '../../Provider'
import { addressToPubKeyHash, pubKeyToAddress } from './BitcoinUtil'
import { padHexStart } from '../../crypto'
import networks from '../../networks'

export default class BitcoinSwapProvider extends Provider {
  // TODO: have a generate InitSwap and generate RecipSwap
  //   InitSwap should use checkSequenceVerify instead of checkLockTimeVerify

  constructor (chain = { network: networks.bitcoin }) {
    super()
    this._network = chain.network
  }

  generateSwap (recipientAddress, refundAddress, secretHash, expiration) {
    let expirationHex = Buffer.from(padHexStart(expiration.toString(16)), 'hex').reverse()

    expirationHex = expirationHex.slice(0, Math.min(expirationHex.length, 5))
    expirationHex.writeUInt8(0, expirationHex.length - 1)

    const recipientPubKeyHash = addressToPubKeyHash(recipientAddress)
    const refundPubKeyHash = addressToPubKeyHash(refundAddress)
    const expirationPushDataOpcode = padHexStart(expirationHex.length.toString(16))
    const expirationHexEncoded = expirationHex.toString('hex')

    return [
      '76', 'a9', // OP_DUP OP_HASH160
      '72', // OP_2SWAP
      '63', // OP_IF
      'a8', // OP_SHA256
      '20', secretHash, // OP_PUSHDATA(20) {secretHash}
      '88', // OP_EQUALVERIFY
      '14', recipientPubKeyHash, // OP_PUSHDATA(20) {recipientPubKeyHash}
      '67', // OP_ELSE
      expirationPushDataOpcode, // OP_PUSHDATA({expirationHexLength})
      expirationHexEncoded, // {expirationHexEncoded}
      'b1', // OP_CHECKLOCKTIMEVERIFY
      '6d', // OP_2DROP
      '14', refundPubKeyHash, // OP_PUSHDATA(20) {refundPubKeyHash}
      '68', // OP_ENDIF
      '88', 'ac' // OP_EQUALVERIFY OP_CHECKSIG
    ].join('')
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    const script = this.generateSwap(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    return this.getMethod('sendTransaction')(p2shAddress, value, script)
  }

  async claimSwap (initiationTxHash, value, recipientAddress, refundAddress, secret, expiration) {
    throw new Error('Not implemented yet')
  }

  _spendSwap (signature, pubKey, isRedeem, secret) {
    const redeemEncoded = isRedeem ? '51' : '00' // OP_1 : OP_0
    const encodedSecret = isRedeem
      ? [
        padHexStart((secret.length / 2).toString(16)), // OP_PUSHDATA({secretLength})
        secret
      ]
      : ['00'] // OP_0

    const signaturePushDataOpcode = padHexStart((signature.length / 2).toString(16))
    const pubKeyPushDataOpcode = padHexStart((pubKey.length / 2).toString(16))

    const bytecode = [
      signaturePushDataOpcode,
      signature,
      ...encodedSecret,
      redeemEncoded,
      pubKeyPushDataOpcode,
      pubKey
    ]

    return bytecode.join('')
  }

  getRedeemSwapData (secret, pubKey, signature) {
    return this._spendSwap(signature, pubKey, true, secret)
  }

  getRefundSwapData (pubKey, signature) {
    return this._spendSwap(signature, pubKey, false)
  }

  async getSwapTransaction (blockNumber, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.generateSwap(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(data)
    const receivingAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('generateScript')(receivingAddress)

    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    const transactions = block.transactions
    const txs = await Promise.all(transactions.map(async transaction => {
      return this.getMethod('decodeRawTransaction')(transaction)
    }))
    const swapTx = txs
      .map(transaction => transaction._raw.data)
      .map(transaction => transaction.vout
        .map(vout => { return { txid: transaction.txid, scriptPubKey: vout.scriptPubKey } }))
      .reduce((acc, val) => acc.concat(val), [])
      .find(txKeys => txKeys.scriptPubKey.hex === sendScript)
    return swapTx ? swapTx.txid : null
  }
}
