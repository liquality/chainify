import { LedgerProvider } from '@liquality/ledger-provider'
import { Address, ethereum, SendOptions, Transaction, BigNumber, EIP1559Fee } from '@liquality/types'
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
import { toRpcSig, rlp } from 'ethereumjs-util'

import HwAppEthereum from '@ledgerhq/hw-app-eth'
import { Transaction as LegacyTransaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import EthCommon from '@ethereumjs/common'

interface EthereumLedgerProviderOptions {
  network: EthereumNetwork
  derivationPath: string
  Transport: any
  hardfork?: string
}

export default class EthereumLedgerProvider extends LedgerProvider<HwAppEthereum> {
  _derivationPath: string
  _hardfork: string

  constructor(options: EthereumLedgerProviderOptions) {
    super({ ...options, App: HwAppEthereum, ledgerScrambleKey: 'w0w' }) // srs!
    this._derivationPath = options.derivationPath
    this._hardfork = options.hardfork || 'istanbul'
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

  async signTransaction(txData: ethereum.EIP1559TransactionRequest | ethereum.TransactionRequest, path: string) {
    const network = this._network as EthereumNetwork

    let common
    if (network.name !== 'local') {
      common = EthCommon.custom(
        {
          name: network.name,
          chainId: network.chainId,
          networkId: network.networkId
        },
        {
          hardfork: this._hardfork
        }
      )
    }

    const _txData = {
      gasLimit: txData.gas,
      ...txData
    }

    let tx

    if (_txData.gasPrice) {
      tx = LegacyTransaction.fromTxData(_txData, { common })
    } else {
      tx = FeeMarketEIP1559Transaction.fromTxData(_txData as ethereum.EIP1559TransactionRequest, { common })
    }

    const msg = tx.getMessageToSign(false)
    const encodedMessage = _txData.gasPrice ? rlp.encode(msg) : msg
    const encodedMessageHex = encodedMessage.toString('hex')

    const app = await this.getApp()
    const txSig = await app.signTransaction(path, encodedMessageHex)

    const signedTxData = {
      ..._txData,
      v: ensure0x(txSig.v),
      r: ensure0x(txSig.r),
      s: ensure0x(txSig.s)
    }

    let signedTx
    if (_txData.gasPrice) {
      signedTx = LegacyTransaction.fromTxData(signedTxData, { common })
    } else {
      signedTx = FeeMarketEIP1559Transaction.fromTxData(signedTxData as ethereum.EIP1559TransactionRequest, { common })
    }

    return signedTx.serialize().toString('hex')
  }

  async sendTransaction(options: SendOptions) {
    const addresses = await this.getAddresses()
    const address = addresses[0]
    const from = address.address

    const nonce = await this.getMethod('getTransactionCount')(remove0x(from), 'pending')
    const txOptions: ethereum.UnsignedTransaction = {
      from,
      to: options.to ? addressToString(options.to) : (options.to as string),
      value: options.value,
      data: options.data,
      nonce
    }

    if (options.fee) {
      if (typeof options.fee === 'number') {
        txOptions.gasPrice = new BigNumber(options.fee)
      } else {
        txOptions.maxPriorityFeePerGas = new BigNumber(options.fee.maxPriorityFeePerGas)
        txOptions.maxFeePerGas = new BigNumber(options.fee.maxFeePerGas)
      }
    } else {
      const fee = (await this.getMethod('getFees')()).average as EIP1559Fee
      txOptions.maxPriorityFeePerGas = new BigNumber(fee.maxPriorityFeePerGas)
      txOptions.maxFeePerGas = new BigNumber(fee.maxFeePerGas)
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

  async updateTransactionFee(tx: Transaction<ethereum.PartialTransaction> | string, newGasPrice: EIP1559Fee | number) {
    const transaction: Transaction<ethereum.Transaction> =
      typeof tx === 'string' ? await this.getMethod('getTransactionByHash')(tx) : tx

    const txOptions: ethereum.UnsignedTransaction = {
      from: transaction._raw.from,
      to: transaction._raw.to,
      value: new BigNumber(transaction._raw.value),
      data: transaction._raw.input,
      nonce: hexToNumber(transaction._raw.nonce)
    }

    if (typeof newGasPrice === 'number') {
      txOptions.gasPrice = new BigNumber(newGasPrice)
    } else {
      txOptions.maxPriorityFeePerGas = new BigNumber(newGasPrice.maxPriorityFeePerGas)
      txOptions.maxFeePerGas = new BigNumber(newGasPrice.maxFeePerGas)
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
