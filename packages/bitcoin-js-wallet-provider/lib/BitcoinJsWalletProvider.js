import BitcoinWalletProvider from '@liquality/bitcoin-wallet-provider'
import WalletProvider from '@liquality/wallet-provider'
import * as bitcoin from 'bitcoinjs-lib'
import * as bitcoinMessage from 'bitcoinjs-message'
import { addressToString } from '@liquality/utils'
import { mnemonicToSeed } from 'bip39'
import bip32 from 'bip32'

import { version } from '../package.json'

export default class BitcoinJsWalletProvider extends BitcoinWalletProvider(WalletProvider) {
  constructor (network, mnemonic, addressType = 'bech32') {
    super(network, addressType, [network])

    if (!mnemonic) throw new Error('Mnemonic should not be empty')

    this._mnemonic = mnemonic
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

  async keyPair (derivationPath) {
    const node = await this.seedNode()
    const wif = node.derivePath(derivationPath).toWIF()
    return bitcoin.ECPair.fromWIF(wif, this._network)
  }

  async signMessage (message, from) {
    const address = await this.getWalletAddress(from)
    const keyPair = await this.keyPair(address.derivationPath)
    const signature = bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed)
    return signature.toString('hex')
  }

  async _buildTransaction (outputs, feePerByte, fixedInputs) {
    const network = this._network

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change, fee } = await this.getInputsForAmount(outputs, feePerByte, fixedInputs)

    if (change) {
      outputs.push({
        to: unusedAddress,
        value: change.value
      })
    }

    const psbt = new bitcoin.Psbt({ network })

    const needsWitness = this._addressType === 'bech32' || this._addressType === 'p2sh-segwit'

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      const paymentVariant = this.getPaymentVariantFromPublicKey(keyPair.publicKey)

      const psbtInput = {
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

    for (const output of outputs) {
      const isScript = Buffer.isBuffer(output.to)
      const address = !isScript ? addressToString(output.to) : undefined
      const script = isScript ? output.to : undefined // Allow for OP_RETURN
      psbt.addOutput({
        value: output.value,
        address,
        script
      })
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

  async _buildSweepTransaction (externalChangeAddress, feePerByte) {
    let _feePerByte = feePerByte || false
    if (_feePerByte === false) _feePerByte = await this.getMethod('getFeePerByte')()

    const { inputs, outputs, change } = await this.getInputsForAmount([], _feePerByte, [], 100, true)

    if (change) {
      throw Error('There should not be any change for sweeping transaction')
    }

    const _outputs = [{
      to: externalChangeAddress,
      value: outputs[0].value
    }]

    return this._buildTransaction(_outputs, feePerByte, inputs)
  }

  async signPSBT (data, input, address) {
    const psbt = bitcoin.Psbt.fromBase64(data, { network: this._network })
    const wallet = await this.getWalletAddress(address)
    const keyPair = await this.keyPair(wallet.derivationPath)

    psbt.signInput(input, keyPair)
    return psbt.toBase64()
  }

  // inputs consists of [{ inputTxHex, index, vout, outputScript }]
  async signBatchP2SHTransaction (inputs, addresses, tx, lockTime = 0, segwit = false) {
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
        sigHash = tx.hashForWitnessV0(index, inputs[i].outputScript, inputs[i].vout.vSat, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
      } else {
        sigHash = tx.hashForSignature(index, inputs[i].outputScript, bitcoin.Transaction.SIGHASH_ALL)
      }

      const sig = bitcoin.script.signature.encode(keyPairs[i].sign(sigHash), bitcoin.Transaction.SIGHASH_ALL)
      sigs.push(sig)
    }

    return sigs
  }

  getScriptType () {
    if (this._addressType === 'legacy') return 'p2pkh'
    else if (this._addressType === 'p2sh-segwit') return 'p2sh-p2wpkh'
    else if (this._addressType === 'bech32') return 'p2wpkh'
  }

  async getConnectedNetwork () {
    return this._network
  }

  async isWalletAvailable () {
    return true
  }
}

BitcoinJsWalletProvider.version = version
