import * as bitcoin from 'bitcoinjs-lib'
import { uniq, flatten, isString } from 'lodash'
import BigNumber from 'bignumber.js'
import WalletProvider from '@liquality/wallet-provider'
import JsonRpcProvider from '@liquality/jsonrpc-provider'
import BitcoinNetworks from '@liquality/bitcoin-networks'
import { AddressTypes, normalizeTransactionObject, decodeRawTransaction } from '@liquality/bitcoin-utils'
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
    this._addressType = addressType
    this._network = network
    this._rpc = new JsonRpcProvider(uri, username, password)
    this._addressInfoCache = {}
  }

  async signMessage (message, from) {
    from = addressToString(from)
    return this._rpc.jsonrpc('signmessage', from, message).then(result => Buffer.from(result, 'base64').toString('hex'))
  }

  async withTxFee (func, feePerByte) {
    const feePerKB = BigNumber(feePerByte).div(1e8).times(1000).toNumber()
    const originalTxFee = (await this._rpc.jsonrpc('getwalletinfo')).paytxfee
    await this._rpc.jsonrpc('settxfee', feePerKB)

    const result = await func()

    await this._rpc.jsonrpc('settxfee', originalTxFee)

    return result
  }

  async sendTransaction (to, value, data, feePerByte) {
    to = addressToString(to)
    value = BigNumber(value).dividedBy(1e8).toNumber()

    const send = async () => {
      const hash = await this._rpc.jsonrpc('sendtoaddress', to, value, '', '', false, true)
      const transaction = await this._rpc.jsonrpc('gettransaction', hash, true)
      const fee = BigNumber(transaction.fee).abs().times(1e8).toNumber()
      return normalizeTransactionObject(decodeRawTransaction(transaction.hex, this._network), fee)
    }

    return feePerByte ? this.withTxFee(send, feePerByte) : send()
  }

  async updateTransactionFee (tx, newFeePerByte) {
    const txHash = isString(tx) ? tx : tx.hash
    return this.withTxFee(async () => {
      const result = await this._rpc.jsonrpc('bumpfee', txHash)
      const transaction = await this._rpc.jsonrpc('gettransaction', result.txid, true)
      const fee = BigNumber(transaction.fee).abs().times(1e8).toNumber()
      return normalizeTransactionObject(decodeRawTransaction(transaction.hex, this._network), fee)
    }, newFeePerByte)
  }

  // inputs consists of [{ index, derivationPath }]
  async signPSBT (data, inputs) {
    const psbt = bitcoin.Psbt.fromBase64(data, { network: this._network })

    for (const input of inputs) {
      const usedAddresses = await this.getUsedAddresses()
      const address = usedAddresses.find(address => address.derivationPath === input.derivationPath)
      const wif = await this.dumpPrivKey(addressToString(address))
      const keyPair = bitcoin.ECPair.fromWIF(wif, this._network)
      psbt.signInput(input.index, keyPair)
    }

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

    const addressInfo = await this.getAddressInfo(newAddress)

    return new Address(addressInfo)
  }

  async getAddressInfo (address) {
    if (address in this._addressInfoCache) {
      return this._addressInfoCache[address]
    }

    const addressInfo = await this._rpc.jsonrpc('getaddressinfo', address)

    let publicKey, derivationPath

    if (!addressInfo.iswatchonly) {
      publicKey = Buffer.from(addressInfo.pubkey, 'hex')
      derivationPath = addressInfo.hdkeypath
    }
    const infoObject = { address, publicKey, derivationPath }
    this._addressInfoCache[address] = infoObject
    return infoObject
  }

  async getAddresses () {
    return this.getUsedAddresses()
  }

  async getUnusedAddress () {
    return this.getNewAddress(this._addressType)
  }

  async getUsedAddresses () {
    const usedAddresses = await this._rpc.jsonrpc('listaddressgroupings')
    const emptyAddresses = await this._rpc.jsonrpc('listreceivedbyaddress', 0, true, false)

    const addrs = uniq([
      ...flatten(usedAddresses).map(addr => addr[0]),
      ...emptyAddresses.map(a => a.address)
    ])

    const getAddress = async (address) => {
      const addressInfo = await this.getAddressInfo(address)
      return new Address(addressInfo)
    }

    const addressObjects = await Promise.all(addrs.map(address => getAddress(address)))

    return addressObjects
  }

  async getWalletAddress (address) {
    const addressInfo = await this.getAddressInfo(address)
    return new Address(addressInfo)
  }

  async isWalletAvailable () {
    try {
      await this.this._rpc.jsonrpc('getwalletinfo')
      return true
    } catch (e) {
      return false
    }
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
