import WalletProvider from '@liquality/wallet-provider'
import JsonRpcProvider from '@liquality/jsonrpc-provider'
import BitcoinNetworks from '@liquality/bitcoin-networks'
import { AddressTypes } from '@liquality/bitcoin-utils'
import * as bitcoin from 'bitcoinjs-lib'
import { sha256 } from '@liquality/crypto'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

const BIP70_CHAIN_TO_NETWORK = {
  'main': BitcoinNetworks.bitcoin,
  'test': BitcoinNetworks.bitcoin_testnet,
  'regtest': BitcoinNetworks.bitcoin_regtest
}

export default class BitcoinNodeWalletProvider extends WalletProvider {
  constructor (network, uri, username, password, addressType = 'bech32') {
    super()
    if (!AddressTypes.includes(addressType)) {
      throw new Error(`addressType must be one of ${AddressTypes.join(',')}`)
    }
    this.addressType = addressType
    this.network = network
    if (this.network.name === BitcoinNetworks.bitcoin.name) {
      this.bitcoinJsNetwork = bitcoin.networks.mainnet
    } else if (this.network.name === BitcoinNetworks.bitcoin_testnet.name) {
      this.bitcoinJsNetwork = bitcoin.networks.testnet
    } else if (this.network.name === BitcoinNetworks.bitcoin_regtest.name) {
      this.bitcoinJsNetwork = bitcoin.networks.regtest
    }
    this.rpc = new JsonRpcProvider(uri, username, password)
  }

  async signMessage (message, from) {
    from = addressToString(from)
    return this.rpc.jsonrpc('signmessage', from, message).then(result => Buffer.from(result, 'base64').toString('hex'))
  }

  async signP2SHTransaction (inputTxHex, tx, address, vout, outputScript, lockTime = 0, segwit = false) {
    const wif = await this.dumpPrivKey(address)
    const wallet = bitcoin.ECPair.fromWIF(wif, this.bitcoinJsNetwork)

    let sigHash
    if (segwit) {
      sigHash = tx.hashForWitnessV0(0, outputScript, vout.vSat, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
    } else {
      sigHash = tx.hashForSignature(0, outputScript, bitcoin.Transaction.SIGHASH_ALL)
    }

    const sig = bitcoin.script.signature.encode(wallet.sign(sigHash), bitcoin.Transaction.SIGHASH_ALL)
    return sig
  }

  async dumpPrivKey (address) {
    address = addressToString(address)
    return this.rpc.jsonrpc('dumpprivkey', address)
  }

  async getNewAddress (addressType) {
    const params = addressType ? ['', addressType] : []
    const newAddress = await this.rpc.jsonrpc('getnewaddress', ...params)

    if (!newAddress) return null

    return new Address(newAddress)
  }

  async getAddresses () {
    return this.getUsedAddresses()
  }

  async getUnusedAddress () {
    return this.getNewAddress(this.addressType)
  }

  async getUsedAddresses () {
    const addresses = await this.rpc.jsonrpc('listaddressgroupings')
    const ret = []

    for (const group of addresses) {
      for (const address of group) {
        ret.push(new Address({ address: address[0] }))
      }
    }

    const emptyaddresses = await this.rpc.jsonrpc('listreceivedbyaddress', 0, true)

    for (const address of emptyaddresses) {
      ret.push(new Address({ address: address.address }))
    }

    return ret
  }

  async getWalletAddress (address) {
    const wif = await this.dumpPrivKey(address)
    const wallet = bitcoin.ECPair.fromWIF(wif, this.bitcoinJsNetwork)
    return new Address(address, null, wallet.publicKey, null)
  }

  async isWalletAvailable () {
    const newAddress = await this.getNewAddress()
    return !!newAddress
  }

  async getConnectedNetwork () {
    const blockchainInfo = await this.rpc.jsonrpc('getblockchaininfo')
    const chain = blockchainInfo.chain
    return BIP70_CHAIN_TO_NETWORK[chain]
  }

  async generateSecret (message) {
    const address = await this.getNewAddress('legacy') // Signing only possible with legacy addresses
    const signedMessage = await this.signMessage(message, address)
    const secret = sha256(signedMessage)
    return secret
  }
}

BitcoinNodeWalletProvider.version = version
