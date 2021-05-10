import { LedgerProvider } from '@liquality/ledger-provider'
import { Address, ethereum, SendOptions, Transaction, BigNumber } from '@liquality/types'
import { EthereumNetwork } from '@liquality/ethereum-networks'
import { addressToString } from '@liquality/utils'
import {
  ensure0x,
  remove0x,
  numberToHex,
  buildTransaction,
  normalizeTransactionObject,
  hexToNumber
} from '@liquality/ethereum-utils'
import { toRpcSig } from 'ethereumjs-util'

import HwAppEthereum from '@ledgerhq/hw-app-eth'
import EthereumJsTx from 'ethereumjs-tx'

interface EthereumLedgerProviderOptions {
  network: EthereumNetwork
  derivationPath: string
  Transport: any
}

export default class EthereumLedgerProvider extends LedgerProvider<HwAppEthereum> {
  _derivationPath: string

  constructor(options: EthereumLedgerProviderOptions) {
    super({ ...options, App: HwAppEthereum, ledgerScrambleKey: 'w0w' }) // srs!
    this._derivationPath = options.derivationPath
  }

  async signMessage(message: string, from: string) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    const { v, r, s } = await app.signPersonalMessage(address.derivationPath, hex)

    return remove0x(toRpcSig(v, Buffer.from(r, 'hex'), Buffer.from(s, 'hex')))
  }

  async getAddresses() {
    const app = await this.getApp()
    const address = await app.getAddress(this._derivationPath)
    return [
      new Address({
        address: address.address,
        derivationPath: this._derivationPath,
        publicKey: address.publicKey
      })
    ]
  }

  async getUnusedAddress() {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async isWalletAvailable() {
    try {
      const addresses = await this.getAddresses()
      return addresses.length > 0
    } catch (e) {
      return false
    }
  }

  async getUsedAddresses() {
    return this.getAddresses()
  }

  async signTransaction(txData: ethereum.TransactionRequest, path: string) {
    const chainId = numberToHex((this._network as EthereumNetwork).chainId)
    const app = await this.getApp()
    const tx = new EthereumJsTx({
      ...txData,
      chainId: hexToNumber(chainId), // HEY Could be incorrect
      v: chainId
    })
    const serializedTx = tx.serialize().toString('hex')
    const txSig = await app.signTransaction(path, serializedTx)
    const signedTxData = {
      ...txData,
      v: ensure0x(txSig.v),
      r: ensure0x(txSig.r),
      s: ensure0x(txSig.s)
    }

    const signedTx = new EthereumJsTx(signedTxData)
    const signedSerializedTx = signedTx.serialize().toString('hex')
    return signedSerializedTx
  }

  async sendTransaction(options: SendOptions) {
    const addresses = await this.getAddresses()
    const address = addresses[0]
    const from = address.address

    const [nonce, gasPrice] = await Promise.all([
      this.getMethod('getTransactionCount')(remove0x(from), 'pending'),
      options.fee ? Promise.resolve(new BigNumber(options.fee)) : this.getMethod('getGasPrice')()
    ])

    const txOptions: ethereum.UnsignedTransaction = {
      from,
      to: options.to ? addressToString(options.to) : (options.to as string),
      value: options.value,
      data: options.data,
      gasPrice,
      nonce
    }

    const txData = buildTransaction(txOptions)
    const gas = await this.getMethod('estimateGas')(txData)
    txData.gas = numberToHex(gas)

    const signedSerializedTx = await this.signTransaction(txData, address.derivationPath)
    const txHash = await this.getMethod('sendRawTransaction')(signedSerializedTx)

    const txWithHash: ethereum.PartialTransaction = {
      ...txData,
      input: txData.data,
      hash: txHash
    }
    return normalizeTransactionObject(txWithHash)
  }

  async updateTransactionFee(tx: Transaction<ethereum.PartialTransaction> | string, newGasPrice: number) {
    const transaction: Transaction<ethereum.Transaction> =
      typeof tx === 'string' ? await this.getMethod('getTransactionByHash')(tx) : tx

    const txOptions: ethereum.UnsignedTransaction = {
      from: transaction._raw.from,
      to: transaction._raw.to,
      value: new BigNumber(transaction._raw.value),
      gasPrice: new BigNumber(newGasPrice),
      data: transaction._raw.input,
      nonce: hexToNumber(transaction._raw.nonce)
    }

    const txData = await buildTransaction(txOptions)
    const gas = await this.getMethod('estimateGas')(txData)
    txData.gas = numberToHex(gas)

    const address = await this.getWalletAddress(txData.from)
    const signedSerializedTx = await this.signTransaction(txData, address.derivationPath)
    const newTxHash = await this.getMethod('sendRawTransaction')(signedSerializedTx)

    const txWithHash: ethereum.PartialTransaction = {
      ...txData,
      input: txData.data,
      hash: newTxHash
    }

    return normalizeTransactionObject(txWithHash)
  }
}
