import { Transaction, Address, bitcoinCash, BigNumber, SwapParams, SwapProvider } from '@liquality/types'
import { Provider } from '@liquality/provider'
import {
  calculateFee,
  decodeRawTransaction,
  normalizeTransactionObject,
  getPubKeyHash,
  bitcoreCash,
  bitcoreNetworkName,
  validateAddress
} from '@liquality/bitcoin-cash-utils'
import {
  addressToString,
  validateValue,
  validateSecret,
  validateSecretHash,
  validateSecretAndHash,
  validateExpiration
} from '@liquality/utils'
import { BitcoinCashNetwork } from '@liquality/bitcoin-cash-networks'

import { script as bScript, payments } from 'bitcoinjs-lib'

interface BitcoinCashSwapProviderOptions {
  network: BitcoinCashNetwork
}

export default class BitcoinCashSwapProvider extends Provider implements Partial<SwapProvider> {
  _network: BitcoinCashNetwork

  constructor(options: BitcoinCashSwapProviderOptions) {
    super()
    const { network } = options
    this._network = network
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

  getSwapPaymentVariant(swapOutput: Buffer) {
    const p2sh = payments.p2sh({
      redeem: { output: swapOutput, network: this._network },
      network: this._network
    })

    return p2sh
  }

  async initiateSwap(swapParams: SwapParams, feePerByte: number) {
    this.validateSwapParams(swapParams)

    const swapOutput = this.getSwapOutput(swapParams)
    const address = this.getSwapPaymentVariant(swapOutput).address
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
    const swapPaymentVariant = this.getSwapPaymentVariant(swapOutput)
    const initiationTxRaw = await this.getMethod('getRawTransactionByHash')(initiationTxHash)
    const initiationTx = decodeRawTransaction(initiationTxRaw, this._network)
    let swapVout
    for (const vout of initiationTx.vout) {
      const paymentVariantEntry = swapPaymentVariant.output.toString('hex') === vout.scriptPubKey.hex
      const voutValue = new BigNumber(vout.value).times(1e8)
      if (paymentVariantEntry && voutValue.eq(new BigNumber(value))) {
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
    const { recipientPublicKey, refundPublicKey, secretHash } = this.extractSwapParams(swapOutput.toString('hex'))
    const walletAddress: Address = await this.getMethod('getWalletAddress')(address)
    const inputTx = new bitcoreCash.Transaction(initiationTxRaw)

    const signedTx: string = await this.getMethod('sweepSwapOutput')(
      {
        txid: initiationTxHash,
        outputIndex: swapVout.n,
        address: inputTx.outputs[swapVout.n].script.toAddress(bitcoreNetworkName(network)),
        script: inputTx.outputs[swapVout.n].script.toHex(),
        satoshis: inputTx.outputs[swapVout.n].satoshis
      },
      secretHash,
      recipientPublicKey,
      refundPublicKey,
      expiration,
      address,
      walletAddress,
      swapValue - txfee,
      feePerByte,
      isClaim ? Buffer.from(secret, 'hex') : undefined
    )

    await this.getMethod('sendRawTransaction')(signedTx)
    return normalizeTransactionObject(decodeRawTransaction(signedTx, this._network), txfee)
  }

  extractSwapParams(outputScript: string) {
    const buffer = bScript.decompile(Buffer.from(outputScript, 'hex')) as Buffer[]
    if (buffer.length !== 20) throw new Error('Invalid swap output script')
    const secretHash = buffer[5]
    const recipientPublicKey = buffer[9]
    const expiration = parseInt(buffer[11].toString('hex'), 16)
    const refundPublicKey = buffer[16]
    return { recipientPublicKey, refundPublicKey, secretHash, expiration }
  }

  getInputScript(vin: bitcoinCash.Input) {
    const inputScript = bScript
      .decompile(Buffer.from(vin.scriptSig.hex, 'hex'))
      .map((b) => (Buffer.isBuffer(b) ? b.toString('hex') : b))
    return inputScript as string[]
  }

  doesTransactionMatchRedeem(initiationTxHash: string, tx: Transaction<bitcoinCash.Transaction>, isRefund: boolean) {
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

  doesTransactionMatchInitiation(swapParams: SwapParams, transaction: Transaction<bitcoinCash.Transaction>) {
    const swapOutput = this.getSwapOutput(swapParams)
    const swapPaymentVariant = this.getSwapPaymentVariant(swapOutput)
    const vout = transaction._raw.vout.find(
      (vout) =>
        vout.scriptPubKey.hex == swapPaymentVariant.output.toString('hex') &&
        new BigNumber(vout.value).times(1e8).eq(new BigNumber(swapParams.value))
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
    predicate: (tx: Transaction<bitcoinCash.Transaction>) => boolean
  ) {
    swapParams as any
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
      (tx: Transaction<bitcoinCash.Transaction>) => this.doesTransactionMatchInitiation(swapParams, tx)
    )
  }

  async findClaimSwapTransaction(swapParams: SwapParams, initiationTxHash: string, blockNumber: number) {
    this.validateSwapParams(swapParams)

    const claimSwapTransaction: Transaction<bitcoinCash.Transaction> = await this.getMethod(
      'findSwapTransaction',
      false
    )(swapParams, blockNumber, (tx: Transaction<bitcoinCash.Transaction>) =>
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
      (tx: Transaction<bitcoinCash.Transaction>) => this.doesTransactionMatchRedeem(initiationTxHash, tx, true)
    )
    return refundSwapTransaction
  }

  async findFundSwapTransaction(): Promise<null> {
    return null
  }
}
