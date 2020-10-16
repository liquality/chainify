import * as bitcoin from 'bitcoinjs-lib'
import * as classify from 'bitcoinjs-lib/src/classify'
import BigNumber from 'bignumber.js'
import Provider from '@liquality/provider'
import {
  calculateFee,
  decodeRawTransaction,
  normalizeTransactionObject
} from '@liquality/bitcoin-utils'
import { addressToString } from '@liquality/utils'
import networks from '@liquality/bitcoin-networks'

import { version } from '../package.json'

export default class BitcoinSwapProvider extends Provider {
  constructor (network = networks.bitcoin, mode = 'p2wsh') {
    super()
    this._network = network
    if (!['p2wsh', 'p2shSegwit', 'p2sh'].includes(mode)) {
      throw new Error('Mode must be one of p2wsh, p2shSegwit, p2sh')
    }
    this._mode = mode
  }

  getPubKeyHash (address) {
    const outputScript = bitcoin.address.toOutputScript(address, this._network)
    const type = classify.output(outputScript)
    if (![classify.types.P2PKH, classify.types.P2WPKH].includes(type)) {
      throw new Error(`Bitcoin swap doesn't support the address ${address} type of ${type}. Not possible to derive public key hash.`)
    }

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
      redeem: { output: swapOutput, network: this._network },
      network: this._network
    })
    const p2shSegwit = bitcoin.payments.p2sh({
      redeem: p2wsh, network: this._network
    })
    const p2sh = bitcoin.payments.p2sh({
      redeem: { output: swapOutput, network: this._network },
      network: this._network
    })

    return { p2wsh, p2shSegwit, p2sh }
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, feePerByte) {
    const swapOutput = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration)
    const address = this.getSwapPaymentVariants(swapOutput)[this._mode].address
    return this.getMethod('sendTransaction')(address, value, undefined, feePerByte)
  }

  async claimSwap (initiationTxHash, recipientAddress, refundAddress, secret, expiration, feePerByte) {
    const secretHash = bitcoin.crypto.sha256(Buffer.from(secret, 'hex')).toString('hex')
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, expiration, true, secret, secretHash, feePerByte)
  }

  async refundSwap (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, feePerByte) {
    return this._redeemSwap(initiationTxHash, recipientAddress, refundAddress, expiration, false, undefined, secretHash, feePerByte)
  }

  async _redeemSwap (initiationTxHash, recipientAddress, refundAddress, expiration, isRedeem, secret, secretHash, _feePerByte) {
    const network = this._network
    const address = isRedeem ? recipientAddress : refundAddress
    const swapOutput = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration)
    const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('getRawTransactionByHash')(initiationTxHash, true)

    let swapVout
    let paymentVariantName
    let paymentVariant
    for (const voutIndex in initiationTx._raw.vout) {
      const vout = initiationTx._raw.vout[voutIndex]
      const paymentVariantEntry = Object.entries(swapPaymentVariants).find(([, payment]) => payment.output.toString('hex') === vout.scriptPubKey.hex)
      if (paymentVariantEntry) {
        paymentVariantName = paymentVariantEntry[0]
        paymentVariant = paymentVariantEntry[1]
        swapVout = vout
      }
    }

    const feePerByte = _feePerByte || await this.getMethod('getFeePerByte')()

    // TODO: Implement proper fee calculation that counts bytes in inputs and outputs
    const txfee = calculateFee(1, 1, feePerByte)

    swapVout.txid = initiationTxHash
    swapVout.vSat = BigNumber(swapVout.value).times(1e8).toNumber()

    if (swapVout.vSat - txfee < 0) {
      throw new Error('Transaction amount does not cover fee.')
    }

    const txb = new bitcoin.TransactionBuilder(network)

    if (!isRedeem) txb.setLockTime(expiration)

    const prevOutScript = paymentVariant.output

    txb.addInput(swapVout.txid, swapVout.n, 0, prevOutScript)
    txb.addOutput(addressToString(address), swapVout.vSat - txfee)

    const tx = txb.buildIncomplete()

    const isSegwit = paymentVariantName === 'p2wsh' || paymentVariantName === 'p2shSegwit'

    const sig = await this.getMethod('signP2SHTransaction')(
      initiationTxRaw, // TODO: Why raw? can't it be a bitcoinjs-lib TX like the next one?
      tx.toHex(),
      address,
      swapVout.n,
      (isSegwit ? swapPaymentVariants.p2wsh.redeem.output : swapPaymentVariants.p2sh.redeem.output).toString('hex'),
      isRedeem ? 0 : expiration,
      isSegwit
    )

    const walletAddress = await this.getMethod('getWalletAddress')(address)
    const swapInput = this.getSwapInput(Buffer.from(sig, 'hex'), walletAddress.publicKey, isRedeem, secret)
    const paymentParams = { redeem: { output: swapOutput, input: swapInput, network }, network }
    const paymentWithInput = isSegwit
      ? bitcoin.payments.p2wsh(paymentParams)
      : bitcoin.payments.p2sh(paymentParams)

    if (isSegwit) {
      tx.setWitness(0, paymentWithInput.witness)
    }

    if (paymentVariantName === 'p2shSegwit') {
      // Adds the necessary push OP (PUSH34 (00 + witness script hash))
      const inputScript = bitcoin.script.compile([swapPaymentVariants.p2shSegwit.redeem.output])
      tx.setInputScript(0, inputScript)
    } else if (paymentVariantName === 'p2sh') {
      tx.setInputScript(0, paymentWithInput.input)
    }

    const hex = tx.toHex()
    await this.getMethod('sendRawTransaction')(hex)
    return normalizeTransactionObject(decodeRawTransaction(hex), txfee)
  }

  async updateTransactionFee (tx, newFeePerByte) {
    const txHash = typeof tx === 'string' ? tx : tx.hash
    const transaction = (await this.getMethod('getTransactionByHash')(txHash))._raw
    if (transaction.vin.length === 1 && transaction.vout.length === 1) {
      const inputTx = (await this.getMethod('getTransactionByHash')(transaction.vin[0].txid))._raw
      const prevout = inputTx.vout[transaction.vin[0].vout]
      const voutType = prevout.scriptPubKey.type
      if (['scripthash', 'witness_v0_scripthash'].includes(voutType)) {
        const segwit = voutType === 'witness_v0_scripthash'
        const inputTxHex = inputTx.hex
        const tx = bitcoin.Transaction.fromHex(transaction.hex)

        const address = transaction.vout[0].scriptPubKey.addresses[0]
        prevout.vSat = BigNumber(prevout.value).times(1e8).toNumber()

        const txfee = calculateFee(1, 1, newFeePerByte)

        if (prevout.vSat - txfee < 0) {
          throw new Error('Transaction amount does not cover fee.')
        }

        tx.outs[0].value = BigNumber(prevout.vSat).minus(BigNumber(txfee)).toNumber()

        let outputScript
        if (segwit) {
          const witness = transaction.vin[0].txinwitness
          outputScript = Buffer.from(witness[witness.length - 1], 'hex')
        } else {
          const scriptSig = transaction.vin[0].scriptSig.hex
          const script = bitcoin.script.decompile(Buffer.from(scriptSig, 'hex'))
          outputScript = script[script.length - 1]
        }
        const lockTime = transaction.lockTime

        const unsignedTxHex = tx.toHex()
        const sig = await this.getMethod('signP2SHTransaction')(inputTxHex, unsignedTxHex, address, prevout.n, outputScript.toString('hex'), lockTime, segwit)
        if (segwit) {
          const witness = [Buffer.from(sig, 'hex'), ...tx.ins[0].witness.slice(1)]
          tx.setWitness(0, witness)
        } else {
          const scriptSig = transaction.vin[0].scriptSig.hex
          const script = bitcoin.script.decompile(Buffer.from(scriptSig, 'hex'))
          const inputScript = bitcoin.script.compile([Buffer.from(sig, 'hex'), ...script.slice(1)])
          tx.setInputScript(0, inputScript)
        }
        const hex = tx.toHex()
        await this.getMethod('sendRawTransaction')(hex)
        return normalizeTransactionObject(decodeRawTransaction(hex), txfee)
      }
    }

    return this.getMethod('updateTransactionFee')(tx, newFeePerByte)
  }

  getInputScriptFromTransaction (tx) {
    const vin = tx._raw.vin[0]
    if (!vin.scriptSig) return null

    const inputScript = vin.txinwitness ? vin.txinwitness
      : bitcoin.script.decompile(Buffer.from(vin.scriptSig.hex, 'hex'))
        .map(b => Buffer.isBuffer(b) ? b.toString('hex') : b)
    return inputScript
  }

  doesTransactionMatchRedeem (initiationTxHash, tx, address, isRefund) {
    if (tx._raw.vin[0].txid !== initiationTxHash) return false
    const inputScript = this.getInputScriptFromTransaction(tx)
    if (!inputScript) return false
    if (isRefund) {
      if (inputScript.length !== 4) return false
    } else {
      if (inputScript.length !== 5) return false
    }
    const vout = tx._raw.vout.find(vout => vout.scriptPubKey.addresses && vout.scriptPubKey.addresses.includes(address))
    if (!vout) return false

    return true
  }

  doesTransactionMatchInitiation (transaction, value, recipientAddress, refundAddress, secretHash, expiration) {
    const swapOutput = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration)
    const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput)
    const vout = transaction._raw.vout.find(vout =>
      Object.values(swapPaymentVariants).find(payment =>
        payment.output.toString('hex') === vout.scriptPubKey.hex &&
        BigNumber(vout.value).times(1e8).eq(BigNumber(value))
      )
    )
    return Boolean(vout)
  }

  async verifyInitiateSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    return this.doesTransactionMatchInitiation(initiationTransaction, value, recipientAddress, refundAddress, secretHash, expiration)
  }

  async findSwapTransaction (recipientAddress, refundAddress, secretHash, expiration, blockNumber, predicate) {
    // TODO: Are mempool TXs possible?
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    const swapTransaction = block.transactions.find(predicate)
    return swapTransaction
  }

  async findInitiateSwapTransaction (value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    return this.getMethod('findSwapTransaction', false)(recipientAddress, refundAddress, secretHash, expiration, blockNumber,
      tx => this.doesTransactionMatchInitiation(tx, value, recipientAddress, refundAddress, secretHash, expiration)
    )
  }

  async findClaimSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const claimSwapTransaction = await this.getMethod('findSwapTransaction', false)(recipientAddress, refundAddress, secretHash, expiration, blockNumber,
      tx => this.doesTransactionMatchRedeem(initiationTxHash, tx, recipientAddress, false)
    )

    if (claimSwapTransaction) {
      const secret = await this.getSwapSecret(claimSwapTransaction.hash)
      return {
        ...claimSwapTransaction,
        secret
      }
    }
  }

  async findRefundSwapTransaction (initiationTxHash, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    const refundSwapTransaction = await this.getMethod('findSwapTransaction', false)(recipientAddress, refundAddress, secretHash, expiration, blockNumber,
      tx => this.doesTransactionMatchRedeem(initiationTxHash, tx, refundAddress, true)
    )
    return refundSwapTransaction
  }

  async getSwapSecret (claimTxHash) {
    const claimTx = await this.getMethod('getTransactionByHash')(claimTxHash)
    const inputScript = this.getInputScriptFromTransaction(claimTx)
    return inputScript[2]
  }
}

BitcoinSwapProvider.version = version
