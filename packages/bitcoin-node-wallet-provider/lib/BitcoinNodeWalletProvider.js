import WalletProvider from '@liquality/wallet-provider'
import JsonRpcProvider from '@liquality/jsonrpc-provider'
import BitcoinNetworks from '@liquality/bitcoin-networks'
import { sha256 } from '@liquality/crypto'
import { Address, addressToString } from '@liquality/utils'

import { version } from '../package.json'

const BIP70_CHAIN_TO_NETWORK = {
  'main': BitcoinNetworks.bitcoin,
  'test': BitcoinNetworks.bitcoin_testnet,
  'regtest': BitcoinNetworks.bitcoin_regtest
}

const ADDRESS_TYPES = ['legacy', 'p2sh-segwit', 'bech32']

export default class BitcoinNodeWalletProvider extends WalletProvider {
  constructor (network, uri, username, password, addressType = 'bech32') {
    super()
    if (!ADDRESS_TYPES.includes(addressType)) {
      throw new Error(`addressType must be one of ${ADDRESS_TYPES.join(',')}`)
    }
    this.addressType = addressType
    this.network = network
    this.rpc = new JsonRpcProvider(uri, username, password)
  }

  async signMessage (message, from) {
    from = addressToString(from)
    return this.rpc.jsonrpc('signmessage', from, message).then(result => Buffer.from(result, 'base64').toString('hex'))
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
