import { BigNumber } from 'bignumber.js'
import EthereumJsTx from 'ethereumjs-tx'

import LedgerProvider from '@liquality/ledger-provider'
import Ethereum from '@ledgerhq/hw-app-eth'

import networks from '@liquality/ethereum-networks'
import {
  ensure0x,
  remove0x
} from '@liquality/ethereum-utils'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class EthereumLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.mainnet }) {
    super(Ethereum, `44'/${chain.network.coinType}'/0'/`, chain.network, 'w0w') // srs!
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    return app.signPersonalMessage(address.derivationPath, hex)
  }

  async getAddresses () { // TODO: Retrieve given num addresses?
    const app = await this.getApp()
    const path = this._baseDerivationPath + '0/0'
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

  async sendTransaction (to, value, data) {
    const app = await this.getApp()
    const addresses = await this.getAddresses()
    const address = addresses[0]
    const from = addressToString(address)
    const path = address.derivationPath

    const txData = {
      to: to ? ensure0x(to) : null,
      from: ensure0x(from),
      value: ensure0x(BigNumber(value).toString(16)),
      data: data ? ensure0x(data) : undefined,
      chainId: ensure0x(BigNumber(this._network.chainId).toString(16))
    }

    txData.v = txData.chainId

    const [ nonce, gasPrice, gasLimit ] = await Promise.all([
      this.getMethod('getTransactionCount')(remove0x(from), 'pending'),
      this.getMethod('getGasPrice')(),
      this.getMethod('estimateGas')(txData)
    ])

    txData.nonce = nonce
    txData.gasPrice = gasPrice
    txData.gasLimit = gasLimit

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
    const txHash = this.getMethod('sendRawTransaction')(signedSerializedTx)

    return txHash
  }
}

EthereumLedgerProvider.version = version
