import { Transaction, Address, bitcoin, BigNumber, SwapParams, SwapProvider } from '@liquality/types'
import { Provider } from '@liquality/provider'
import {
  calculateFee,
  decodeRawTransaction,
  normalizeTransactionObject,
  witnessStackToScriptWitness,
  getPubKeyHash,
  validateAddress,
  psbtToHexTransactionBitcoinCash,
  addrToBitcoinJS
} from '@liquality/bitcoin-utils'
import {
  addressToString,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash,
  validateExpiration
} from '@liquality/utils'
import { BitcoinNetwork, ProtocolType } from '@liquality/bitcoin-networks'

import { Psbt, script as bScript, payments } from 'bitcoinjs-lib'

interface BitcoinSwapProviderOptions {
  network: BitcoinNetwork
  mode?: bitcoin.SwapMode
}

export default class BitcoinSwapProvider extends Provider implements Partial<SwapProvider> {
  _network: BitcoinNetwork
  _mode: bitcoin.SwapMode

  constructor(options: BitcoinSwapProviderOptions) {
    super()
    const { network, mode = network.segwitCapable ? bitcoin.SwapMode.P2WSH : bitcoin.SwapMode.P2SH } = options
    const swapModes = Object.values(bitcoin.SwapMode)
    if (!swapModes.includes(mode)) {
      throw new Error(`Mode must be one of ${swapModes.join(',')}`)
    }
    if (!network.segwitCapable && mode != bitcoin.SwapMode.P2SH) {
      throw new Error('SegWit P2SH on SegWit-incompatible network')
    }
    this._network = network
    this._mode = mode
  }

  validateSwapParams(swapParams: SwapParams) {
    validateValue(swapParams.value)
    validateAddress(swapParams.recipientAddress, this._network)
    validateAddress(swapParams.refundAddress, this._network)
    validateSecretHash(swapParams.secretHash)
    validateExpiration(swapParams.expiration)
  }

  getSwapOutput(swapParams: SwapParams) {
    this.validateSwapParams(swapParams)

    const secretHashBuff = Buffer.from(swapParams.secretHash, 'hex')
    const recipientPubKeyHash = getPubKeyHash(addressToString(swapParams.recipientAddress), this._network)
    const refundPubKeyHash = getPubKeyHash(addressToString(swapParams.refundAddress), this._network)
    const OPS = bScript.OPS

    const script = bScript.compile([
      OPS.OP_IF,
      OPS.OP_SIZE,
      bScript.number.encode(32),
      OPS.OP_EQUALVERIFY,
      OPS.OP_SHA256,
      secretHashBuff,
      OPS.OP_EQUALVERIFY,
      OPS.OP_DUP,
      OPS.OP_HASH160,
      recipientPubKeyHash,
      OPS.OP_ELSE,
      bScript.number.encode(swapParams.expiration),
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

  getSwapInput(sig: Buffer, pubKey: Buffer, isClaim: boolean, secret?: string) {
    const OPS = bScript.OPS
    const redeem = isClaim ? OPS.OP_TRUE : OPS.OP_FALSE
    const secretParams = isClaim ? [Buffer.from(secret, 'hex')] : []

    return bScript.compile([sig, pubKey, ...secretParams, redeem])
  }

  getSwapPaymentVariants(swapOutput: Buffer) {
    const p2wsh = payments.p2wsh({
      redeem: { output: swapOutput, network: this._network },
      network: this._network
    })
    const p2shSegwit = payments.p2sh({
      redeem: p2wsh,
      network: this._network
    })
    const p2sh = payments.p2sh({
      redeem: { output: swapOutput, network: this._network },
      network: this._network
    })

    return {
      [bitcoin.SwapMode.P2WSH]: p2wsh,
      [bitcoin.SwapMode.P2SH_SEGWIT]: p2shSegwit,
      [bitcoin.SwapMode.P2SH]: p2sh
    }
  }

  async initiateSwap(swapParams: SwapParams, feePerByte: number) {
    this.validateSwapParams(swapParams)

    const swapOutput = this.getSwapOutput(swapParams)
    const address = this.getSwapPaymentVariants(swapOutput)[this._mode].address
    return this.client.chain.sendTransaction({
      to: address,
      value: swapParams.value,
      fee: feePerByte
    })
  }

  async fundSwap(): Promise<null> {
    return null
  }

  async claimSwap(swapParams: SwapParams, initiationTxHash: string, secret: string, feePerByte: number) {
    this.validateSwapParams(swapParams)
    validateSecret(secret)
    validateSecretAndHash(secret, swapParams.secretHash)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    return this._redeemSwap(swapParams, initiationTxHash, true, secret, feePerByte)
  }

  async refundSwap(swapParams: SwapParams, initiationTxHash: string, feePerByte: number) {
    this.validateSwapParams(swapParams)
    await this.verifyInitiateSwapTransaction(swapParams, initiationTxHash)

    return this._redeemSwap(swapParams, initiationTxHash, false, undefined, feePerByte)
  }

  async _redeemSwap(
    swapParams: SwapParams,
    initiationTxHash: string,
    isClaim: boolean,
    secret: string,
    feePerByte: number
  ) {
    const address = isClaim ? swapParams.recipientAddress : swapParams.refundAddress
    const swapOutput = this.getSwapOutput(swapParams)
    return this._redeemSwapOutput(
      initiationTxHash,
      swapParams.value,
      addressToString(address),
      swapOutput,
      swapParams.expiration,
      isClaim,
      secret,
      feePerByte
    )
  }

  async _redeemSwapOutput(
    initiationTxHash: string,
    value: BigNumber,
    address: string,
    swapOutput: Buffer,
    expiration: number,
    isClaim: boolean,
    secret: string,
    _feePerByte: number
  ) {
    const network = this._network
    const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput)

    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = decodeRawTransaction(initiationTxRaw, this._network)

    let swapVout: bitcoin.Output
    let paymentVariantName: string
    let paymentVariant: payments.Payment
    for (const vout of initiationTx.vout) {
      const paymentVariantEntry = Object.entries(swapPaymentVariants).find(
        ([, payment]) => payment.output.toString('hex') === vout.scriptPubKey.hex
      )
      const voutValue = new BigNumber(vout.value).times(1e8)
      if (paymentVariantEntry && voutValue.eq(new BigNumber(value))) {
        paymentVariantName = paymentVariantEntry[0]
        paymentVariant = paymentVariantEntry[1]
        swapVout = vout
      }
    }

    if (!swapVout) {
      throw new Error('Valid swap output not found')
    }

    const feePerByte = _feePerByte || (await this.getMethod('getFeePerByte')())

    // TODO: Implement proper fee calculation that counts bytes in inputs and outputs
    const txfee = calculateFee(1, 1, feePerByte)
    const swapValue = new BigNumber(swapVout.value).times(1e8).toNumber()

    if (swapValue - txfee < 0) {
      throw new Error('Transaction amount does not cover fee.')
    }

    const input: any = {
      hash: initiationTxHash,
      index: swapVout.n,
      value: swapValue,
      sequence: 0
    }

    const output = {
      address: addrToBitcoinJS(address, network),
      value: swapValue - txfee
    }

    const psbt = new Psbt({ network })

    if (!isClaim) {
      psbt.setLocktime(expiration)
    }

    const isSegwit =
      paymentVariantName === bitcoin.SwapMode.P2WSH || paymentVariantName === bitcoin.SwapMode.P2SH_SEGWIT

    if (isSegwit) {
      input.witnessUtxo = {
        script: paymentVariant.output,
        value: swapValue
      }
      input.witnessScript = swapPaymentVariants.p2wsh.redeem.output // Strip the push bytes (0020) off the script
    } else {
      input.nonWitnessUtxo = Buffer.from(initiationTxRaw, 'hex')
      input.redeemScript = paymentVariant.redeem.output
    }

    psbt.addInput(input)
    psbt.addOutput(output)

    const walletAddress: Address = await this.getMethod('getWalletAddress')(address)
    const signedPSBTHex: string = await this.getMethod('signPSBT')(psbt.toBase64(), [
      { index: 0, derivationPath: walletAddress.derivationPath }
    ])
    const signedPSBT = Psbt.fromBase64(signedPSBTHex, { network })

    const sig = signedPSBT.data.inputs[0].partialSig[0].signature

    const swapInput = this.getSwapInput(sig, Buffer.from(walletAddress.publicKey, 'hex'), isClaim, secret)
    const paymentParams = { redeem: { output: swapOutput, input: swapInput, network }, network }
    const paymentWithInput = isSegwit ? payments.p2wsh(paymentParams) : payments.p2sh(paymentParams)

    const getFinalScripts = () => {
      let finalScriptSig
      let finalScriptWitness

      // create witness stack
      if (isSegwit) {
        finalScriptWitness = witnessStackToScriptWitness(paymentWithInput.witness)
      }

      if (paymentVariantName === bitcoin.SwapMode.P2SH_SEGWIT) {
        // Adds the necessary push OP (PUSH34 (00 + witness script hash))
        const inputScript = bScript.compile([swapPaymentVariants.p2shSegwit.redeem.output])
        finalScriptSig = inputScript
      } else if (paymentVariantName === bitcoin.SwapMode.P2SH) {
        finalScriptSig = paymentWithInput.input
      }

      return {
        finalScriptSig,
        finalScriptWitness
      }
    }

    let hex
    if (network.protocolType == ProtocolType.BitcoinCash) {
      hex = psbtToHexTransactionBitcoinCash(signedPSBT.toHex(), [getFinalScripts])
    } else {
      psbt.finalizeInput(0, getFinalScripts)
      hex = psbt.extractTransaction().toHex()
    }
    await this.getMethod('sendRawTransaction')(hex)
    return normalizeTransactionObject(decodeRawTransaction(hex, this._network), txfee)
  }

  extractSwapParams(outputScript: string) {
    const buffer = bScript.decompile(Buffer.from(outputScript, 'hex')) as Buffer[]
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
  async UNSAFE_isSwapRedeemTransaction(transaction: Transaction<bitcoin.Transaction>) {
    // eslint-disable-line
    if (transaction._raw.vin.length === 1 && transaction._raw.vout.length === 1) {
      const swapInput = transaction._raw.vin[0]
      const inputScript = this.getInputScript(swapInput)
      const initiationTransaction: Transaction<bitcoin.Transaction> = await this.getMethod('getTransactionByHash')(
        transaction._raw.vin[0].txid
      )
      const scriptType = initiationTransaction._raw.vout[transaction._raw.vin[0].vout].scriptPubKey.type
      if (['scripthash', 'witness_v0_scripthash'].includes(scriptType) && [4, 5].includes(inputScript.length))
        return true
    }
    return false
  }

  async updateTransactionFee(tx: Transaction<bitcoin.Transaction> | string, newFeePerByte: number) {
    if (!this._network.feeBumpCapable) {
      throw new Error('This coin does not support fee bumping')
    }
    const txHash = typeof tx === 'string' ? tx : tx.hash
    const transaction: Transaction<bitcoin.Transaction> = await this.getMethod('getTransactionByHash')(txHash)
    if (await this.UNSAFE_isSwapRedeemTransaction(transaction)) {
      const swapInput = transaction._raw.vin[0]
      const inputScript = this.getInputScript(swapInput)
      const initiationTxHash = swapInput.txid
      const initiationTx: Transaction<bitcoin.Transaction> = await this.getMethod('getTransactionByHash')(
        initiationTxHash
      )
      const swapOutput = initiationTx._raw.vout[swapInput.vout]
      const value = new BigNumber(swapOutput.value).times(1e8)
      const address = transaction._raw.vout[0].scriptPubKey.addresses[0]
      const isClaim = inputScript.length === 5
      const secret = isClaim ? inputScript[2] : undefined
      const outputScript = isClaim ? inputScript[4] : inputScript[3]
      const { expiration } = this.extractSwapParams(outputScript)
      return this._redeemSwapOutput(
        initiationTxHash,
        value,
        address,
        Buffer.from(outputScript, 'hex'),
        expiration,
        isClaim,
        secret,
        newFeePerByte
      )
    }
    return this.getMethod('updateTransactionFee')(tx, newFeePerByte)
  }

  getInputScript(vin: bitcoin.Input) {
    const inputScript = vin.txinwitness
      ? vin.txinwitness
      : bScript
          .decompile(Buffer.from(vin.scriptSig.hex, 'hex'))
          .map((b) => (Buffer.isBuffer(b) ? b.toString('hex') : b))
    return inputScript as string[]
  }

  doesTransactionMatchRedeem(initiationTxHash: string, tx: Transaction<bitcoin.Transaction>, isRefund: boolean) {
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

  doesTransactionMatchInitiation(swapParams: SwapParams, transaction: Transaction<bitcoin.Transaction>) {
    const swapOutput = this.getSwapOutput(swapParams)
    const swapPaymentVariants = this.getSwapPaymentVariants(swapOutput)
    const vout = transaction._raw.vout.find((vout) =>
      Object.values(swapPaymentVariants).find(
        (payment) =>
          payment.output.toString('hex') === vout.scriptPubKey.hex &&
          new BigNumber(vout.value).times(1e8).eq(new BigNumber(swapParams.value))
      )
    )
    return Boolean(vout)
  }

  async verifyInitiateSwapTransaction(swapParams: SwapParams, initiationTxHash: string) {
    this.validateSwapParams(swapParams)

    const initiationTransaction = await this.getMethod('getTransactionByHash')(initiationTxHash)
    return this.doesTransactionMatchInitiation(swapParams, initiationTransaction)
  }

  async findSwapTransaction(
    swapParams: SwapParams,
    blockNumber: number,
    predicate: (tx: Transaction<bitcoin.Transaction>) => boolean
  ) {
    // TODO: Are mempool TXs possible?
    const block = await this.getMethod('getBlockByNumber')(blockNumber, true)
    const swapTransaction = block.transactions.find(predicate)
    return swapTransaction
  }

  async findInitiateSwapTransaction(swapParams: SwapParams, blockNumber: number) {
    this.validateSwapParams(swapParams)

    return this.getMethod('findSwapTransaction', false)(
      swapParams,
      blockNumber,
      (tx: Transaction<bitcoin.Transaction>) => this.doesTransactionMatchInitiation(swapParams, tx)
    )
  }

  async findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const claimSwapTransaction: Transaction<bitcoin.Transaction> = await this.getMethod(
      'findSwapTransaction',
      false
    )(swapParams, blockNumber, (tx: Transaction<bitcoin.Transaction>) =>
      this.doesTransactionMatchRedeem(initiationTxHash, tx, false)
    )

    if (claimSwapTransaction) {
      const swapInput = claimSwapTransaction._raw.vin.find((vin) => vin.txid === initiationTxHash)
      if (!swapInput) {
        throw new Error('Claim input missing')
      }
      const inputScript = this.getInputScript(swapInput)
      const secret = inputScript[2] as string
      validateSecretAndHash(secret, swapParams.secretHash)
      return {
        ...claimSwapTransaction,
        secret
      }
    }
  }

  async findRefundSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const refundSwapTransaction = await this.getMethod('findSwapTransaction', false)(
      swapParams,
      blockNumber,
      (tx: Transaction<bitcoin.Transaction>) => this.doesTransactionMatchRedeem(initiationTxHash, tx, true)
    )
    return refundSwapTransaction
  }

  async findFundSwapTransaction(): Promise<null> {
    return null
  }
}
