import BitcoinWalletProvider from '@liquality/bitcoin-wallet-provider'
import WalletProvider from '@liquality/wallet-provider'
import { BitcoinNetwork } from '@liquality/bitcoin-networks'
import { bitcoin, BigNumber } from '@liquality/types'

import { Psbt, ECPair, ECPairInterface, Transaction as BitcoinJsTransaction, script } from 'bitcoinjs-lib'
import * as bitcoinMessage from 'bitcoinjs-message'
import { mnemonicToSeed } from 'bip39'
import bip32, { BIP32Interface } from 'bip32'

type WalletProviderConstructor<T = WalletProvider> = new (...args: any[]) => T

interface BitcoinJsWalletProviderOptions {
  network: BitcoinNetwork,
  addressType: bitcoin.AddressType,
  mnemonic: string
}

export default class BitcoinJsWalletProvider extends BitcoinWalletProvider(WalletProvider as WalletProviderConstructor) {
  _mnemonic: string
  _seedNode: BIP32Interface
  _baseDerivationNode: BIP32Interface

  constructor (options: BitcoinJsWalletProviderOptions) {
    const { network, addressType = bitcoin.AddressType.BECH32 } = options
    super({ network, addressType })

    if (!options.mnemonic) throw new Error('Mnemonic should not be empty')

    this._mnemonic = options.mnemonic
  }

  async seedNode () {
    if (this._seedNode) return this._seedNode

    const seed = await mnemonicToSeed(this._mnemonic)
    this._seedNode = bip32.fromSeed(seed, this._network)

    return this._seedNode
  }

  async baseDerivationNode () {
    if (this._baseDerivationNode) return this._baseDerivationNode

    const baseNode = await this.seedNode()
    this._baseDerivationNode = baseNode.derivePath(this._baseDerivationPath)

    return this._baseDerivationNode
  }

  async keyPair (derivationPath: string): Promise<ECPairInterface> {
    const node = await this.seedNode()
    const wif = node.derivePath(derivationPath).toWIF()
    return ECPair.fromWIF(wif, this._network)
  }

  async signMessage (message: string, from: string) {
    const address = await this.getWalletAddress(from)
    const keyPair = await this.keyPair(address.derivationPath)
    const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed)
    return signature.toString('hex')
  }

  async _buildTransaction (targets: bitcoin.OutputTarget[], feePerByte?: BigNumber, fixedInputs?: bitcoin.Input[]) {
    const network = this._network

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change, fee } = await this.getInputsForAmount(targets, feePerByte, fixedInputs)

    if (change) {
      targets.push({
        address: unusedAddress.address,
        value: change.value
      })
    }

    const psbt = new Psbt({ network })

    const needsWitness = this._addressType === 'bech32' || this._addressType === 'p2sh-segwit'

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      const paymentVariant = this.getPaymentVariantFromPublicKey(keyPair.publicKey)

      const psbtInput : any = {
        hash: inputs[i].txid,
        index: inputs[i].vout,
        sequence: 0
      }

      if (needsWitness) {
        psbtInput.witnessUtxo = {
          script: paymentVariant.output,
          value: inputs[i].value
        }
      } else {
        const inputTx = await this.getMethod('getRawTransactionByHash')(inputs[i].txid, true)
        psbtInput.nonWitnessUtxo = Buffer.from(inputTx._raw.hex, 'hex')
      }

      if (this._addressType === 'p2sh-segwit') {
        psbtInput.redeemScript = paymentVariant.redeem.output
      }

      psbt.addInput(psbtInput)
    }

    for (const output of targets) {
      psbt.addOutput(output)
    }

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      psbt.signInput(i, keyPair)
      psbt.validateSignaturesOfInput(i)
    }

    psbt.finalizeAllInputs()

    return { hex: psbt.extractTransaction().toHex(), fee }
  }

  async _buildSweepTransaction (externalChangeAddress: string, feePerByte: BigNumber) {
    let _feePerByte = feePerByte || null
    if (!_feePerByte) _feePerByte = await this.getMethod('getFeePerByte')()

    const { inputs, outputs, change } = await this.getInputsForAmount([], _feePerByte, [], 100, true)

    if (change) {
      throw new Error('There should not be any change for sweeping transaction')
    }

    const _outputs = [{
      address: externalChangeAddress,
      value: outputs[0].value
    }]

    // @ts-ignore
    return this._buildTransaction(_outputs, feePerByte, inputs)
  }

  // inputs consists of [{ index, derivationPath }]
  async signPSBT (data: string, inputs: bitcoin.PsbtInputTarget[]) {
    const psbt = Psbt.fromBase64(data, { network: this._network })
    for (const input of inputs) {
      const keyPair = await this.keyPair(input.derivationPath)
      psbt.signInput(input.index, keyPair)
    }
    return psbt.toBase64()
  }

  // inputs consists of [{ inputTxHex, index, vout, outputScript }]
  async signBatchP2SHTransaction (inputs: [{ inputTxHex: string, index: number, vout: any, outputScript: Buffer, txInputIndex?: number }], addresses: string, tx: any, lockTime?: number, segwit?: boolean) {
    let keyPairs = []
    for (const address of addresses) {
      const wallet = await this.getWalletAddress(address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      keyPairs.push(keyPair)
    }

    let sigs = []
    for (let i = 0; i < inputs.length; i++) {
      const index = inputs[i].txInputIndex ? inputs[i].txInputIndex : inputs[i].index
      let sigHash
      if (segwit) {
        sigHash = tx.hashForWitnessV0(index, inputs[i].outputScript, inputs[i].vout.vSat, BitcoinJsTransaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
      } else {
        sigHash = tx.hashForSignature(index, inputs[i].outputScript, BitcoinJsTransaction.SIGHASH_ALL)
      }

      const sig = script.signature.encode(keyPairs[i].sign(sigHash), BitcoinJsTransaction.SIGHASH_ALL)
      sigs.push(sig)
    }

    return sigs
  }

  getScriptType () {
    if (this._addressType === bitcoin.AddressType.LEGACY) return 'p2pkh'
    else if (this._addressType === bitcoin.AddressType.P2SH_SEGWIT) return 'p2sh-p2wpkh'
    else if (this._addressType === bitcoin.AddressType.BECH32) return 'p2wpkh'
  }

  async getConnectedNetwork () {
    return this._network
  }

  async isWalletAvailable () {
    return true
  }
}

