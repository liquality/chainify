import { WalletProvider } from '@liquality/wallet-provider'
import { EthereumNetwork } from '@liquality/ethereum-networks'
import { Network, Address, SendOptions, ethereum, Transaction, BigNumber, EIP1559Fee } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import {
  remove0x,
  buildTransaction,
  numberToHex,
  hexToNumber,
  normalizeTransactionObject,
  GWEI
} from '@liquality/ethereum-utils'

import { mnemonicToSeed } from 'bip39'
import hdkey from 'hdkey'

import { hashPersonalMessage, ecsign, toRpcSig, privateToAddress, privateToPublic } from 'ethereumjs-util'
import { Transaction as LegacyTransaction, FeeMarketEIP1559Transaction } from '@ethereumjs/tx'
import EthCommon from '@ethereumjs/common'

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

  async exportPrivateKey() {
    const { privateKey } = await this.hdKey()
    return privateKey.toString('hex')
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

  async signTransaction(txData: ethereum.EIP1559TransactionRequest | ethereum.TransactionRequest): Promise<string> {
    const common = EthCommon.custom(
      {
        name: this._network.name,
        chainId: this._network.chainId,
        networkId: this._network.networkId
      },
      {
        hardfork: this._hardfork
      }
    )

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

    const hdKey = await this.hdKey()
    const signedTx = tx.sign(hdKey.privateKey)
    return signedTx.serialize().toString('hex')
  }

  async sendTransaction(options: SendOptions) {
    const addresses = await this.getAddresses()
    const from = addresses[0].address

    const nonce = await this.getMethod('getTransactionCount')(remove0x(from), 'pending')

    const txOptions: ethereum.UnsignedTransaction = {
      from,
      value: options.value,
      data: options.data,
      nonce
    }

    if (options.to) {
      txOptions.to = addressToString(options.to)
    }

    let { fee } = options

    if (!fee) {
      // set average fee by default
      fee = (await this.getMethod('getFees')()).average.fee
    }

    if (typeof fee === 'number') {
      txOptions.gasPrice = new BigNumber(fee)
    } else {
      txOptions.maxPriorityFeePerGas = new BigNumber(fee.maxPriorityFeePerGas)
      txOptions.maxFeePerGas = new BigNumber(fee.maxFeePerGas)
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

  async sendSweepTransaction(address: Address | ethereum.Address, gasPrice: EIP1559Fee | number) {
    const addresses = await this.getAddresses()
    const balance = await this.client.chain.getBalance(addresses)

    let fee = gasPrice
    if (!fee) {
      // set fast fee by default
      fee = (await this.getMethod('getFees')()).fast.fee
    }

    const maxFee = new BigNumber(typeof fee === 'number' ? fee : fee.maxFeePerGas).times(GWEI).times(21000)
    const amountToSend = balance.minus(maxFee)

    const sendOptions: SendOptions = {
      to: address,
      value: amountToSend,
      fee
    }

    return this.sendTransaction(sendOptions)
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
    txData.gas = transaction._raw.gas

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
