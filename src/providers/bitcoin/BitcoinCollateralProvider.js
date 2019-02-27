import Provider from '../../Provider'
import { addressToPubKeyHash, pubKeyToAddress, reverseBuffer, scriptNumEncode } from './BitcoinUtil'
import { hash160, sha256, padHexStart } from '../../crypto'
import networks from './networks'

export default class BitcoinCollateralProvider extends Provider {
  constructor (chain = { network: networks.bitcoin }) {
    super()
    this._network = chain.network
  }

  createRefundableCollateralScript (borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration) {
    let loanExpirationHex = scriptNumEncode(loanExpiration)
    let biddingExpirationHex = scriptNumEncode(biddingExpiration)

    const borrowerPubKeyHash = hash160(borrowerPubKey)
    const borrowerPubKeyPushDataOpcode = padHexStart((borrowerPubKey.length / 2).toString(16))

    const lenderPubKeyPushDataOpcode = padHexStart((lenderPubKey.length / 2).toString(16))

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
      '75', // OP_DROP
      '52', // PUSH #2
      borrowerPubKeyPushDataOpcode, borrowerPubKey, // OP_PUSHDATA({alicePubKeyLength}) {alicePubKey}
      lenderPubKeyPushDataOpcode, lenderPubKey, // OP_PUSHDATA({bobPubKeyLength}) {bobPubKey}
      '52', // PUSH #2
      'ae', // CHECKMULTISIG
      '67', // OP_ELSE
      biddingExpirationPushDataOpcode, // OP_PUSHDATA({biddingExpirationHexLength})
      biddingExpirationHexEncoded, // {biddingExpirationHexEncoded}
      'b1', // OP_CHECKLOCKTIMEVERIFY
      '75', // OP_DROP
      '76', 'a9', // OP_DUP OP_HASH160
      '14', borrowerPubKeyHash, // OP_PUSHDATA(20) {alicePubKeyHash}
      '88', 'ac', // OP_EQUALVERIFY OP_CHECKSIG
      '68', // OP_ENDIF
      '68' // OP_ENDIF
    ].join('')
  }

  createSeizableCollateralScript (borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration) {
    let loanExpirationHex = scriptNumEncode(loanExpiration)
    let biddingExpirationHex = scriptNumEncode(biddingExpiration)
    let seizureExpirationHex = scriptNumEncode(seizureExpiration)

    const borrowerPubKeyHash = hash160(borrowerPubKey)
    const borrowerPubKeyPushDataOpcode = padHexStart((borrowerPubKey.length / 2).toString(16))

    const lenderPubKeyHash = hash160(lenderPubKey)
    const lenderPubKeyPushDataOpcode = padHexStart((lenderPubKey.length / 2).toString(16))

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
      '75', // OP_DROP
      '52', // PUSH #2
      borrowerPubKeyPushDataOpcode, borrowerPubKey, // OP_PUSHDATA({alicePubKeyLength}) {alicePubKey}
      lenderPubKeyPushDataOpcode, lenderPubKey, // OP_PUSHDATA({bobPubKeyLength}) {bobPubKey}
      '52', // PUSH #2
      'ae', // CHECKMULTISIG
      '67', // OP_ELSE
      '63', // OP_IF
      biddingExpirationPushDataOpcode, // OP_PUSHDATA({expirationHexLength})
      biddingExpirationHexEncoded, // {expirationHexEncoded}
      'b1', // OP_CHECKLOCKTIMEVERIFY
      '75', // OP_DROP
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
      '75', // OP_DROP
      '76', 'a9', // OP_DUP OP_HASH160
      '14', borrowerPubKeyHash, // OP_PUSHDATA(20) {alicePubKeyHash}
      '88', 'ac', // OP_EQUALVERIFY OP_CHECKSIG
      '68', // OP_ENDIF
      '68', // OP_ENDIF
      '68' // OP_ENDIF
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
    const lenderSecretHash = sha256(lenderSecret)

    const refundableScript = this.createRefundableCollateralScript(borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration)
    const seizableScript = this.createSeizableCollateralScript(borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    const refundableResult = await this._refundCollateral(refundableTxHash, refundableScript, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecret, loanExpiration, biddingExpiration, seizureExpiration, false, 'loanPeriod')
    const seizableResult = await this._refundCollateral(seizableTxHash, seizableScript, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecret, loanExpiration, biddingExpiration, seizureExpiration, true, 'loanPeriod')

    return { refundableResult, seizableResult }
  }

  async seizeCollateral (seizableTxHash, borrowerPubKey, lenderPubKey, borrowerSecret, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration) {
    const borrowerSecretHash = sha256(borrowerSecret)

    const seizableScript = this.createSeizableCollateralScript(borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    return this._refundCollateral(seizableTxHash, seizableScript, borrowerPubKey, lenderPubKey, borrowerSecret, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration, true, 'seizurePeriod')
  }

  async refundRefundableCollateral (refundableTxHash, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration) {
    const refundableScript = this.createRefundableCollateralScript(borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    return this._refundCollateral(refundableTxHash, refundableScript, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration, false, 'seizurePeriod')
  }

  async refundSeizableCollateral (seizableTxHash, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration) {
    const seizableScript = this.createSeizableCollateralScript(borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    return this._refundCollateral(seizableTxHash, seizableScript, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration, true, 'refundPeriod')
  }

  async multisigSignCollateral (refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration, isBorrower, to) {
    const refundableScript = this.createRefundableCollateralScript(borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration)
    const seizableScript = this.createSeizableCollateralScript(borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    const from = isBorrower ? pubKeyToAddress(borrowerPubKey, this._network.name, 'pubKeyHash') : pubKeyToAddress(lenderPubKey, this._network.name, 'pubKeyHash')

    const refundableSignature = await this._multisigSignCollateral(refundableTxHash, refundableScript, loanExpiration, to, from)
    const seizableSignature = await this._multisigSignCollateral(seizableTxHash, seizableScript, loanExpiration, to, from)

    return { refundableSignature, seizableSignature }
  }

  async multisigSendCollateral (refundableTxHash, seizableTxHash, borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration, borrowerSignatures, lenderSignatures, to) {
    const refundableScript = this.createRefundableCollateralScript(borrowerPubKey, lenderPubKey, lenderSecretHash, loanExpiration, biddingExpiration)
    const seizableScript = this.createSeizableCollateralScript(borrowerPubKey, lenderPubKey, borrowerSecretHash, lenderSecretHash, loanExpiration, biddingExpiration, seizureExpiration)

    const refundableResult = await this._multisigSendCollateral(refundableTxHash, refundableScript, loanExpiration, borrowerSignatures.refundableSignature, lenderSignatures.refundableSignature, to)
    const seizableResult = await this._multisigSendCollateral(seizableTxHash, seizableScript, loanExpiration, borrowerSignatures.seizableSignature, lenderSignatures.seizableSignature, to)

    return { refundableResult, seizableResult }
  }

  async _refundCollateral (initiationTxHash, script, borrowerPubKey, lenderPubKey, borrowerSecretParam, lenderSecretParam, loanExpiration, biddingExpiration, seizureExpiration, seizable, period) {
    let secret, lockTime
    let requiresSecret = false
    if (period === 'loanPeriod') {
      secret = lenderSecretParam
      requiresSecret = true
    } else if (period === 'seizurePeriod' && seizable === true) {
      secret = borrowerSecretParam
      requiresSecret = true
    }

    if (period === 'loanPeriod') {
      lockTime = 0
    } else if (period === 'biddingPeriod') {
      lockTime = loanExpiration + 100
    } else if (period === 'seizurePeriod') {
      lockTime = biddingExpiration + 100
    } else {
      lockTime = seizureExpiration + 100
    }
    const lockTimeHex = padHexStart(scriptNumEncode(lockTime).toString('hex'), 8)

    const pubKey = (period === 'seizurePeriod' && requiresSecret) ? lenderPubKey : borrowerPubKey
    const to = pubKeyToAddress(pubKey, this._network.name, 'pubKeyHash')

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

    const spendCollateral = this._spendCollateral(signature[0], pubKey, secret, requiresSecret, period)
    const spendCollateralInput = this._spendCollateralInput(spendCollateral, script)
    const rawClaimTxInput = this.generateRawTxInput(txHashLE, spendCollateralInput)
    const rawClaimTx = this.generateRawTx(initiationTx, voutIndex, to, rawClaimTxInput, lockTimeHex)

    return this.getMethod('sendRawTransaction')(rawClaimTx)
  }

  async _multisigSignCollateral (initiationTxHash, script, loanExpiration, to, from) {
    const lockTime = loanExpiration + 100
    const lockTimeHex = padHexStart(scriptNumEncode(lockTime).toString('hex'), 8)

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

    const addressPath = await this.getMethod('getDerivationPathFromAddress')(from)

    const signature = await this.getMethod('signP2SHTransaction')(
      [[initiationTx, 0, script, 0]],
      [addressPath],
      outputScript,
      lockTime
    )

    return signature[0]
  }

  async _multisigSendCollateral (initiationTxHash, script, loanExpiration, borrowerSignature, lenderSignature, to) {
    const lockTime = loanExpiration + 100
    const lockTimeHex = padHexStart(scriptNumEncode(lockTime).toString('hex'), 8)

    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(p2shAddress)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('splitTransaction')(initiationTxRaw, true)
    const voutIndex = initiationTx.outputs.findIndex((output) => output.script.toString('hex') === sendScript)

    const txHashLE = Buffer.from(initiationTxHash, 'hex').reverse().toString('hex') // TX HASH IN LITTLE ENDIAN

    const spendCollateral = this._spendMultisigCollateral(borrowerSignature, lenderSignature)
    const spendCollateralInput = this._spendCollateralInput(spendCollateral, script)
    const rawClaimTxInput = this.generateRawTxInput(txHashLE, spendCollateralInput)
    const rawClaimTx = this.generateRawTx(initiationTx, voutIndex, to, rawClaimTxInput, lockTimeHex)

    return this.getMethod('sendRawTransaction')(rawClaimTx)
  }

  _spendMultisigCollateral (borrowerSignature, lenderSignature) {
    const ifBranch = ['51', '00']

    const borrowerSignatureEncoded = borrowerSignature + '01'
    const borrowerSignaturePushDataOpcode = padHexStart((borrowerSignatureEncoded.length / 2).toString(16))
    const lenderSignatureEncoded = lenderSignature + '01'
    const lenderSignaturePushDataOpcode = padHexStart((lenderSignatureEncoded.length / 2).toString(16))

    const bytecode = [
      '00',
      borrowerSignaturePushDataOpcode,
      borrowerSignatureEncoded,
      lenderSignaturePushDataOpcode,
      lenderSignatureEncoded,
      ...ifBranch
    ]

    return bytecode.join('')
  }

  _spendCollateral (signature, pubKey, secret, requiresSecret, period) {
    var ifBranch
    if (period === 'loanPeriod') {
      ifBranch = ['51']
    } else if (period === 'biddingPeriod') {
      ifBranch = ['51', '00']
    } else if (period === 'seizurePeriod' && requiresSecret) {
      ifBranch = ['51', '00', '00']
    } else if (period === 'seizurePeriod' && !requiresSecret) {
      ifBranch = ['00', '00']
    } else if (period === 'refundPeriod') {
      ifBranch = ['00', '00', '00']
    }

    const encodedSecret = requiresSecret
      ? [
        padHexStart((secret.length / 2).toString(16)), // OP_PUSHDATA({secretLength})
        secret
      ]
      : [] // OP_0

    const signatureEncoded = signature + '01'
    const signaturePushDataOpcode = padHexStart((signatureEncoded.length / 2).toString(16))
    const pubKeyPushDataOpcode = padHexStart((pubKey.length / 2).toString(16))

    const bytecode = [
      signaturePushDataOpcode,
      signatureEncoded,
      pubKeyPushDataOpcode,
      pubKey,
      ...encodedSecret,
      ...ifBranch
    ]

    return bytecode.join('')
  }

  _spendCollateralInput (spendCollateralBytecode, voutScript) {
    const bytecode = [
      spendCollateralBytecode,
      '4c',
      padHexStart((voutScript.length / 2).toString(16)),
      voutScript
    ]

    return bytecode.join('')
  }

  generateSigTxInput (txHashLE, voutIndex, script) {
    const inputTxOutput = padHexStart(voutIndex.toString(16), 8)
    const scriptLength = Buffer.from(padHexStart((script.length / 2).toString(16)), 'hex').reverse().toString('hex')

    return [
      '01', // NUM INPUTS
      txHashLE,
      inputTxOutput, // INPUT TRANSACTION OUTPUT
      scriptLength.length > 2 ? 'fd' : '',
      scriptLength,
      script,
      '00000000' // SEQUENCE
    ].join('')
  }

  generateRawTxInput (txHashLE, script) {
    const scriptLength = Buffer.from(padHexStart((script.length / 2).toString(16)), 'hex').reverse().toString('hex')

    return [
      '01', // NUM INPUTS
      txHashLE,
      '00000000',
      scriptLength.length > 2 ? 'fd' : '',
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
