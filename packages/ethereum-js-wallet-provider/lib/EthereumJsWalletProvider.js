import Provider from '@liquality/provider'
import { Address, addressToString } from '@liquality/utils'
import { remove0x, buildTransaction } from '@liquality/ethereum-utils'
import { sha256 } from '@liquality/crypto'
import { mnemonicToSeed } from 'bip39'
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
    const msgHash = sha256(Buffer.from(message).toString('hex'))
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

  async signTransaction (txData) {
    const derivationPath = this._derivationPath + '0/0'
    const hdKey = await this.hdKey(derivationPath)

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

    const serializedTx = await this.signTransaction(txData)
    const txHash = await this.getMethod('sendRawTransaction')(serializedTx)
    return remove0x(txHash)
  }

  async updateTransactionFee (txHash, newGasPrice) {
    const transaction = await this.getMethod('getTransactionByHash')(txHash)

    const txData = await buildTransaction(transaction._raw.from, transaction._raw.to, transaction._raw.value, transaction._raw.input, newGasPrice, transaction._raw.nonce)
    const gas = await this.getMethod('estimateGas')(txData)
    txData.gasLimit = gas + 20000 // Gas estimation on pending blocks incorrect

    const serializedTx = await this.signTransaction(txData)
    const newTxHash = await this.getMethod('sendRawTransaction')(serializedTx)
    return remove0x(newTxHash)
  }
}

EthereumJsWalletProvider.version = version
