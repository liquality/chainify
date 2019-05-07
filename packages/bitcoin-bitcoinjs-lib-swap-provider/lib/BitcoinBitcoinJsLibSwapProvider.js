import bitcoin from 'bitcoinjs-lib'

import Provider from '@liquality/provider'
import { sleep } from '@liquality/utils'
import networks from '@liquality/bitcoin-networks'
import {
  calculateFee,
  addressToPubKeyHash,
  pubKeyToAddress,
  scriptNumEncode
} from '@liquality/bitcoin-utils'
import {
  sha256,
  padHexStart
} from '@liquality/crypto'

export default class BitcoinBitcoinJsLibSwapProvider extends Provider {
  // TODO: have a generate InitSwap and generate RecipSwap
  // InitSwap should use checkSequenceVerify instead of checkLockTimeVerify

  constructor (chain = { network: networks.bitcoin }) {
    super()
    this._network = chain.network
    this._bitcoinJsNetwork = this._network.isTestnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
  }

  createSwapScript (recipientAddress, refundAddress, secretHash, expiration) {
    let expirationHex = scriptNumEncode(expiration)

    const recipientPubKeyHash = addressToPubKeyHash(recipientAddress)
    const refundPubKeyHash = addressToPubKeyHash(refundAddress)
    const expirationPushDataOpcode = padHexStart(expirationHex.length.toString(16))
    const expirationHexEncoded = expirationHex.toString('hex')

    return [
      '63', // OP_IF
      '82', // OP_SIZE
      '01', // OP_PUSHDATA(1)
      '20', // Hex 32
      '88', // OP_EQUALVERIFY
      'a8', // OP_SHA256
      '20', secretHash, // OP_PUSHDATA(20) {secretHash}
      '88', // OP_EQUALVERIFY
      '76', // OP_DUP
      'a9', // OP_HASH160
      '14', recipientPubKeyHash, // OP_PUSHDATA(20) {recipientPubKeyHash}
      '67', // OP_ELSE
      expirationPushDataOpcode, // OP_PUSHDATA({expirationHexLength})
      expirationHexEncoded, // {expirationHexEncoded}
      'b1', // OP_CHECKLOCKTIMEVERIFY
      '75', // OP_DROP
      '76', // OP_DUP
      'a9', // OP_HASH160
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
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, expiration, true, secret)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, expiration, false, undefined, secretHash)
  }

  async _redeemSwap (initiationTxHash, recipientAddress, refundAddress, expiration, isRedeem, secret, secretHash) {
    const address = isRedeem ? recipientAddress : refundAddress
    const wif = await this.getMethod('dumpPrivKey')(address)
    const wallet = bitcoin.ECPair.fromWIF(wif, this._bitcoinJsNetwork)
    const script = this.createSwapScript(recipientAddress, refundAddress, secretHash || sha256(secret), expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(p2shAddress)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('decodeRawTransaction')(initiationTxRaw)
    const voutIndex = initiationTx._raw.data.vout.findIndex((vout) => vout.scriptPubKey.hex === sendScript)
    let vout = initiationTx._raw.data.vout[voutIndex]
    const txfee = calculateFee(1, 1, 3)

    vout.txid = initiationTxHash
    vout.vSat = vout.value * 1e8
    vout.script = Buffer.from(script, 'hex')
    const walletRedeem = this.spendSwap(address, wallet, secret, isRedeem, txfee, vout, this._bitcoinJsNetwork, expiration)
    return this.getMethod('sendRawTransaction')(walletRedeem)
  }

  spendSwap (address, wallet, secret, isRedeem, txfee, vout, network, expiration) {
    network = network || bitcoin.networks.bitcoin
    const hashType = bitcoin.Transaction.SIGHASH_ALL

    const txb = new bitcoin.TransactionBuilder(network)

    if (!isRedeem) txb.setLockTime(expiration)

    txb.addInput(vout.txid, vout.n, 0)
    txb.addOutput(address, vout.vSat - txfee)

    const txRaw = txb.buildIncomplete()
    const sigHash = txRaw.hashForSignature(0, vout.script, hashType)

    const redeemScriptSig = bitcoin.script.swap.input.encode(
      wallet.sign(sigHash).toScriptSignature(hashType),
      wallet.getPublicKeyBuffer(),
      isRedeem,
      isRedeem ? Buffer.from(secret, 'hex') : undefined
    )

    const redeem = bitcoin.script.scriptHash.input.encode(
      redeemScriptSig, vout.script)

    txRaw.setInputScript(0, redeem)
    return txRaw.toHex()
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

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    let blockNumber = await this.getMethod('getBlockHeight')()
    let initiateSwapTransaction = null
    while (!initiateSwapTransaction) {
      let block
      try {
        block = await this.getMethod('getBlockByNumber')(blockNumber, true)
      } catch (e) { }
      if (block) {
        initiateSwapTransaction = block.transactions.find(tx => this.doesTransactionMatchSwapParams(tx, value, recipientAddress, refundAddress, secretHash, expiration))
        blockNumber++
      }
      await sleep(5000)
    }
    return initiateSwapTransaction
  }

  async findSwapTransaction (recipientAddress, refundAddress, secretHash, expiration, predicate) {
    const script = this.createSwapScript(recipientAddress, refundAddress, secretHash, expiration)
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    let swapTransaction = null
    while (!swapTransaction) {
      let p2shTransactions = await this.getMethod('getAddressDeltas')([p2shAddress])
      const p2shMempoolTransactions = await this.getMethod('getAddressMempool')([p2shAddress])
      p2shTransactions = p2shTransactions.concat(p2shMempoolTransactions)
      const transactionIds = p2shTransactions.map(tx => tx.txid)
      const transactions = await Promise.all(transactionIds.map(this.getMethod('getTransactionByHash')))
      swapTransaction = transactions.find(predicate)
      await sleep(5000)
    }
    return swapTransaction
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    const claimSwapTransaction = await this.findSwapTransaction(recipientAddress, refundAddress, secretHash, expiration,
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
    const pubKeyLen = script.slice(sigLength + 1)[0]
    const secretLength = script.slice(sigLength + pubKeyLen + 2)[0]
    return script.slice(sigLength + pubKeyLen + 3, sigLength + pubKeyLen + secretLength + 3).toString('hex')
  }
}
