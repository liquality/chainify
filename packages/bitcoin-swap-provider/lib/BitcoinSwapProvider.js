import Provider from '@liquality/provider'
import {
  calculateFee,
  decodeRawTransaction,
  normalizeTransactionObject,
  witnessStackToScriptWitness,
  getPubKeyHash,
  validateAddress
} from '@liquality/bitcoin-utils'
import {
  addressToString,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash,
  validateExpiration
} from '@liquality/utils'
import networks from '@liquality/bitcoin-networks'

import * as bitcoin from 'bitcoinjs-lib'
import BigNumber from 'bignumber.js'

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

  getSwapOutput (recipientAddress, refundAddress, secretHash, nLockTime) {
    validateAddress(recipientAddress, this._network)
    validateAddress(refundAddress, this._network)
    validateSecretHash(secretHash)
    validateExpiration(nLockTime)

    const secretHashBuff = Buffer.from(secretHash, 'hex')
    const recipientPubKeyHash = getPubKeyHash(recipientAddress, this._network)
    const refundPubKeyHash = getPubKeyHash(refundAddress, this._network)
    const OPS = bitcoin.script.OPS

    const script = bitcoin.script.compile([
      OPS.OP_IF,
      OPS.OP_SIZE,
      bitcoin.script.number.encode(32),
      OPS.OP_EQUALVERIFY,
      OPS.OP_SHA256,
      secretHashBuff,
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

    if (![97, 98].includes(Buffer.byteLength(script))) {
      throw new Error('Invalid swap script')
    }

    return script
  }

  getSwapInput (sig, pubKey, isClaim, secret) {
    const OPS = bitcoin.script.OPS
    const redeem = isClaim ? OPS.OP_TRUE : OPS.OP_FALSE
    const secretParams = isClaim ? [Buffer.from(secret, 'hex')] : []

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

  validateSwapParams (value, recipientAddress, refundAddress, secretHash, expiration) {
    validateValue(value)
    validateAddress(recipientAddress, this._network)
    validateAddress(refundAddress, this._network)
    validateSecretHash(secretHash)
    validateExpiration(expiration)
  }

  async initiateSwap (value, recipientAddress, refundAddress, secretHash, expiration, feePerByte) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

    const swapOutput = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration)
    const address = this.getSwapPaymentVariants(swapOutput)[this._mode].address
    return this.getMethod('sendTransaction')(address, value, undefined, feePerByte)
  }

  async fundSwap (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, feePerByte) {
    return null
  }

  async claimSwap (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, secret, feePerByte) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)
    validateSecret(secret)
    validateSecretAndHash(secret, secretHash)
    await this.verifyInitiateSwapTransaction(initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration)

    return this._redeemSwap(initiationTxHash, value, recipientAddress, refundAddress, expiration, true, secret, secretHash, feePerByte)
  }

  async refundSwap (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, feePerByte) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)
    await this.verifyInitiateSwapTransaction(initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration)

    return this._redeemSwap(initiationTxHash, value, recipientAddress, refundAddress, expiration, false, undefined, secretHash, feePerByte)
  }

  async _redeemSwap (initiationTxHash, value, recipientAddress, refundAddress, expiration, isClaim, secret, secretHash, feePerByte) {
    const address = isClaim ? recipientAddress : refundAddress
    const swapOutput = this.getSwapOutput(recipientAddress, refundAddress, secretHash, expiration)
    return this._redeemSwapOutput(initiationTxHash, value, address, swapOutput, expiration, isClaim, secret, feePerByte)
  }

  async _redeemSwapOutput (initiationTxHash, value, address, swapOutput, expiration, isClaim, secret, _feePerByte) {
    const network = this._network
    const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = await this.getMethod('getRawTransactionByHash')(initiationTxHash, true)

    let swapVout
    let paymentVariantName
    let paymentVariant
    for (const vout of initiationTx._raw.vout) {
      const paymentVariantEntry = Object.entries(swapPaymentVariants).find(([, payment]) => payment.output.toString('hex') === vout.scriptPubKey.hex)
      const voutValue = BigNumber(vout.value).times(1e8)
      if (paymentVariantEntry && voutValue.eq(BigNumber(value))) {
        paymentVariantName = paymentVariantEntry[0]
        paymentVariant = paymentVariantEntry[1]
        swapVout = vout
      }
    }

    if (!swapVout) {
      throw new Error('Valid swap output not found')
    }

    const feePerByte = _feePerByte || await this.getMethod('getFeePerByte')()

    // TODO: Implement proper fee calculation that counts bytes in inputs and outputs
    const txfee = calculateFee(1, 1, feePerByte)

    swapVout.txid = initiationTxHash
    swapVout.vSat = BigNumber(swapVout.value).times(1e8).toNumber()

    if (swapVout.vSat - txfee < 0) {
      throw new Error('Transaction amount does not cover fee.')
    }

    const psbt = new bitcoin.Psbt({ network })

    if (!isClaim) {
      psbt.setLocktime(expiration)
    }

    const isSegwit = paymentVariantName === 'p2wsh' || paymentVariantName === 'p2shSegwit'

    const input = {
      hash: swapVout.txid,
      index: swapVout.n,
      sequence: 0
    }

    if (isSegwit) {
      input.witnessUtxo = {
        script: paymentVariant.output,
        value: swapVout.vSat
      }
      input.witnessScript = swapPaymentVariants.p2wsh.redeem.output // Strip the push bytes (0020) off the script
    } else {
      input.nonWitnessUtxo = Buffer.from(initiationTxRaw, 'hex')
      input.redeemScript = paymentVariant.redeem.output
    }

    const output = {
      address: addressToString(address),
      value: swapVout.vSat - txfee
    }

    psbt.addInput(input)
    psbt.addOutput(output)

    const walletAddress = await this.getMethod('getWalletAddress')(address)
    const signedPSBTHex = await this.getMethod('signPSBT')(psbt.toBase64(), [{ index: 0, derivationPath: walletAddress.derivationPath }])
    const signedPSBT = bitcoin.Psbt.fromBase64(signedPSBTHex, { network })

    const sig = signedPSBT.data.inputs[0].partialSig[0].signature

    const swapInput = this.getSwapInput(sig, walletAddress.publicKey, isClaim, secret)
    const paymentParams = { redeem: { output: swapOutput, input: swapInput, network }, network }
    const paymentWithInput = isSegwit
      ? bitcoin.payments.p2wsh(paymentParams)
      : bitcoin.payments.p2sh(paymentParams)

    const getFinalScripts = () => {
      let finalScriptSig
      let finalScriptWitness

      // create witness stack
      if (isSegwit) {
        finalScriptWitness = witnessStackToScriptWitness(paymentWithInput.witness)
      }

      if (paymentVariantName === 'p2shSegwit') {
        // Adds the necessary push OP (PUSH34 (00 + witness script hash))
        const inputScript = bitcoin.script.compile([swapPaymentVariants.p2shSegwit.redeem.output])
        finalScriptSig = inputScript
      } else if (paymentVariantName === 'p2sh') {
        finalScriptSig = paymentWithInput.input
      }

      return {
        finalScriptSig,
        finalScriptWitness
      }
    }

    psbt.finalizeInput(0, getFinalScripts)

    const hex = psbt.extractTransaction().toHex()
    await this.getMethod('sendRawTransaction')(hex)
    return normalizeTransactionObject(decodeRawTransaction(hex), txfee)
  }

  extractSwapParams (outputScript) {
    const buffer = bitcoin.script.decompile(Buffer.from(outputScript, 'hex'))
    if (buffer.length !== 20) throw new Error('Invalid swap output script')
    const secretHash = buffer[5].reverse().toString('hex')
    const recipientPublicKey = buffer[9].reverse().toString('hex')
    const expiration = parseInt(buffer[11].reverse().toString('hex'), 16)
    const refundPublicKey = buffer[16].reverse().toString('hex')
    return { recipientPublicKey, refundPublicKey, secretHash, expiration }
  }

  /**
   * Only to be used for situations where transaction is trusted. e.g to bump fee
   * DO NOT USE THIS TO VERIFY THE REDEEM
   */
  async UNSAFE_isSwapRedeemTransaction (transaction) { // eslint-disable-line
    if (transaction._raw.vin.length === 1 && transaction._raw.vout.length === 1) {
      const swapInput = transaction._raw.vin[0]
      const inputScript = this.getInputScript(swapInput)
      const initiationTransaction = await this.getMethod('getTransactionByHash')(transaction._raw.vin[0].txid)
      const scriptType = initiationTransaction._raw.vout[transaction._raw.vin[0].vout].scriptPubKey.type
      if (
        ['scripthash', 'witness_v0_scripthash'].includes(scriptType) &&
        [4, 5].includes(inputScript.length)
      ) return true
    }
    return false
  }

  async updateTransactionFee (tx, newFeePerByte) {
    const txHash = typeof tx === 'string' ? tx : tx.hash
    const transaction = await this.getMethod('getTransactionByHash')(txHash)
    if (await this.UNSAFE_isSwapRedeemTransaction(transaction)) {
      const swapInput = transaction._raw.vin[0]
      const inputScript = this.getInputScript(swapInput)
      const initiationTxHash = swapInput.txid
      const initiationTx = await this.getMethod('getTransactionByHash')(initiationTxHash)
      const swapOutput = initiationTx._raw.vout[swapInput.vout]
      const value = BigNumber(swapOutput.value).times(1e8)
      const address = transaction._raw.vout[0].scriptPubKey.addresses[0]
      const isClaim = inputScript.length === 5
      const secret = isClaim ? inputScript[2] : undefined
      const outputScript = isClaim ? inputScript[4] : inputScript[3]
      const { expiration } = this.extractSwapParams(outputScript)
      return this._redeemSwapOutput(initiationTxHash, value, address, Buffer.from(outputScript, 'hex'), expiration, isClaim, secret, newFeePerByte)
    }
    return this.getMethod('updateTransactionFee')(tx, newFeePerByte)
  }

  getInputScript (vin) {
    const inputScript = vin.txinwitness ? vin.txinwitness
      : bitcoin.script.decompile(Buffer.from(vin.scriptSig.hex, 'hex'))
        .map(b => Buffer.isBuffer(b) ? b.toString('hex') : b)
    return inputScript
  }

  doesTransactionMatchRedeem (initiationTxHash, tx, isRefund) {
    const swapInput = tx._raw.vin.find((vin) => vin.txid === initiationTxHash)
    if (!swapInput) return false
    const inputScript = this.getInputScript(swapInput)
    if (!inputScript) return false
    if (isRefund) {
      if (inputScript.length !== 4) return false
    } else {
      if (inputScript.length !== 5) return false
    }
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
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

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
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

    return this.getMethod('findSwapTransaction', false)(recipientAddress, refundAddress, secretHash, expiration, blockNumber,
      tx => this.doesTransactionMatchInitiation(tx, value, recipientAddress, refundAddress, secretHash, expiration)
    )
  }

  async findClaimSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

    const claimSwapTransaction = await this.getMethod('findSwapTransaction', false)(recipientAddress, refundAddress, secretHash, expiration, blockNumber,
      tx => this.doesTransactionMatchRedeem(initiationTxHash, tx, false)
    )

    if (claimSwapTransaction) {
      const swapInput = claimSwapTransaction._raw.vin.find((vin) => vin.txid === initiationTxHash)
      if (!swapInput) {
        throw new Error('Claim input missing')
      }
      const inputScript = this.getInputScript(swapInput)
      const secret = inputScript[2]
      validateSecretAndHash(secret, secretHash)
      return {
        ...claimSwapTransaction,
        secret
      }
    }
  }

  async findRefundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration, blockNumber) {
    this.validateSwapParams(value, recipientAddress, refundAddress, secretHash, expiration)

    const refundSwapTransaction = await this.getMethod('findSwapTransaction', false)(recipientAddress, refundAddress, secretHash, expiration, blockNumber,
      tx => this.doesTransactionMatchRedeem(initiationTxHash, tx, true)
    )
    return refundSwapTransaction
  }

  async findFundSwapTransaction (initiationTxHash, value, recipientAddress, refundAddress, secretHash, expiration) {
    return null
  }
}

BitcoinSwapProvider.version = version
