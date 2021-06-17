import { BitcoinWalletProvider } from '@liquality/bitcoin-wallet-provider'
import { WalletProvider } from '@liquality/wallet-provider'
import { BitcoinNetwork, ProtocolType } from '@liquality/bitcoin-networks'
import { addrToBitcoinJS, addrFromBitcoinJS, txApplyBitcoinCashSighash } from '@liquality/bitcoin-utils'
import { bitcoin } from '@liquality/types'

import { Psbt, ECPair, ECPairInterface, Transaction as BitcoinJsTransaction, script, address } from 'bitcoinjs-lib'
import { signAsync as signBitcoinMessage } from 'bitcoinjs-message'
import { mnemonicToSeed } from 'bip39'
import { BIP32Interface, fromSeed } from 'bip32'

type WalletProviderConstructor<T = WalletProvider> = new (...args: any[]) => T

interface BitcoinJsWalletProviderOptions {
  network: BitcoinNetwork
  mnemonic: string
  baseDerivationPath: string
  addressType?: bitcoin.AddressType
}

export default class BitcoinJsWalletProvider extends BitcoinWalletProvider(
  WalletProvider as WalletProviderConstructor
) {
  _mnemonic: string
  _seedNode: BIP32Interface
  _baseDerivationNode: BIP32Interface

  constructor(options: BitcoinJsWalletProviderOptions) {
    const {
      network,
      mnemonic,
      baseDerivationPath,
      addressType = network.segwitCapable ? bitcoin.AddressType.BECH32 : bitcoin.AddressType.LEGACY
    } = options
    super({
      network,
      baseDerivationPath,
      addressType
    })

    if (!mnemonic) throw new Error('Mnemonic should not be empty')

    this._mnemonic = mnemonic
  }

  async seedNode() {
    if (this._seedNode) return this._seedNode

    const seed = await mnemonicToSeed(this._mnemonic)
    this._seedNode = fromSeed(seed, this._network)

    return this._seedNode
  }

  async baseDerivationNode() {
    if (this._baseDerivationNode) return this._baseDerivationNode

    const baseNode = await this.seedNode()
    this._baseDerivationNode = baseNode.derivePath(this._baseDerivationPath)

    return this._baseDerivationNode
  }

  async keyPair(derivationPath: string): Promise<ECPairInterface> {
    const node = await this.seedNode()
    const wif = node.derivePath(derivationPath).toWIF()
    return ECPair.fromWIF(wif, this._network)
  }

  async signMessage(message: string, from: string) {
    const address = await this.getWalletAddress(from)
    const keyPair = await this.keyPair(address.derivationPath)
    const signature = await signBitcoinMessage(message, keyPair.privateKey, keyPair.compressed)
    return signature.toString('hex')
  }

  async _buildTransaction(targets: bitcoin.OutputTarget[], feePerByte?: number, fixedInputs?: bitcoin.Input[]) {
    const network = this._network as BitcoinNetwork

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change, fee } = await this.getInputsForAmount(targets, feePerByte, fixedInputs)

    if (change) {
      targets.push({
        address: unusedAddress.address,
        value: change.value
      })
    }

    const psbt = new Psbt({ network })

    const needsWitness = [bitcoin.AddressType.BECH32, bitcoin.AddressType.P2SH_SEGWIT].includes(this._addressType)

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      const paymentVariant = this.getPaymentVariantFromPublicKey(keyPair.publicKey)

      const psbtInput: any = {
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
        const inputTxRaw = await this.getMethod('getRawTransactionByHash')(inputs[i].txid)
        psbtInput.nonWitnessUtxo = Buffer.from(inputTxRaw, 'hex')
      }

      if (this._addressType === bitcoin.AddressType.P2SH_SEGWIT) {
        psbtInput.redeemScript = paymentVariant.redeem.output
      }

      psbt.addInput(psbtInput)
    }

    const outputs = targets
    for (let i = 0; i < outputs.length; i++) {
      outputs[i].address = addrToBitcoinJS(outputs[i].address, network)
    }

    for (const output of outputs) {
      psbt.addOutput(output)
    }

    if (network.useBitcoinJSSign) {
      for (let i = 0; i < inputs.length; i++) {
        const wallet = await this.getWalletAddress(inputs[i].address)
        const keyPair = await this.keyPair(wallet.derivationPath)
        psbt.signInput(i, keyPair)
        psbt.validateSignaturesOfInput(i)
      }

      psbt.finalizeAllInputs()

      return { hex: psbt.extractTransaction().toHex(), fee }
    }

    // This code is only for BCH
    const inputInfo: { inputTxHex: string; index: number; vout: any; outputScript: Buffer }[] = []
    const inputAddressInfo: string[] = []
    for (let i = 0; i < inputs.length; i++) {
      inputInfo.push({
        inputTxHex: '',
        index: i,
        vout: { vSat: inputs[i].value },
        outputScript: address.toOutputScript(addrToBitcoinJS(inputs[i].address, this._network), this._network as any)
      })
      inputAddressInfo.push(inputs[i].address)
    }

    const sigs = await this.signBatchP2SHTransaction(inputInfo, inputAddressInfo, (psbt as any).__CACHE.__TX, 0)
    const psbt2 = psbt.clone()

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      sigs[i][sigs[i].length - 1] = 3
      const partialSig = [
        {
          pubkey: keyPair.publicKey,
          // Pass by REFERENCE
          signature: Buffer.from(sigs[i])
        }
      ]
      psbt.data.updateInput(i, { partialSig })

      sigs[i][sigs[i].length - 1] = 2
      const partialSig2 = [
        {
          pubkey: keyPair.publicKey,
          signature: sigs[i]
        }
      ]
      psbt2.data.updateInput(i, { partialSig: partialSig2 })
    }

    psbt.finalizeAllInputs()
    psbt2.finalizeAllInputs()

    const hex = psbt.extractTransaction().toHex()
    const hex2 = psbt2.extractTransaction().toHex()

    return {
      hex: txApplyBitcoinCashSighash(hex, hex2, network.protocolType == ProtocolType.BitcoinCash ? '41' : '01'),
      fee
    }
  }

  async _buildSweepTransaction(externalChangeAddress: string, feePerByte: number) {
    let _feePerByte = feePerByte || null
    if (!_feePerByte) _feePerByte = await this.getMethod('getFeePerByte')()

    const { inputs, outputs, change } = await this.getInputsForAmount([], _feePerByte, [], 100, true)

    if (change) {
      throw new Error('There should not be any change for sweeping transaction')
    }

    const _outputs = [
      {
        address: externalChangeAddress,
        value: outputs[0].value
      }
    ]

    // @ts-ignore
    return this._buildTransaction(_outputs, feePerByte, inputs)
  }

  async signPSBT(data: string, inputs: bitcoin.PsbtInputTarget[]) {
    const psbt = Psbt.fromBase64(data, { network: this._network })

    if (this._network.useBitcoinJSSign) {
      for (const input of inputs) {
        const keyPair = await this.keyPair(input.derivationPath)
        psbt.signInput(input.index, keyPair)
      }
      return psbt.toBase64()
    }

    // This code is only for BCH
    const inputInfo: { inputTxHex: string; index: number; vout: any; outputScript: Buffer }[] = []
    const inputAddressInfo: string[] = []
    for (let i = 0; i < inputs.length; i++) {
      if (!psbt.data.inputs[inputs[i].index].witnessUtxo) {
        const funder = BitcoinJsTransaction.fromBuffer(psbt.data.inputs[inputs[i].index].nonWitnessUtxo)
        const outputIndex = (psbt as any).__CACHE.__TX.ins[inputs[i].index].index
        psbt.data.inputs[inputs[i].index].witnessUtxo = funder.outs[outputIndex]
      }

      const output = psbt.data.inputs[inputs[i].index].witnessUtxo.script
      const isP2SH = output.length == 23 && output[0] == 0xa9 && output[1] == 0x14 && output[22] == 0x87

      inputInfo.push({
        inputTxHex: '',
        index: inputs[i].index,
        vout: { vSat: psbt.data.inputs[inputs[i].index].witnessUtxo.value },
        outputScript: isP2SH ? psbt.data.inputs[inputs[i].index].redeemScript : output
      })
      const keyPair = await this.keyPair(inputs[i].derivationPath)
      const { address } = this.getPaymentVariantFromPublicKey(keyPair.publicKey)
      inputAddressInfo.push(address)
    }

    const sigs = await this.signBatchP2SHTransaction(inputInfo, inputAddressInfo, (psbt as any).__CACHE.__TX, 0)

    // Encode twice with different allowed sighashes
    // to locate them in the final hex and replace
    // them with the BTC-incompatible SigHash
    // which BitcoinJS does not let us encode
    const psbt2 = psbt.clone()

    for (let i = 0; i < inputs.length; i++) {
      const keyPair = await this.keyPair(inputs[i].derivationPath)
      sigs[i][sigs[i].length - 1] = 3
      const partialSig = [
        {
          pubkey: keyPair.publicKey,
          // Pass by REFERENCE
          signature: Buffer.from(sigs[i])
        }
      ]
      psbt.data.updateInput(inputs[i].index, { partialSig })

      sigs[i][sigs[i].length - 1] = 2
      const partialSig2 = [
        {
          pubkey: keyPair.publicKey,
          signature: sigs[i]
        }
      ]
      psbt2.data.updateInput(inputs[i].index, { partialSig: partialSig2 })
    }

    const hex = psbt.toHex()
    const hex2 = psbt2.toHex()

    return Psbt.fromHex(
      txApplyBitcoinCashSighash(hex, hex2, this._network.protocolType == ProtocolType.BitcoinCash ? '41' : '01')
    ).toBase64()
  }

  async signBatchP2SHTransaction(
    inputs: { inputTxHex: string; index: number; vout: any; outputScript: Buffer; txInputIndex?: number }[],
    addresses: string[],
    tx: any,
    lockTime?: number,
    segwit?: boolean
  ) {
    const keyPairs = []
    for (const address of addresses) {
      const wallet = await this.getWalletAddress(addrFromBitcoinJS(address, this._network as BitcoinNetwork))
      const keyPair = await this.keyPair(wallet.derivationPath)
      keyPairs.push(keyPair)
    }

    const sigs = []
    for (let i = 0; i < inputs.length; i++) {
      const index = inputs[i].txInputIndex ? inputs[i].txInputIndex : inputs[i].index

      let sigHashId = BitcoinJsTransaction.SIGHASH_ALL
      if (this._network.protocolType == ProtocolType.BitcoinCash) sigHashId |= 0x40

      let sigHash
      if (segwit || this._network.protocolType == ProtocolType.BitcoinCash) {
        sigHash = tx.hashForWitnessV0(index, inputs[i].outputScript, inputs[i].vout.vSat, sigHashId)
      } else {
        sigHash = tx.hashForSignature(index, inputs[i].outputScript, BitcoinJsTransaction.SIGHASH_ALL)
      }

      const sig = script.signature.encode(keyPairs[i].sign(sigHash), BitcoinJsTransaction.SIGHASH_ALL)

      if (this._network.protocolType == ProtocolType.BitcoinCash) {
        // Having bypassed BitcoinJS sanity checks
        sig[sig.length - 1] |= 0x40
      }

      sigs.push(sig)
    }

    return sigs
  }

  getScriptType() {
    if (this._addressType === bitcoin.AddressType.LEGACY) return 'p2pkh'
    else if (this._addressType === bitcoin.AddressType.P2SH_SEGWIT) return 'p2sh-p2wpkh'
    else if (this._addressType === bitcoin.AddressType.BECH32) return 'p2wpkh'
  }

  async getConnectedNetwork() {
    return this._network
  }

  async isWalletAvailable() {
    return true
  }

  canUpdateFee() {
    return this._network.feeBumpCapable
  }
}
