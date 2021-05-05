import { BitcoinCashWalletProvider } from '../../bitcoin-cash-wallet-provider' //'@liquality/bitcoin-cash-wallet-provider'
import { WalletProvider } from '@liquality/wallet-provider'
import { BitcoinCashNetwork } from '../../bitcoin-cash-networks' //'@liquality/bitcoin-cash-networks'
import { bitcoinCash, Address } from '@liquality/types'

import { ECPair, ECPairInterface } from 'bitcoinjs-lib'
import { signAsync as signBitcoinMessage } from 'bitcoinjs-message'
import { mnemonicToSeed } from 'bip39'
import { BIP32Interface, fromSeed } from 'bip32'
import { bitcoreCash, bitcoreNetworkName, constructSweepSwap } from '../../bitcoin-cash-utils' // '@liquidity/bitcoin-cash-utils'

type WalletProviderConstructor<T = WalletProvider> = new (...args: any[]) => T

interface BitcoinCashJsWalletProviderOptions {
  network: BitcoinCashNetwork
  mnemonic: string
}

export default class BitcoinCashJsWalletProvider extends BitcoinCashWalletProvider(
  WalletProvider as WalletProviderConstructor
) {
  _mnemonic: string
  _seedNode: BIP32Interface
  _baseDerivationNode: BIP32Interface

  constructor(options: BitcoinCashJsWalletProviderOptions) {
    const { network, mnemonic } = options
    super({ network })

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

  async _buildTransaction(targets: bitcoinCash.OutputTarget[], feePerByte?: number, fixedInputs?: bitcoinCash.Input[]) {
    const network = this._network

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change, fee } = await this.getInputsForAmount(targets, feePerByte, fixedInputs)

    if (change) {
      targets.push({
        address: unusedAddress.address,
        value: change.value
      })
    }

    let tx = new bitcoreCash.Transaction()
    if (feePerByte) {
      tx = tx.feePerByte(feePerByte)
    }

    const privateKeys: bitcoreCash.PrivateKey[] = []
    const node = await this.seedNode()

    for (let i = 0; i < inputs.length; i++) {
      const wallet = await this.getWalletAddress(inputs[i].address)
      const wif = node.derivePath(wallet.derivationPath).toWIF()
      privateKeys.push(new bitcoreCash.PrivateKey(wif))

      const inputTxRaw = await this.getMethod('getRawTransactionByHash')(inputs[i].txid)
      const inputTx = new bitcoreCash.Transaction(inputTxRaw)

      tx = tx.from([
        // @ts-ignore
        {
          txId: inputs[i].txid,
          outputIndex: inputs[i].vout,
          address: inputTx.outputs[inputs[i].vout].script.toAddress(bitcoreNetworkName(network)),
          script: inputTx.outputs[inputs[i].vout].script,
          satoshis: inputTx.outputs[inputs[i].vout].satoshis
        }
      ])
      // Alternative
      /*let out = new bitcoreCash.Transaction.Output({
        script: inputTx.outputs[inputs[i].vout].script,
        satoshis: inputTx.outputs[inputs[i].vout].satoshis
      });
      tx.addInput(new bitcoreCash.Transaction.Input.PublicKeyHash(
        {
          output: out,
          prevTxId: inputs[i].txid,
          outputIndex: inputs[i].vout,
          script: bitcoreCash.Script.empty()
        }
      ))*/
    }

    for (const output of targets) {
      tx.addOutput(
        new bitcoreCash.Transaction.Output({
          script: bitcoreCash.Script.fromAddress(new bitcoreCash.Address(output.address)),
          satoshis: output.value
        })
      )
    }

    // Remove the change output if it exits
    const changeIndex = (tx as any)._changeIndex
    if (changeIndex) {
      const changeOutput = tx.outputs[changeIndex]
      const totalOutputAmount = (tx as any)._outputAmount
      ;(tx as any)._removeOutput(changeIndex)
      ;(tx as any)._outputAmount = totalOutputAmount - changeOutput.satoshis
      ;(tx as any)._changeIndex = 0
    }

    const signed = tx.sign(privateKeys /*, null as any, "schnorr"*/)
    if (!signed.isFullySigned()) {
      throw new Error('Tx not fully signed')
    }

    return { hex: signed.serialize(), fee }
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

  async sweepSwapOutput(
    utxo: any,
    secretHash: Buffer,
    recipientPublicKey: Buffer,
    refundPublicKey: Buffer,
    expiration: number,
    toAddress: Address,
    fromAddress: Address,
    outValue: number,
    feePerByte: number,
    secret?: Buffer
  ) {
    const node = await this.seedNode()
    const wif = node.derivePath(fromAddress.derivationPath).toWIF()
    const privateKey = new bitcoreCash.PrivateKey(wif)

    return constructSweepSwap(
      privateKey,
      utxo,
      secretHash,
      recipientPublicKey,
      refundPublicKey,
      expiration,
      toAddress,
      fromAddress,
      outValue,
      feePerByte,
      secret
    )
  }

  async signBatchP2SHTransaction(
    inputs: [{ inputTxHex: string; index: number; vout: any; outputScript: Buffer; txInputIndex?: number }],
    addresses: string,
    tx: any,
    lockTime?: number
  ) {
    const keyPairs = []
    for (const address of addresses) {
      const wallet = await this.getWalletAddress(address)
      const keyPair = await this.keyPair(wallet.derivationPath)
      keyPairs.push(keyPair)
    }

    const sigs = []
    for (let i = 0; i < inputs.length; i++) {
      const index = inputs[i].txInputIndex ? inputs[i].txInputIndex : inputs[i].index
      const sigHash = tx.hashForWitnessV0(index, inputs[i].outputScript, inputs[i].vout.vSat, 0x01 | 0x40)
      const signed = keyPairs[i].sign(sigHash)

      // BitcoinJS does not allow SIGHASH_FORKID
      const signature = new bitcoreCash.crypto.Signature()
      const r = signed.slice(0, 32)
      const s = signed.slice(32)

      // @ts-ignore
      r.toBuffer = () => r
      // @ts-ignore
      s.toBuffer = () => s

      // @ts-ignore
      signature.set({
        r: r,
        s: s,
        isSchnorr: false,
        nhashtype: 0x01 | 0x40
      })
      // @ts-ignore
      sigs.push(signature.toTxFormat())
    }

    return sigs
  }

  getScriptType() {
    return 'p2pkh'
  }

  async getConnectedNetwork() {
    return this._network
  }

  async isWalletAvailable() {
    return true
  }

  canUpdateFee() {
    return false
  }
}
