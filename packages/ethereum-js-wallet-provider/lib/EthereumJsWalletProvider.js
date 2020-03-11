import Provider from '@liquality/provider'
import { Address, addressToString } from '@liquality/utils'
import { ensure0x, remove0x } from '@liquality/ethereum-utils'
import { sha256 } from '@liquality/crypto'
import { mnemonicToSeed } from 'bip39'
import { BigNumber } from 'bignumber.js'
import { fromMasterSeed } from 'hdkey'
import * as ethUtil from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import Common from 'ethereumjs-common'

import { version } from '../package.json'

export default class EthereumJsWalletProvider extends Provider {
  constructor (network, mnemonic, hardfork = 'istanbul') {
    super()
    const derivationPath = `m/44'/${network.coinType}'/0'/`
    this._derivationPath = derivationPath
    this._mnemonic = mnemonic
    this._network = network
    this._hardfork = hardfork
  }

  async node () {
    const seed = await mnemonicToSeed(this._mnemonic)
    return fromMasterSeed(seed)
  }

  async hdKey (derivationPath) {
    const node = await this.node()
    return node.derive(derivationPath)
  }

  async signMessage (message) {
    const derivationPath = this._derivationPath + '0/0'
    const hdKey = await this.hdKey(derivationPath)
    const msgHash = sha256(message)
    const hex = Buffer.from(msgHash, 'hex')

    const { v, r, s } = ethUtil.ecsign(hex, hdKey._privateKey)

    return { v, r: r.toString('hex'), s: s.toString('hex') }
  }

  async getAddresses () {
    const derivationPath = this._derivationPath + '0/0'
    const hdKey = await this.hdKey(derivationPath)
    const address = ethUtil.privateToAddress(hdKey._privateKey).toString('hex')
    const publicKey = ethUtil.privateToPublic(hdKey._privateKey).toString('hex')
    return [
      new Address({
        address,
        derivationPath,
        publicKey,
        index: 0
      })
    ]
  }

  async getUnusedAddress () {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async getUsedAddresses () {
    return this.getAddresses()
  }

  async buildTransaction (to, value, data) {
    const derivationPath = this._derivationPath + '0/0'
    const hdKey = await this.hdKey(derivationPath)

    const addresses = await this.getAddresses()
    const address = addresses[0]
    const from = addressToString(address)

    const txData = {
      to: to ? ensure0x(to) : null,
      from: ensure0x(from),
      value: ensure0x(BigNumber(value).toString(16)),
      data: data ? ensure0x(data) : undefined
    }

    const [ nonce, gasPrice, gasLimit ] = await Promise.all([
      this.getMethod('getTransactionCount')(remove0x(from), 'pending'),
      this.getMethod('getGasPrice')(),
      this.getMethod('estimateGas')(txData)
    ])

    txData.nonce = nonce
    txData.gasPrice = gasPrice
    txData.gasLimit = gasLimit

    let common
    if (!(this._network.name === 'local')) {
      const baseChain = this._network.name
      common = Common.forCustomChain(baseChain, {
        name: this._network.name,
        chainId: this._network.chainId,
        networkId: this._network.networkId
      }, this._hardfork)
    }

    const tx = new Transaction(txData, { common })
    tx.sign(hdKey._privateKey)
    const serializedTx = tx.serialize().toString('hex')

    return serializedTx
  }

  async sendTransaction (to, value, data) {
    const serializedTx = await this.buildTransaction(to, value, data)
    const txHash = await this.getMethod('sendRawTransaction')(serializedTx)
    return txHash
  }
}

EthereumJsWalletProvider.version = version
