import Provider from '@liquality/provider'
import { Address, addressToString } from '@liquality/utils'
import { ensure0x, remove0x, buildTransaction, formatEthResponse, normalizeTransactionObject } from '@liquality/ethereum-utils'

import { mnemonicToSeed } from 'bip39'
import BigNumber from 'bignumber.js'
import { fromMasterSeed } from 'hdkey'
import { hashPersonalMessage, ecsign, toRpcSig, privateToAddress, privateToPublic } from 'ethereumjs-util'
import { Transaction } from 'ethereumjs-tx'
import Common from 'ethereumjs-common'
import { chains as BaseChains } from 'ethereumjs-common/dist/chains'

import { version } from '../package.json'

export default class EthereumJsWalletProvider extends Provider {
  constructor (network, mnemonic, hardfork = 'istanbul') {
    super()

    this._derivationPath = `m/44'/${network.coinType}'/0'/`
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
    const msgHash = hashPersonalMessage(Buffer.from(message))

    const { v, r, s } = ecsign(msgHash, hdKey._privateKey)

    return remove0x(toRpcSig(v, r, s))
  }

  async getAddresses () {
    const derivationPath = this._derivationPath + '0/0'
    const hdKey = await this.hdKey(derivationPath)
    const address = privateToAddress(hdKey._privateKey).toString('hex')
    const publicKey = privateToPublic(hdKey._privateKey).toString('hex')
    return [
      new Address({
        address,
        derivationPath,
        publicKey
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
      const baseChain = (this._network.name in BaseChains) ? this._network.name : 'mainnet'
      common = Common.forCustomChain(baseChain, {
        ...this._network
      }, this._hardfork)
    }

    const tx = new Transaction(txData, { common })
    tx.sign(hdKey._privateKey)

    return tx.serialize().toString('hex')
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
    const gas = await this.getMethod('estimateGas')(txData)
    txData.gas = ensure0x(gas.toString(16))

    const serializedTx = await this.signTransaction(txData)
    const txHash = await this.getMethod('sendRawTransaction')(serializedTx)
    txData.hash = txHash
    return normalizeTransactionObject(formatEthResponse(txData))
  }

  async sendSweepTransaction (address, _gasPrice) {
    const addresses = await this.getAddresses()

    const balance = await this.getMethod('getBalance')(addresses)

    const [ gasPrice ] = await Promise.all([
      _gasPrice ? Promise.resolve(_gasPrice) : this.getMethod('getGasPrice')()
    ])

    const fees = BigNumber(gasPrice).times(21000).times('1000000000')
    const amountToSend = BigNumber(balance).minus(fees)

    return this.sendTransaction(address, amountToSend, null, gasPrice)
  }

  async updateTransactionFee (tx, newGasPrice) {
    const transaction = typeof tx === 'string' ? await this.getMethod('getTransactionByHash')(tx) : tx

    const txData = await buildTransaction(transaction._raw.from, transaction._raw.to, transaction._raw.value, transaction._raw.input, newGasPrice, transaction._raw.nonce)
    const gas = await this.getMethod('estimateGas')(txData)
    txData.gas = ensure0x(gas.toString(16))

    const serializedTx = await this.signTransaction(txData)
    const newTxHash = await this.getMethod('sendRawTransaction')(serializedTx)

    txData.hash = newTxHash
    return normalizeTransactionObject(formatEthResponse(txData))
  }
}

EthereumJsWalletProvider.version = version
