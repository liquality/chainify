import WalletProvider from '@liquality/wallet-provider'
import JsonRpcProvider from '@liquality/jsonrpc-provider'
import BitcoinNetworks from '@liquality/bitcoin-networks'
import { AddressTypes } from '@liquality/bitcoin-utils'
import { sha256 } from '@liquality/crypto'
import { Address, addressToString } from '@liquality/utils'

import * as bitcoin from 'bitcoinjs-lib'
import { uniq, flatten } from 'lodash'

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
    this._addressType = addressType
    this._network = network
    this._rpc = new JsonRpcProvider(uri, username, password)
  }

  async signMessage (message, from) {
    from = addressToString(from)
    return this._rpc.jsonrpc('signmessage', from, message).then(result => Buffer.from(result, 'base64').toString('hex'))
  }

  async signPSBT (data, input, address) {
    const psbt = bitcoin.Psbt.fromBase64(data, { network: this._network })
    const wif = await this.dumpPrivKey(address)
    const keyPair = bitcoin.ECPair.fromWIF(wif, this._network)

    psbt.signInput(input, keyPair)
    return psbt.toBase64()
  }

  // inputs consists of [{ inputTxHex, index, vout, outputScript }]
  async signBatchP2SHTransaction (inputs, addresses, tx, lockTime = 0, segwit = false) {
    let wallets = []
    for (const address of addresses) {
      const wif = await this.dumpPrivKey(address)
      const wallet = bitcoin.ECPair.fromWIF(wif, this._network)
      wallets.push(wallet)
    }

    let sigs = []
    for (let i = 0; i < inputs.length; i++) {
      let sigHash
      if (segwit) {
        sigHash = tx.hashForWitnessV0(inputs[i].index, inputs[i].outputScript, inputs[i].vout.vSat, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
      } else {
        sigHash = tx.hashForSignature(inputs[i].index, inputs[i].outputScript, bitcoin.Transaction.SIGHASH_ALL)
      }

      const sig = bitcoin.script.signature.encode(wallets[i].sign(sigHash), bitcoin.Transaction.SIGHASH_ALL)
      sigs.push(sig)
    }

    return sigs
  }

  async dumpPrivKey (address) {
    address = addressToString(address)
    return this._rpc.jsonrpc('dumpprivkey', address)
  }

  async getNewAddress (addressType, label = '') {
    const params = addressType ? [label, addressType] : [label]
    const newAddress = await this._rpc.jsonrpc('getnewaddress', ...params)

    if (!newAddress) return null

    return new Address(newAddress)
  }

  async getAddresses () {
    return this.getUsedAddresses()
  }

  async getUnusedAddress () {
    return this.getNewAddress(this._addressType)
  }

  async getUsedAddresses () {
    const usedAddresses = await this._rpc.jsonrpc('listaddressgroupings')
    const emptyAddresses = await this._rpc.jsonrpc('listreceivedbyaddress', 0, true)

    const addrs = [
      ...flatten(usedAddresses).map(addr => addr[0]),
      ...emptyAddresses.map(a => a.address)
    ]

    return uniq(addrs).map(addr => new Address({ address: addr }))
  }

  async getWalletAddress (address) {
    const wif = await this.dumpPrivKey(address)
    const wallet = bitcoin.ECPair.fromWIF(wif, this._network)
    return new Address(address, null, wallet.publicKey, null)
  }

  async isWalletAvailable () {
    const newAddress = await this.getNewAddress()
    return !!newAddress
  }

  async getConnectedNetwork () {
    const blockchainInfo = await this._rpc.jsonrpc('getblockchaininfo')
    const chain = blockchainInfo.chain
    return BIP70_CHAIN_TO_NETWORK[chain]
  }

  async generateSecret (message) {
    const secretAddressLabel = 'secretAddress'
    let address
    try {
      const labelAddresses = await this._rpc.jsonrpc('getaddressesbylabel', secretAddressLabel)
      address = Object.keys(labelAddresses)[0]
    } catch (e) { // Label does not exist
      address = await this.getNewAddress('legacy', secretAddressLabel) // Signing only possible with legacy addresses
    }
    const signedMessage = await this.signMessage(message, address)
    const secret = sha256(signedMessage)
    return secret
  }
}

BitcoinNodeWalletProvider.version = version
