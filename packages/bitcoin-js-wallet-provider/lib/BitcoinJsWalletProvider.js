import WalletProvider from '@liquality/wallet-provider'
import JsonRpcProvider from '@liquality/jsonrpc-provider'
import BitcoinNetworks from '@liquality/bitcoin-networks'
import { AddressTypes } from '@liquality/bitcoin-utils'
import * as bitcoin from 'bitcoinjs-lib'
import * as bitcoinMessage from 'bitcoinjs-message'
import { sha256 } from '@liquality/crypto'
import { Address, addressToString } from '@liquality/utils'
import { mnemonicToSeed } from 'bip39'
import { fromSeed } from 'bip32'

import { version } from '../package.json'

const BIP70_CHAIN_TO_NETWORK = {
  'main': BitcoinNetworks.bitcoin,
  'test': BitcoinNetworks.bitcoin_testnet,
  'regtest': BitcoinNetworks.bitcoin_regtest
}

const ADDRESS_TYPE_TO_LEDGER_PREFIX = {
  'legacy': 44,
  'p2sh': 49,
  'bech32': 84
}

export default class BitcoinJsWalletProvider extends WalletProvider {
  constructor (network, uri, username, password, mnemonic, addressType = 'bech32') {
    super()
    if (!AddressTypes.includes(addressType)) {
      throw new Error(`addressType must be one of ${AddressTypes.join(',')}`)
    }
    const derivationPath = `${ADDRESS_TYPE_TO_LEDGER_PREFIX[addressType]}'/${network.coinType}'/0'/`
    this._derivationPath = derivationPath
    this._network = network
    this._rpc = new JsonRpcProvider(uri, username, password)
    this._mnemonic = mnemonic
    this._addressType = addressType
  }

  async node () {
    const seed = await mnemonicToSeed(this._mnemonic)
    return fromSeed(seed)
  }

  // async signMessage (message, from) {



  //   const app = await this.getApp()
  //   const address = await this.getWalletAddress(from)
  //   const hex = Buffer.from(message).toString('hex')
  //   return app.signMessageNew(address.derivationPath, hex)
  // }

  // async signP2SHTransaction (inputTxHex, tx, address, vout, outputScript, lockTime = 0, segwit = false) {
  //   const wallet = this._wallet

  //   let sigHash
  //   if (segwit) {
  //     sigHash = tx.hashForWitnessV0(0, outputScript, vout.vSat, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
  //   } else {
  //     sigHash = tx.hashForSignature(0, outputScript, bitcoin.Transaction.SIGHASH_ALL)
  //   }

  //   const sig = bitcoin.script.signature.encode(wallet.sign(sigHash), bitcoin.Transaction.SIGHASH_ALL)
  //   return sig
  // }

  // async getWalletAddress (address) {
  //   let index = 0
  //   let change = false

  //   // A maximum number of addresses to lookup after which it is deemed
  //   // that the wallet does not contain this address
  //   const maxAddresses = 1000
  //   const addressesPerCall = 50

  //   while (index < maxAddresses) {
  //     const addrs = await this.getAddresses(index, addressesPerCall)
  //     const addr = addrs.find(addr => addr.equals(address))
  //     if (addr) return addr

  //     index += addressesPerCall
  //     if (index === maxAddresses && change === false) {
  //       index = 0
  //       change = true
  //     }
  //   }

  //   throw new Error('Ledger: Wallet does not contain address')
  // }

  getAddressFromPublicKey (publicKey) {
    if (this._addressType === 'legacy') {
      return bitcoin.payments.p2pkh({ pubkey: publicKey, network: this._network }).address
    } else if (this._addressType === 'p2sh-segwit') {
      return bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this._network }),
        network: this._network }).address
    } else if (this._addressType === 'bech32') {
      return bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this._network }).address
    }
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    const node = await this.node()

    const addresses = []
    const lastIndex = startingIndex + numAddresses
    const changeVal = change ? '1' : '0'

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const subPath = changeVal + '/' + currentIndex;
      const path = this._derivationPath + subPath
      const publicKey = node.derivePath(path).publicKey
      const address = getAddressFromPublicKey(publicKey)

      addresses.push(new Address({
        address,
        publicKey,
        derivationPath: path,
        index: currentIndex
      }))
    }

    return addresses
  }

  // async getUnusedAddress () {
  //   return this.getNewAddress(this._addressType)
  // }

  // async getUsedAddresses () {
  //   const addresses = await this._rpc.jsonrpc('listaddressgroupings')
  //   const ret = []

  //   for (const group of addresses) {
  //     for (const address of group) {
  //       ret.push(new Address({ address: address[0] }))
  //     }
  //   }

  //   const emptyaddresses = await this._rpc.jsonrpc('listreceivedbyaddress', 0, true)

  //   for (const address of emptyaddresses) {
  //     ret.push(new Address({ address: address.address }))
  //   }

  //   return ret
  // }

  // async getWalletAddress (address) {
  //   const wif = await this.dumpPrivKey(address)
  //   const wallet = bitcoin.ECPair.fromWIF(wif, this._network)
  //   return new Address(address, null, wallet.publicKey, null)
  // }

  // async isWalletAvailable () {
  //   const newAddress = await this.getNewAddress()
  //   return !!newAddress
  // }

  // async getConnectedNetwork () {
  //   const blockchainInfo = await this._rpc.jsonrpc('getblockchaininfo')
  //   const chain = blockchainInfo.chain
  //   return BIP70_CHAIN_TO_NETWORK[chain]
  // }

  // async generateSecret (message) {
  //   const address = await this.getNewAddress('legacy') // Signing only possible with legacy addresses
  //   const signedMessage = await this.signMessage(message, address)
  //   const secret = sha256(signedMessage)
  //   return secret
  // }
}

BitcoinJsWalletProvider.version = version
