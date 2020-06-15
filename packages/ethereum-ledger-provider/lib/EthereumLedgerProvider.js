import { BigNumber } from 'bignumber.js'
import EthereumJsTx from 'ethereumjs-tx'

import LedgerProvider from '@liquality/ledger-provider'
import Ethereum from '@ledgerhq/hw-app-eth'

import networks from '@liquality/ethereum-networks'
import {
  ensure0x,
  remove0x,
  buildTransaction
} from '@liquality/ethereum-utils'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumLedgerProvider extends LedgerProvider {
  constructor (network = networks.mainnet) {
    super(Ethereum, network, 'w0w') // srs!
    this._baseDerivationPath = `44'/${network.coinType}'/0'`
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
    const chainId = ensure0x(BigNumber(this._network.chainId).toString(16))
    txData.chainId = chainId
    txData.v = chainId

    const app = await this.getApp()
    const tx = new EthereumJsTx(txData)
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

  async sendTransaction (to, value, data, _gasPrice) {
    const addresses = await this.getAddresses()
    const address = addresses[0]
    const from = addressToString(address)

    const [ nonce, gasPrice ] = await Promise.all([
      this.getMethod('getTransactionCount')(remove0x(from), 'pending'),
      _gasPrice ? Promise.resolve(_gasPrice) : this.getMethod('getGasPrice')()
    ])

    const txData = buildTransaction(from, to, value, data, gasPrice, nonce)
    txData.gasLimit = await this.getMethod('estimateGas')(txData) // TODO: shouldn't these be 0x?

    const signedSerializedTx = await this.signTransaction(txData, address.derivationPath)

    const txHash = this.getMethod('sendRawTransaction')(signedSerializedTx)

    return remove0x(txHash)
  }

  async updateTransactionFee (txHash, newGasPrice) {
    const transaction = await this.getMethod('getTransactionByHash')(txHash)

    const txData = await buildTransaction(transaction._raw.from, transaction._raw.to, transaction._raw.value, transaction._raw.input, newGasPrice, transaction._raw.nonce)
    const gas = await this.getMethod('estimateGas')(txData)
    txData.gasLimit = gas + 20000 // Gas estimation on pending blocks incorrect

    const signedSerializedTx = await this.signTransaction(txData)
    const newTxHash = await this.getMethod('sendRawTransaction')(signedSerializedTx)
    return remove0x(newTxHash)
  }
}

EthereumLedgerProvider.version = version
