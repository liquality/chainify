import { WalletProvider } from '@liquality/wallet-provider'
import { EthereumNetwork } from '@liquality/ethereum-networks'
import { Network, Address, SendOptions, ethereum, Transaction, BigNumber } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import {
  remove0x,
  buildTransaction,
  numberToHex,
  hexToNumber,
  normalizeTransactionObject
} from '@liquality/ethereum-utils'

import { mnemonicToSeed } from 'bip39'
import hdkey from 'hdkey'
import { hashPersonalMessage, ecsign, toRpcSig, privateToAddress, privateToPublic } from 'ethereumjs-util'
/// <reference path="../node_modules/ethereumjs-tx/dist/index.d.ts" />
import { Transaction as EthJsTransaction } from 'ethereumjs-tx'
import Common from 'ethereumjs-common'
import { chains as BaseChains } from 'ethereumjs-common/dist/chains'

interface EthereumJsWalletProviderOptions {
  network: EthereumNetwork
  mnemonic: string
  derivationPath: string
  hardfork?: string
}

export default class EthereumJsWalletProvider extends WalletProvider {
  _derivationPath: string
  _mnemonic: string
  _network: EthereumNetwork
  _hardfork: string

  constructor(options: EthereumJsWalletProviderOptions) {
    const { network, mnemonic, derivationPath, hardfork = 'istanbul' } = options
    super({ network })

    this._derivationPath = derivationPath
    this._mnemonic = mnemonic
    this._network = network
    this._hardfork = hardfork
  }

  async node() {
    const seed = await mnemonicToSeed(this._mnemonic)
    return hdkey.fromMasterSeed(seed)
  }

  async hdKey() {
    const node = await this.node()
    return node.derive(this._derivationPath)
  }

  async signMessage(message: string) {
    const hdKey = await this.hdKey()
    const msgHash = hashPersonalMessage(Buffer.from(message))

    const { v, r, s } = ecsign(msgHash, hdKey.privateKey)

    return remove0x(toRpcSig(v, r, s))
  }

  async getAddresses() {
    const hdKey = await this.hdKey()
    const address = privateToAddress(hdKey.privateKey).toString('hex')
    const publicKey = privateToPublic(hdKey.privateKey).toString('hex')
    return [
      new Address({
        address,
        derivationPath: this._derivationPath,
        publicKey
      })
    ]
  }

  async getUnusedAddress() {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async getUsedAddresses() {
    return this.getAddresses()
  }

  async signTransaction(txData: ethereum.TransactionRequest): Promise<string> {
    const hdKey = await this.hdKey()

    let common
    if (!(this._network.name === 'local')) {
      const baseChain = this._network.name in BaseChains ? this._network.name : 'mainnet'
      common = Common.forCustomChain(
        baseChain,
        {
          ...this._network
        },
        this._hardfork
      )
    }

    const tx = new EthJsTransaction(txData, { common })
    tx.sign(hdKey.privateKey)

    return tx.serialize().toString('hex')
  }

  async sendTransaction(options: SendOptions) {
    const addresses = await this.getAddresses()
    const from = addresses[0].address

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

    const serializedTx = await this.signTransaction(txData)
    const txHash = await this.getMethod('sendRawTransaction')(serializedTx)

    const txWithHash: ethereum.PartialTransaction = {
      ...txData,
      input: txData.data,
      hash: txHash
    }
    return normalizeTransactionObject(txWithHash)
  }

  async sendSweepTransaction(address: Address | ethereum.Address, _gasPrice: number) {
    const addresses = await this.getAddresses()

    const balance = await this.client.chain.getBalance(addresses)

    const [gasPrice] = await Promise.all([_gasPrice ? Promise.resolve(_gasPrice) : this.getMethod('getGasPrice')()])

    const fees = gasPrice.times(21000).times('1000000000')
    const amountToSend = balance.minus(fees)

    const sendOptions: SendOptions = {
      to: address,
      value: amountToSend,
      data: null,
      fee: gasPrice
    }

    return this.sendTransaction(sendOptions)
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

    const serializedTx = await this.signTransaction(txData)
    const newTxHash = await this.getMethod('sendRawTransaction')(serializedTx)

    const txWithHash: ethereum.PartialTransaction = {
      ...txData,
      input: txData.data,
      hash: newTxHash
    }

    return normalizeTransactionObject(txWithHash)
  }

  async isWalletAvailable(): Promise<boolean> {
    return true
  }

  async getConnectedNetwork(): Promise<Network> {
    return this._network
  }
}
