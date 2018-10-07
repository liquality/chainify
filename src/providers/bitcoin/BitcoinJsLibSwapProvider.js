import Provider from '../../Provider'
import { addressToPubKeyHash, compressPubKey, pubKeyToAddress, reverseBuffer } from './BitcoinUtil'
import { sha256, padHexStart, base58, hash160 } from '../../crypto'
import networks from '../../networks'

import bitcoin from 'bitcoinjs-lib'
import bip65 from 'bip65'

const regtest = bitcoin.networks.testnet

export default class BitcoinJsLibSwapProvider extends Provider {
  // TODO: have a generate InitSwap and generate RecipSwap
  //   InitSwap should use checkSequenceVerify instead of checkLockTimeVerify

  constructor (chain = { network: networks.bitcoin }, partyAWIF, partyBWIF) {
    super()
    this._network = chain.network
    this._partyAWIF = partyAWIF
    this._partyBWIF = partyBWIF
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
    const alice = bitcoin.ECPair.fromWIF(this._partyAWIF, regtest)
    const bob = bitcoin.ECPair.fromWIF(this._partyBWIF, regtest)
    const txFee = this.getMethod('calculateFee')(1, 1, 3)
    let alocktime = bip65.encode({ blocks: parseInt(expiration) })
    const script = this.createSwapScript(bob.getAddress(), alice.getAddress(), secretHash, expiration)
    const aliceTxHexs = await this.getMethod('getUnspentTransactions')(alice.getAddress())
    const aliceBalance = await this.getMethod('getBalance')([ alice.getAddress() ])
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const vouts = [{ addr: p2shAddress, vSat: value}]

    let aliceTx = this.generateTransaction(
      alice, aliceBalance,
      vouts, txFee, aliceTxHexs
    )

    return this.getMethod('sendRawTransaction')(aliceTx.hex)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    const alice = bitcoin.ECPair.fromWIF(this._partyAWIF, regtest)
    const bob = bitcoin.ECPair.fromWIF(this._partyBWIF, regtest)

    const secretHash = sha256(secret)
    const script = this.createSwapScript(bob.getAddress(), alice.getAddress(), secretHash, expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(p2shAddress)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('decodeRawTransaction')(initiationTxRaw)
    const voutIndex = initiationTx._raw.data.vout.findIndex((vout) => vout.scriptPubKey.hex === sendScript)
    let vout = initiationTx._raw.data.vout[voutIndex]

    const txfee = this.getMethod('calculateFee')(1, 1, 3)

    secret = Buffer.from(secret, 'hex')
    vout.txid = initiationTxHash
    vout.vSat = vout.value * 1e8
    vout.script = Buffer.from(script, 'hex')

    const aliceRedeem = this.spendSwap(bob, secret, true, txfee, vout, regtest, expiration)

    return this.getMethod('sendRawTransaction')(aliceRedeem)
  }

  spendSwap (alice, secret, isRedeem, txfee, vout, network, lockTime) {
    network = network || bitcoin.networks.bitcoin
    const hashType = bitcoin.Transaction.SIGHASH_ALL

    const txb = new bitcoin.TransactionBuilder(network)

    if (lockTime) txb.setLockTime(lockTime)

    txb.addInput(vout.txid, vout.n, 0)
    txb.addOutput(alice.getAddress(), vout.vSat - txfee)

    const txRaw = txb.buildIncomplete()
    const sigHash = txRaw.hashForSignature(vout.n, vout.script, hashType)
    const redeemScriptSig = bitcoin.script.swap.input.encode(
      alice.sign(sigHash).toScriptSignature(hashType),
      alice.getPublicKeyBuffer(),
      isRedeem,
      secret
    )

    const redeem = bitcoin.script.scriptHash.input.encode(
      redeemScriptSig, vout.script)

    txRaw.setInputScript(0, redeem)
    return txRaw.toHex()
  }

  generateTransaction (sender, senderBalance, txOuts, txFee, vouts, lockTime) {
    if (!(txOuts instanceof Array)) {
      txOuts = [txOuts]
    }

    const txAmnt = txOuts.reduce((prev, elem) => prev + elem.vSat, 0)
    const txCost = txAmnt + txFee

    if (senderBalance < txCost) {
      throw new Error('Balance not sufficient')
    }

    let txb = new bitcoin.TransactionBuilder(regtest)

    if (lockTime != null) {
      txb.setLockTime(lockTime)
    }

    let curAmnt = 0
    let numInput = 0
    for (; curAmnt < txCost; numInput++) {
      curAmnt += vouts[numInput].amount * 1e8
      txb.addInput(vouts[numInput].txid, vouts[numInput].vout, null, Buffer.from(vouts[numInput].scriptPubKey, 'hex'))
    }

    txOuts.forEach((elem) => txb.addOutput(elem.addr, elem.vSat))

    if (txCost !== curAmnt) {
      txb.addOutput(sender.getAddress(), Math.floor(curAmnt) - txCost)
    }

    for (let i = 0; i < numInput; i++) {
      txb.sign(i, sender)
    }

    const txHex = txb.build().toHex()

    return {
      hex: txHex,
      numInput
    }
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
}
