import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import Provider from '@liquality/provider'
import EthereumTx from 'ethereumjs-tx'
import Wallet from 'ethereumjs-wallet'
import EthCrypto from 'eth-crypto';
import { ensure0x, remove0x, removeAddress0x } from '@liquality/ethereum-utils'
import { WalletError } from '@liquality/errors'
import networks from '@liquality/ethereum-networks'

import { version } from '../package.json'

export default class EthereumRPCWalletProvider extends Provider {
  constructor (privKey) {
    super()
    this.wallet = Wallet.fromPrivateKey(Buffer.from(privKey, 'hex'))
  }

  async getAddresses () {
    return [{ address: removeAddress0x(this.wallet.getAddressString()) }]
  }

  async getUsedAddresses (startingIndex, numAddresses) {
    return this.getAddresses()
  }

  async getUnusedAddress () {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async signMessage (message) {
    const hex = Buffer.from(message).toString('hex')
    const messageHash = EthCrypto.hash.keccak256(message);

    const signature = EthCrypto.sign(
      ensure0x(this.wallet.getPrivateKey().toString('hex')), // private key
      messageHash // hash of message
    );

    return remove0x(signature)
  }

  async getWalletInfo () {
    const unusedAddressObj = await this.getUnusedAddress()
    const unusedAddress = unusedAddressObj.address
    const balance = await this.getMethod('getBalance')([unusedAddress])
    return { balance, unusedAddress, usedAddresses: [] }
  }

  async sendTransaction (to, value, data, from = null) {
    const networkId = await this.getWalletNetworkId()

    if (to != null) {
      to = ensure0x(to)
    }

    if (from == null) {
      const addresses = await this.getAddresses()
      from = ensure0x(addresses[0].address)
    }

    value = BigNumber(value).toString(16)

    const nonce = (parseInt((await this.getMethod('jsonrpc')('eth_getTransactionCount', this.wallet.getAddressString(), 'pending')), 16)).toString(16)
    console.log('nonce')
    console.log(nonce)
    const gasPrice = await this.getMethod('jsonrpc')('eth_gasPrice')
    const gasLimit = await this.getMethod('jsonrpc')('eth_estimateGas', { from, to, value: ensure0x(value), data: ensure0x(data), gasPrice: ensure0x(gasPrice)})

    const txParams = {
      nonce: ensure0x(nonce),
      gasPrice: ensure0x(gasPrice),
      gasLimit: ensure0x(gasLimit),
      to,
      value: ensure0x(value),
      data: ensure0x(data),
      chainId: networkId
    }

    const tx = new EthereumTx(txParams)
    tx.sign(this.wallet.getPrivateKey())
    const serializedTx = tx.serialize()

    const txHash = await this.getMethod('jsonrpc')('eth_sendRawTransaction', ensure0x(serializedTx.toString('hex')))
    return remove0x(txHash)
  }

  async getWalletNetworkId () {
    const networkId = await this.getMethod('jsonrpc')('net_version')

    return parseInt(networkId)
  }

  async getConnectedNetwork () {
    const networkId = await this.getWalletNetworkId()
    const network = _.findKey(networks, network => network.networkId === networkId)
    if (networkId && !network) {
      return { name: 'unknown', networkId }
    }
    return networks[network]
  }
}

EthereumRPCWalletProvider.version = version
