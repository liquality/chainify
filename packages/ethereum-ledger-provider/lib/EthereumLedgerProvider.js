import LedgerProvider from '@liquality/ledger-provider'
import networks from '@liquality/ethereum-networks'
import {
  ensure0x,
  remove0x,
  buildTransaction,
  formatEthResponse,
  normalizeTransactionObject
} from '@liquality/ethereum-utils'
import { Address, addressToString } from '@liquality/utils'

import Ethereum from '@ledgerhq/hw-app-eth'
import { Transaction } from 'ethereumjs-tx'
import Common from 'ethereumjs-common'
import { chains as BaseChains } from 'ethereumjs-common/dist/chains'

import { version } from '../package.json'

export default class EthereumLedgerProvider extends LedgerProvider {
  constructor (network = networks.mainnet, hardfork = 'istanbul') {
    super(Ethereum, network, 'w0w') // srs!
    this._baseDerivationPath = `44'/${network.coinType}'/0'`
    this._hardfork = hardfork
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    return app.signPersonalMessage(address.derivationPath, hex)
  }

  async getAddresses () { // TODO: Retrieve given num addresses?
    const app = await this.getApp()
    const path = this._baseDerivationPath + '/0/0'
    const address = await app.getAddress(path)
    return [
      new Address({
        address: address.address,
        derivationPath: path,
        publicKey: address.publicKey
      })
    ]
  }

  async getUnusedAddress () {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async isWalletAvailable () {
    try {
      const addresses = await this.getAddresses()
      return addresses.length > 0
    } catch (e) {
      return false
    }
  }

  async getUsedAddresses () {
    return this.getAddresses()
  }

  async signTransaction (txData, path) {
    let common
    if (!(this._network.name === 'local')) {
      const baseChain = (this._network.name in BaseChains) ? this._network.name : 'mainnet'
      common = Common.forCustomChain(baseChain, {
        ...this._network
      }, this._hardfork)
    }

    const tx = new Transaction(txData, { common })
    const serializedTx = tx.serialize().toString('hex')
    const app = await this.getApp()
    const txSig = await app.signTransaction(path, serializedTx)
    const signedTxData = {
      ...txData,
      v: ensure0x(txSig.v),
      r: ensure0x(txSig.r),
      s: ensure0x(txSig.s)
    }

    const signedTx = new Transaction(signedTxData, { common })
    return signedTx.serialize().toString('hex')
  }

  async sendTransaction (to, value, data, _gasPrice) {
    const addresses = await this.getAddresses()
    const address = addresses[0]
    const from = addressToString(address)

    const [ nonce, gasPrice ] = await Promise.all([
      this.getMethod('getTransactionCount')(remove0x(from), 'pending'),
      _gasPrice ? Promise.resolve(_gasPrice) : this.getMethod('getGasPrice')()
    ])

    const txData = buildTransaction(from, to, value, data, gasPrice, nonce)
    txData.gas = await this.getMethod('estimateGas')(txData) // TODO: shouldn't these be 0x?

    const signedSerializedTx = await this.signTransaction(txData, address.derivationPath)

    const txHash = await this.getMethod('sendRawTransaction')(signedSerializedTx)

    txData.hash = txHash
    return normalizeTransactionObject(formatEthResponse(txData))
  }

  async updateTransactionFee (tx, newGasPrice) {
    const transaction = typeof tx === 'string' ? await this.getMethod('getTransactionByHash')(tx) : tx

    const txData = await buildTransaction(transaction._raw.from, transaction._raw.to, transaction._raw.value, transaction._raw.input, newGasPrice, transaction._raw.nonce)
    txData.gas = await this.getMethod('estimateGas')(txData)

    const signedSerializedTx = await this.signTransaction(txData)
    const newTxHash = await this.getMethod('sendRawTransaction')(signedSerializedTx)

    txData.hash = newTxHash
    return normalizeTransactionObject(formatEthResponse(txData))
  }
}

EthereumLedgerProvider.version = version
