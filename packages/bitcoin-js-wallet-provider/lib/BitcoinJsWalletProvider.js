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

    const txb = new bitcoin.TransactionBuilder(network)

    for (const output of outputs) {
      const to = output.to.address === undefined ? output.to : addressToString(output.to) // Allow for OP_RETURN
      txb.addOutput(to, output.value)
    }

    const prevOutScriptType = this.getScriptType()

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      const paymentVariant = this.getPaymentVariantFromPublicKey(keyPair.publicKey)

      txb.addInput(inputs[i].txid, inputs[i].vout, 0, paymentVariant.output)
    }

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      const paymentVariant = this.getPaymentVariantFromPublicKey(keyPair.publicKey)
      const needsWitness = this._addressType === 'bech32' || this._addressType === 'p2sh-segwit'

      const signParams = { prevOutScriptType, vin: i, keyPair }

      if (needsWitness) {
        signParams.witnessValue = inputs[i].value
      }

      if (this._addressType === 'p2sh-segwit') {
        signParams.redeemScript = paymentVariant.redeem.output
      }

      txb.sign(signParams)
    }

    return { hex: txb.build().toHex(), fee }
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

  async signP2SHTransaction (inputTxHex, txHex, address, vout, outputScript, lockTime = 0, segwit = false) {
    const wallet = await this.getWalletAddress(address)
    const keyPair = await this.keyPair(wallet.derivationPath)

    const inputTx = bitcoin.Transaction.fromHex(inputTxHex)
    const tx = bitcoin.Transaction.fromHex(txHex)

    let sigHash

    if (segwit) {
      sigHash = tx.hashForWitnessV0(0, Buffer.from(outputScript, 'hex'), inputTx.outs[vout].value, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
    } else {
      sigHash = tx.hashForSignature(0, Buffer.from(outputScript, 'hex'), bitcoin.Transaction.SIGHASH_ALL)
    }

    const sig = bitcoin.script.signature.encode(keyPair.sign(sigHash), bitcoin.Transaction.SIGHASH_ALL)
    return sig.toString('hex')
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
