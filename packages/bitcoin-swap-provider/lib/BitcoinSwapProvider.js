import * as bitcoin from 'bitcoinjs-lib'

import Provider from '@liquality/provider'
import {
  calculateFee,
  pubKeyToAddress
} from '@liquality/bitcoin-utils'
import { padHexStart } from '@liquality/crypto'
import { addressToString, sleep } from '@liquality/utils'
import networks from '@liquality/bitcoin-networks'

import { version } from '../package.json'

export default class BitcoinSwapProvider extends Provider {
  // TODO: have a generate InitSwap and generate RecipSwap
  // InitSwap should use checkSequenceVerify instead of checkLockTimeVerify

  constructor (chain = { network: networks.bitcoin }, mode = 'p2sh') {
    super()
    this._network = chain.network
    if (!['p2wsh', 'p2shSegwit', 'p2sh'].includes(mode)) {
      throw new Error('Mode must be one of p2wsh, p2sSegwit, p2sh')
    }
    this._mode = mode
    if (this._network.name === networks.bitcoin.name) {
      this._bitcoinJsNetwork = bitcoin.networks.mainnet
    } else if (this._network.name === networks.bitcoin_testnet.name) {
      this._bitcoinJsNetwork = bitcoin.networks.testnet
    } else if (this._network.name === networks.bitcoin_regtest.name) {
      this._bitcoinJsNetwork = bitcoin.networks.regtest
    }
  }

  getPubKeyHash (address) {
    // TODO: wrapped segwit addresses not supported. Not possible to derive pubkeyHash from address
    try {
      const bech32 = bitcoin.address.fromBech32(address)
      return bech32.data
    } catch (e) {
      const base58 = bitcoin.address.fromBase58Check(address)
      return base58.hash
    }
  }

  getSwapOutput (recipientAddress, refundAddress, secretHash, nLockTime) {
    const recipientPubKeyHash = this.getPubKeyHash(recipientAddress)
    const refundPubKeyHash = this.getPubKeyHash(refundAddress)
    const OPS = bitcoin.script.OPS

    return bitcoin.script.compile([
      OPS.OP_IF,
      OPS.OP_SIZE,
      bitcoin.script.number.encode(32),
      OPS.OP_EQUALVERIFY,
      OPS.OP_SHA256,
      Buffer.from(secretHash, 'hex'),
      OPS.OP_EQUALVERIFY,
      OPS.OP_DUP,
      OPS.OP_HASH160,
      recipientPubKeyHash,
      OPS.OP_ELSE,
      bitcoin.script.number.encode(nLockTime),
      OPS.OP_CHECKLOCKTIMEVERIFY,
      OPS.OP_DROP,
      OPS.OP_DUP,
      OPS.OP_HASH160,
      refundPubKeyHash,
      OPS.OP_ENDIF,
      OPS.OP_EQUALVERIFY,
      OPS.OP_CHECKSIG
    ])
  }

  getSwapInput (sig, pubKey, isRedeem, secret) {
    const OPS = bitcoin.script.OPS
    const redeem = isRedeem ? OPS.OP_TRUE : OPS.OP_FALSE
    const secretParams = isRedeem ? [Buffer.from(secret, 'hex')] : []

    return bitcoin.script.compile([
      sig,
      pubKey,
      ...secretParams,
      redeem
    ])
  }

  getSwapPaymentVariants (swapOutput) {
    const p2wsh = bitcoin.payments.p2wsh({
      redeem: { output: swapOutput, network: this._bitcoinJsNetwork },
      network: this._bitcoinJsNetwork
    })
    const p2shSegwit = bitcoin.payments.p2sh({
      redeem: p2wsh, network: this._bitcoinJsNetwork
    })
    const p2sh = bitcoin.payments.p2sh({
      redeem: { output: swapOutput, network: this._bitcoinJsNetwork },
      network: this._bitcoinJsNetwork
    })

    return { p2wsh, p2shSegwit, p2sh }
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration) {
    const swapOutput = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration)
    const address = this.getSwapPaymentVariants(swapOutput)[this._mode].address
    return this.getMethod('sendTransaction')(address, value)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration) {
    const secretHash = bitcoin.crypto.sha256(Buffer.from(secret, 'hex')).toString('hex')
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, expiration, true, secret, secretHash)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, expiration, false, undefined, secretHash)
  }

  async _redeemSwap (initiationTxHash, recipientAddress, refundAddress, expiration, isRedeem, secret, secretHash) {
    const network = this._bitcoinJsNetwork
    const address = isRedeem ? recipientAddress : refundAddress
    // NOT FOR LEDGER
    // const wif = await this.getMethod('dumpPrivKey')(address)
    // const wallet = bitcoin.ECPair.fromWIF(wif, network)
    const swapOutput = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration)
    const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('decodeRawTransaction')(initiationTxRaw)

    let swapVout
    let paymentVariantName
    let paymentVariant
    for (const voutIndex in initiationTx._raw.data.vout) {
      const vout = initiationTx._raw.data.vout[voutIndex]
      const paymentVariantEntry = Object.entries(swapPaymentVariants).find(([, payment]) => payment.output.toString('hex') === vout.scriptPubKey.hex)
      if (paymentVariantEntry) {
        paymentVariantName = paymentVariantEntry[0]
        paymentVariant = paymentVariantEntry[1]
        swapVout = vout
      }
    }

    // TODO: Implement proper fee calculation that counts bytes in inputs and outputs
    // TODO: use node's feePerByte
    const txfee = calculateFee(1, 1, 3)

    swapVout.txid = initiationTxHash
    swapVout.vSat = swapVout.value * 1e8

    const txb = new bitcoin.TransactionBuilder(network)
    txb.setVersion(1)

    if (!isRedeem) txb.setLockTime(expiration)

    const prevOutScript = paymentVariant.output

    txb.addInput(swapVout.txid, swapVout.n, 0, prevOutScript)
    txb.addOutput(addressToString(address), swapVout.vSat - txfee)

    const tx = txb.buildIncomplete()

    const needsWitness = paymentVariantName === 'p2wsh' || paymentVariantName === 'p2shSegwit'

    // LEDGER SPECIFIC

    const walletAddress = await this.getMethod('getWalletAddress')(address)

    tx.setInputScript(swapVout.n, swapOutput)
    const ledgerInitiationTx = await this.getMethod('splitTransaction')(initiationTxRaw, true)
    const ledgerTx = await this.getMethod('splitTransaction')(tx.toHex(), true)
    const ledgerOutputs = (await this.getMethod('serializeTransactionOutputs')(ledgerTx)).toString('hex')
    const ledgerSig = await this.getMethod('signP2SHTransaction')(
      [[ledgerInitiationTx, 0, swapOutput.toString('hex'), 0]],
      [walletAddress.derivationPath],
      ledgerOutputs.toString('hex'),
      isRedeem ? 0 : expiration,
      undefined, // SIGHASH_ALL
      undefined, // TODO: true for segwit?
      2 // transaction version always 2
    )

    // TODO: sig for witness
    // if (needsWitness) {
    //   sigHash = tx.hashForWitnessV0(0, swapPaymentVariants.p2wsh.redeem.output, swapVout.vSat, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
    // } else {
    //   sigHash = tx.hashForSignature(0, paymentVariant.redeem.output, bitcoin.Transaction.SIGHASH_ALL)
    // }
    const sig = Buffer.from(ledgerSig[0] + '01', 'hex')
    // fill the gap
    const wallet = { publicKey: Buffer.from(walletAddress.publicKey, 'hex') }

    const swapInput = this.getSwapInput(sig, wallet.publicKey, isRedeem, secret)
    const paymentParams = { redeem: { output: swapOutput, input: swapInput, network }, network }
    const paymentWithInput = needsWitness
      ? bitcoin.payments.p2wsh(paymentParams)
      : bitcoin.payments.p2sh(paymentParams)

    if (needsWitness) {
      tx.setWitness(0, paymentWithInput.witness)
    }

    if (paymentVariantName === 'p2shSegwit') {
      // Adds the necessary push OP (PUSH34 (00 + witness script hash))
      const inputScript = bitcoin.script.compile([swapPaymentVariants.p2shSegwit.redeem.output])
      tx.setInputScript(0, inputScript)
    } else if (paymentVariantName === 'p2sh') {
      tx.setInputScript(0, paymentWithInput.input)
    }

    return this.getMethod('sendRawTransaction')(tx.toHex())
  }

  doesTransactionMatchSwapParams (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const data = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration).toString('hex')
    const scriptPubKey = padHexStart(data)
    const receivingAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    const sendScript = this.getMethod('createScript')(receivingAddress)
    return Boolean(transaction._raw.vout.find(vout => vout.scriptPubKey.hex === sendScript && vout.valueSat === value))
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    return this.doesTransactionMatchSwapParams(initiationTransaction, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async findSwapTransaction (recipientAddress, refundAddress, secretHash, expiration, predicate) {
    const script = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration).toString('hex')
    const scriptPubKey = padHexStart(script)
    const p2shAddress = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    let swapTransaction = false

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

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiateSwapTransaction = await this.findSwapTransaction(
      recipientAddress,
      refundAddress,
      secretHash,
      expiration,
      tx => this.doesTransactionMatchSwapParams(tx, value, recipientAddress, refundAddress, secretHash, expiration)
    )

    return initiateSwapTransaction
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    const claimSwapTransaction = await this.findSwapTransaction(
      recipientAddress,
      refundAddress,
      secretHash,
      expiration,
      tx => tx._raw.vout.find(vout => vout.scriptPubKey.addresses.includes(recipientAddress))
    )

    return {
      ...claimSwapTransaction,
      secret: await this.getSwapSecret(claimSwapTransaction.hash)
    }
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration) {
    const refundSwapTransaction = await this.findSwapTransaction(recipientAddress, refundAddress, secretHash, expiration,
      tx => tx._raw.vout.find(vout => vout.scriptPubKey.addresses.includes(refundAddress))
    )
    return refundSwapTransaction
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

BitcoinSwapProvider.version = version
