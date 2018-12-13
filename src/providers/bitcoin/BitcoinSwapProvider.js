import Provider from '../../Provider'
import { addressToPubKeyHash, compressPubKey, pubKeyToAddress, reverseBuffer, scriptNumEncode } from './BitcoinUtil'
import { sha256, padHexStart } from '../../crypto'
import networks from '../../networks'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export default class BitcoinSwapProvider extends Provider {
  // TODO: have a generate InitSwap and generate RecipSwap
  //   InitSwap should use checkSequenceVerify instead of checkLockTimeVerify

  constructor (chain = { network: networks.bitcoin }) {
    super()
    this._network = chain.network
  }

  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    let expirationHex = scriptNumEncode(expiration)

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
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, secret, expiration, true)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, false)
  }

  async _redeemSwap (initiationTxHash, recipientAddress, refundAddress, secretParam, expiration, isClaim) {
    const feePerByte = await this.getMethod('getFeePerByte')()
    const secretHash = isClaim ? sha256(secretParam) : secretParam
    const lockTime = isClaim ? 0 : expiration + 100
    const lockTimeHex = isClaim ? padHexStart('0', 8) : padHexStart(scriptNumEncode(lockTime).toString('hex'), 8)
    const to = isClaim ? recipientAddress : refundAddress
    const script = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(p2shAddress)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('splitTransaction')(initiationTxRaw, true)
    const voutIndex = initiationTx.outputs.findIndex((output) => output.script.toString('hex') === sendScript)
    // Here is where the voutIndex should be 0 for the refund of my tx!!!
    const txHashLE = Buffer.from(initiationTxHash, 'hex').reverse().toString('hex') // TX HASH IN LITTLE ENDIAN
    const newTxInput = this.generateSigTxInput(txHashLE, voutIndex, script)
    const newTx = await this.generateRawTx(initiationTx, voutIndex, to, newTxInput, lockTimeHex, feePerByte)
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

    const pubKeyInfo = await this.getMethod('getPubKey')(isClaim ? recipientAddress : refundAddress)
    const pubKey = compressPubKey(pubKeyInfo.publicKey)
    const spendSwap = this._spendSwap(signature[0], pubKey, isClaim, secretParam)
    const spendSwapInput = this._spendSwapInput(spendSwap, script)
    const rawClaimTxInput = this.generateRawTxInput(txHashLE, spendSwapInput)
    const rawClaimTx = await this.generateRawTx(initiationTx, voutIndex, to, rawClaimTxInput, lockTimeHex, feePerByte)

    return this.getMethod('sendRawTransaction')(rawClaimTx)
  }

  _spendSwap (signature, pubKey, isClaim, secret) {
    const redeemEncoded = isClaim ? '51' : '00' // OP_1 : OP_0
    const encodedSecret = isClaim
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

  doesTransactionMatchSwapParams (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(data)
    const receivingAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(receivingAddress)
    return Boolean(transaction._raw.vout.find(vout => vout.scriptPubKey.hex === sendScript && vout.valueSat === value))
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    return this.doesTransactionMatchSwapParams(initiationTransaction, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async findSwapTransaction (recipientAddress, refundAddress, secretHash, expiration, includeMempool, predicate) {
    const script = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    let swapTransaction = null
    while (!swapTransaction) {
      let p2shTransactions = await this.getMethod('getAddressDeltas')([p2shAddress])
      if (includeMempool) {
        const p2shMempoolTransactions = await this.getMethod('getAddressMempool')([p2shAddress])
        p2shTransactions.concat(p2shMempoolTransactions)
      }
      const transactionIds = p2shTransactions.map(tx => tx.txid)
      const transactions = await Promise.all(transactionIds.map(this.getMethod('getTransactionByHash')))
      swapTransaction = transactions.find(predicate)
      await sleep(5000)
    }
    return swapTransaction
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, includeMempool = false) {
    const initiateSwapTransaction = await this.findSwapTransaction(recipientAddress, refundAddress, secretHash, expiration, includeMempool,
      tx => this.doesTransactionMatchSwapParams(tx, value, recipientAddress, refundAddress, secretHash, expiration)
    )

    return initiateSwapTransaction
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, includeMempool = false) {
    const claimSwapTransaction = await this.findSwapTransaction(recipientAddress, refundAddress, secretHash, expiration, includeMempool,
      tx => tx._raw.vin.find(vin => vin.txid === initiationTxHash)
    )

    return {
      ...claimSwapTransaction,
      secret: await this.getSwapSecret(claimSwapTransaction.hash)
    }
  }

  async getSwapSecret (claimTxHash) {
    const claimTx = await this.getMethod('getTransactionByHash')(claimTxHash)
    const script = Buffer.from(claimTx._raw.vin[0].scriptSig.hex, 'hex')
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

  async generateRawTx (initiationTx, voutIndex, address, input, locktime, feePerByte) {
    const output = initiationTx.outputs[voutIndex]
    const value = parseInt(reverseBuffer(output.amount).toString('hex'), 16)
    const { relayfee } = await this.getMethod('jsonrpc')('getinfo')
    const fee = this.getMethod('calculateFee')(1, 1, feePerByte)
    const amount = value - Math.max(fee, relayfee)
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
