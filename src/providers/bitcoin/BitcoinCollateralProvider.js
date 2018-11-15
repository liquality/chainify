import Provider from '../../Provider'
import { addressToPubKeyHash, compressPubKey, pubKeyToAddress, reverseBuffer, scriptNumEncode } from './BitcoinUtil'
import { hash160, sha256, padHexStart } from '../../crypto'
import networks from '../../networks'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class BitcoinCollateralProvider extends Provider {
  constructor (chain = { network: networks.bitcoin }) {
    super()
    this._network = chain.network
  }

  createRefundableCollateralScript (borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration) {
    let loanExpirationHex = scriptNumEncode(loanExpirationHex)
    let biddingExpirationHex = scriptNumEncode(biddingExpirationHex)

    const compressedBorrowerPubKey = compressPubKey(borrowerPubKey)
    const borrowerPubKeyHash = hash160(compressedBorrowerPubKey)

    const compressedLenderPubKey = compressPubKey(lenderPubKey)
    const lenderPubKeyHash = hash160(compressedLenderPubKey)

    const loanExpirationPushDataOpcode = padHexStart(loanExpirationHex.length.toString(16))
    const loanExpirationHexEncoded = loanExpirationHex.toString('hex')
    const biddingExpirationPushDataOpcode = padHexStart(biddingExpirationHex.length.toString(16))
    const biddingExpirationHexEncoded = biddingExpirationHex.toString('hex')

    return [
      '63', // OP_IF
        'a8', // OP_SHA256
        '20', lenderSecretHash, // OP_PUSHDATA(32) {lenderSecretHash}
        '88', // OP_EQUALVERIFY
        '76', 'a9', // OP_DUP OP_HASH160
        '14', borrowerPubKeyHash, // OP_PUSHDATA(20) {alicePubKeyHash}
        '88', 'ac', // OP_EQUALVERIFY OP_CHECKSIG
      '67', // OP_ELSE
        '63', // OP_IF
          loanExpirationPushDataOpcode, // OP_PUSHDATA({loanExpirationHexLength})
          loanExpirationHexEncoded, // {loanExpirationHexEncoded}
          'b1', // OP_CHECKLOCKTIMEVERIFY
          '52', // PUSH #2
          '41', borrowerPubKey, // OP_PUSHDATA(65) {alicePubKey}
          '41', lenderPubKey, // OP_PUSHDATA(65) {bobPubKey}
          '52', // PUSH #2
          'ae', // CHECKMULTISIG
        '67', // OP_ELSE
          biddingExpirationPushDataOpcode, // OP_PUSHDATA({biddingExpirationHexLength})
          biddingExpirationHexEncoded, // {biddingExpirationHexEncoded}
          'b1', // OP_CHECKLOCKTIMEVERIFY
          '76', 'a9', // OP_DUP OP_HASH160
          '14', borrowerPubKeyHash, // OP_PUSHDATA(20) {alicePubKeyHash}
          '88', 'ac', // OP_EQUALVERIFY OP_CHECKSIG
        '68', // OP_ENDIF
      '68', // OP_ENDIF
    ].join('')
  }

  createSeizableCollateralScript (borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration) {
    let loanExpirationHex = scriptNumEncode(loanExpirationHex)
    let biddingExpirationHex = scriptNumEncode(biddingExpirationHex)
    let seizureExpirationHex = scriptNumEncode(seizureExpirationHex)

    const compressedBorrowerPubKey = compressPubKey(borrowerPubKey)
    const borrowerPubKeyHash = hash160(compressedBorrowerPubKey)

    const compressedLenderPubKey = compressPubKey(lenderPubKey)
    const lenderPubKeyHash = hash160(compressedLenderPubKey)

    const loanExpirationPushDataOpcode = padHexStart(loanExpirationHex.length.toString(16))
    const loanExpirationHexEncoded = loanExpirationHex.toString('hex')
    const biddingExpirationPushDataOpcode = padHexStart(biddingExpirationHex.length.toString(16))
    const biddingExpirationHexEncoded = biddingExpirationHex.toString('hex')
    const seizureExpirationPushDataOpcode = padHexStart(seizureExpirationHex.length.toString(16))
    const seizureExpirationHexEncoded = seizureExpirationHex.toString('hex')

    return [
      '63', // OP_IF
        'a8', // OP_SHA256
        '20', lenderSecretHash, // OP_PUSHDATA(32) {lenderSecretHash}
        '88', // OP_EQUALVERIFY
        '76', 'a9', // OP_DUP OP_HASH160
        '14', borrowerPubKeyHash, // OP_PUSHDATA(20) {alicePubKeyHash}
        '88', 'ac', // OP_EQUALVERIFY OP_CHECKSIG
      '67', // OP_ELSE
        '63', // OP_IF
          loanExpirationPushDataOpcode, // OP_PUSHDATA({loanExpirationHexLength})
          loanExpirationHexEncoded, // {loanExpirationHexEncoded}
          'b1', // OP_CHECKLOCKTIMEVERIFY
          '52', // PUSH #2
          '41', borrowerPubKey, // OP_PUSHDATA(65) {alicePubKey}
          '41', lenderPubKey, // OP_PUSHDATA(65) {bobPubKey}
          '52', // PUSH #2
          'ae', // CHECKMULTISIG
        '67', // OP_ELSE
          '63', // OP_IF
            biddingExpirationPushDataOpcode, // OP_PUSHDATA({expirationHexLength})
            biddingExpirationHexEncoded, // {expirationHexEncoded}
            'b1', // OP_CHECKLOCKTIMEVERIFY
            'a8', // OP_SHA256
            '20', borrowerSecretHash, // OP_PUSHDATA(32) {borrowerSecretHash}
            '88', // OP_EQUALVERIFY
            '76', 'a9', // OP_DUP OP_HASH160
            '14', lenderPubKeyHash, // OP_PUSHDATA(20) {lenderPubKeyHash}
            '88', 'ac', // OP_EQUALVERIFY OP_CHECKSIG
          '67', // OP_ELSE
            seizureExpirationPushDataOpcode, // OP_PUSHDATA({seizureExpirationHexLength})
            seizureExpirationHexEncoded, // {seizureExpirationHexEncoded}
            'b1', // OP_CHECKLOCKTIMEVERIFY
            '76', 'a9', // OP_DUP OP_HASH160
            '14', borrowerPubKeyHash, // OP_PUSHDATA(20) {alicePubKeyHash}
            '88', 'ac', // OP_EQUALVERIFY OP_CHECKSIG
          '68', // OP_ENDIF
        '68', // OP_ENDIF
      '68', // OP_ENDIF
    ].join('')
  }

  async lockCollateral (refundableValue, seizableValue, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration) {
    const refundableScript = this.createRefundableCollateralScript(borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration)
    const seizableScript = this.createSeizableCollateralScript(borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    const refundableScriptPubKey = padHexStart(refundableScript)
    const seizableScriptPubKey = padHexStart(seizableScript)

    const refundableP2shAddress = pubKeyToAddress(refundableScriptPubKey, this._network.name, 'scriptHash')
    const seizableP2shAddress = pubKeyToAddress(seizableScriptPubKey, this._network.name, 'scriptHash')

    const refundableResult = await this.getMethod('sendTransaction')(refundableP2shAddress, refundableValue, refundableScript)
    const seizableResult = await this.getMethod('sendTransaction')(seizableP2shAddress, seizableValue, seizableScript)

    return { refundableResult, seizableResult }
  }

  async refundCollateral (refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecret, loanExpiration, biddingExpiration, seizureExpiration) {
    const refundableScript = this.createRefundableCollateralScript(borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration)
    const seizableScript = this.createSeizableCollateralScript(borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    const refundableResult = await this._refundCollateral(refundableTxHash, refundableScript, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecret, loanExpiration, biddingExpiration, seizureExpiration)
    const seizableResult = await this._refundCollateral(seizableTxHash, refundableScript, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecret, loanExpiration, biddingExpiration, seizureExpiration)
  }

  async _refundCollateral (initiationTxHash, script, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecret, loanExpiration, biddingExpiration, seizureExpiration) {
    const lenderSecretHash = sha256(lenderSecret)
    const lockTime = 0
    const lockTimeHex = padHexStart('0', 8)
    const to = pubKeyToAddress(compressPubKey(borrowerPubKey))
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(p2shAddress)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('splitTransaction')(initiationTxRaw, true)
    const voutIndex = initiationTx.outputs.findIndex((output) => output.script.toString('hex') === sendScript)

    const txHashLE = Buffer.from(initiationTxHash, 'hex').reverse().toString('hex') // TX HASH IN LITTLE ENDIAN
    const newTxInput = this.generateSigTxInput(txHashLE, voutIndex, script)
    const newTx = this.generateRawTx(initiationTx, voutIndex, to, newTxInput, lockTimeHex)
    const splitNewTx = await this.getMethod('splitTransaction')(newTx, true)
    const outputScriptObj = await this.getMethod('serializeTransactionOutputs')(splitNewTx)
    const outputScript = outputScriptObj.toString('hex')

    const addressPath = await this.getMethod('getDerivationPathFromAddress')(to)

    const signature = await this.getMethod('signP2SHTransaction')(
      [[initiationTx, 0, script, 0]],
      [addressPath],
      outputScript,
      lockTime
    )

    const spendCollateral = this._spendCollateral(signature[0], borrowerPubKey, lenderSecret)
    const spendCollateralInput = this._spendCollateralInput(spendCollateral, script)
    const rawClaimTxInput = this.generateRawTxInput(txHashLE, spendCollateralInput)
    const rawClaimTx = this.generateRawTx(initiationTx, voutIndex, to, rawClaimTxInput, lockTimeHex)

    return this.getMethod('sendRawTransaction')(rawClaimTx)
  }

  _refundCollateral (signature, pubKey, secret) {
    const encodedSecret = [
      padHexStart((secret.length / 2).toString(16)), // OP_PUSHDATA({secretLength})
      secret
    ]
    const signatureEncoded = signature + '01'
    const signaturePushDataOpcode = padHexStart((signatureEncoded.length / 2).toString(16))
    const pubKeyPushDataOpcode = padHexStart((pubKey.length / 2).toString(16))

    const bytecode = [
      '51', // OP_1
      pubKeyPushDataOpcode,
      pubKey,
      ...encodedSecret,
      signaturePushDataOpcode,
      signatureEncoded
    ]

    return bytecode.join('')
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
      '00000000' // SEQUENCE
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
      '00000000' // SEQUENCE
    ].join('')
  }

  generateRawTx (initiationTx, voutIndex, address, input, locktime) {
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

      locktime // LOCKTIME
    ].join('')
  }
}
