import Provider from '../../Provider'
import { addressToPubKeyHash, compressPubKey, pubKeyToAddress, reverseBuffer } from './BitcoinUtil'
import { sha256, padHexStart } from '../../crypto'
import networks from '../../networks'

export default class BitcoinSwapProvider extends Provider {
  // TODO: have a generate InitSwap and generate RecipSwap
  //   InitSwap should use checkSequenceVerify instead of checkLockTimeVerify

  constructor (chain = { network: networks.bitcoin }) {
    super()
    this._network = chain.network
  }

  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
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
    const script = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    return this.getMethod('sendTransaction')(p2shAddress, value, script)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    const secretHash = sha256(secret)
    const script = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(p2shAddress)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('splitTransaction')(initiationTxRaw, true)
    const voutIndex = initiationTx.outputs.findIndex((output) => output.script.toString('hex') === sendScript)

    const txHashLE = Buffer.from(initiationTxHash, 'hex').reverse().toString('hex') // TX HASH IN LITTLE ENDIAN
    const newTxInput = this.generateSigTxInput(txHashLE, voutIndex, script)
    const newTx = this.generateRawTx(initiationTx, voutIndex, recipientAddress, newTxInput)
    const splitNewTx = await this.getMethod('splitTransaction')(newTx, true)
    const outputScriptObj = await this.getMethod('serializeTransactionOutputs')(splitNewTx)
    const outputScript = outputScriptObj.toString('hex')

    const signature = await this.getMethod('signP2SHTransaction')(
      [[initiationTx, 0, script]],
      [`44'/1'/0'/0/0`],
      outputScript
    )

    const pubKeyInfo = await this.getMethod('getPubKey')(recipientAddress)
    const pubKey = compressPubKey(pubKeyInfo.publicKey)
    const spendSwap = this._spendSwap(signature[0], pubKey, true, secret)
    const spendSwapInput = this._spendSwapInput(spendSwap, script)
    const rawClaimTxInput = this.generateRawTxInput(txHashLE, spendSwapInput)
    const rawClaimTx = this.generateRawTx(initiationTx, voutIndex, recipientAddress, rawClaimTxInput)

    return this.getMethod('sendRawTransaction')(rawClaimTx)
  }

  _spendSwap (signature, pubKey, isRedeem, secret) {
    const redeemEncoded = isRedeem ? '51' : '00' // OP_1 : OP_0
    const encodedSecret = isRedeem
      ? [
        padHexStart((secret.length / 2).toString(16)), // OP_PUSHDATA({secretLength})
        secret
      ]
      : ['00'] // OP_0

    const signatureEncoded = signature + '01'
    const signaturePushDataOpcode = padHexStart((signatureEncoded.length / 2).toString(16))
    const pubKeyPushDataOpcode = padHexStart((pubKey.length / 2).toString(16))

    const bytecode = [
      signaturePushDataOpcode,
      signatureEncoded,
      ...encodedSecret,
      redeemEncoded,
      pubKeyPushDataOpcode,
      pubKey
    ]

    return bytecode.join('')
  }

  _spendSwapInput (spendSwapBytecode, voutScript) {
    const bytecode = [
      spendSwapBytecode,
      '4c',
      padHexStart((voutScript.length / 2).toString(16)),
      voutScript
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
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(data)
    const receivingAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(receivingAddress)

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

  async getSwapConfirmTransaction (blockNumber, initiationTxHash, secretHash) {
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    const transactions = block.transactions
    const txs = await Promise.all(transactions.map(async transaction => {
      return this.getMethod('decodeRawTransaction')(transaction)
    }))
    const swapTx = txs
      .reduce((acc, val) => acc.concat({ hash: val.hash, vin: val._raw.data.vin }), [])
      .map(val => val.vin.map(vin => { return { hash: val.hash, vin: vin } }))
      .flat()
      .find(tx => tx.vin.txid === initiationTxHash)
    return swapTx ? swapTx.hash : null
  }

  async getSecret (claimTxHash) {
    const claimTxRaw = await this.getMethod('getRawTransactionByHash')(claimTxHash)
    const claimTx = await this.getMethod('decodeRawTransaction')(claimTxRaw)
    const script = Buffer.from(claimTx._raw.data.vin[0].scriptSig.hex, 'hex')
    const sigLength = script[0]
    const secretLength = script.slice(sigLength + 1)[0]
    return script.slice(sigLength + 2, sigLength + secretLength + 2).toString('hex')
  }

  generateSigTxInput (txHashLE, voutIndex, script) {
    const inputTxOutput = padHexStart(voutIndex.toString(16), 8)
    const scriptLength = padHexStart((script.length / 2).toString(16))

    return [
      '01', // NUM INPUTS
      txHashLE,
      inputTxOutput, // INPUT TRANSACTION OUTPUT
      scriptLength,
      script,
      'ffffffff' // SEQUENCE
    ].join('')
  }

  generateRawTxInput (txHashLE, script) {
    const scriptLength = padHexStart((script.length / 2).toString(16))

    return [
      '01', // NUM INPUTS
      txHashLE,
      '00000000',
      scriptLength,
      script,
      'ffffffff' // SEQUENCE
    ].join('')
  }

  generateRawTx (initiationTx, voutIndex, address, input) {
    const output = initiationTx.outputs[voutIndex]
    const value = parseInt(reverseBuffer(output.amount).toString('hex'), 16)
    const fee = this.getMethod('calculateFee')(1, 1, 3)
    const amount = value - fee
    const amountLE = Buffer.from(padHexStart(amount.toString(16), 16), 'hex').reverse().toString('hex') // amount in little endian
    const pubKeyHash = addressToPubKeyHash(address)

    return [
      '01000000', // VERSION

      input,

      '01', // NUM OUTPUTS
      amountLE,
      '19', // data size to be pushed
      '76', // OP_DUP
      'a9', // OP_HASH160
      '14', // data size to be pushed
      pubKeyHash, // <PUB_KEY_HASH>
      '88', // OP_EQUALVERIFY
      'ac', // OP_CHECKSIG

      '00000000' // OUTPUTS
    ].join('')
  }
}
