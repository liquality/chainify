import { Psbt, ECPair, script, Transaction as BitcoinJsTransaction } from 'bitcoinjs-lib'
import { uniq, flatten, isString } from 'lodash'
import WalletProvider from '@liquality/wallet-provider'
import JsonRpcProvider from '@liquality/jsonrpc-provider'
import { bitcoin, SendOptions, BigNumber, Transaction, Address } from '@liquality/types'
import BitcoinNetworks, { BitcoinNetwork } from '@liquality/bitcoin-networks'
import { normalizeTransactionObject, decodeRawTransaction } from '@liquality/bitcoin-utils'
import { sha256 } from '@liquality/crypto'

const BIP70_CHAIN_TO_NETWORK : { [index: string]: BitcoinNetwork } = {
  'main': BitcoinNetworks.bitcoin,
  'test': BitcoinNetworks.bitcoin_testnet,
  'regtest': BitcoinNetworks.bitcoin_regtest
}

interface ProviderOptions {
  // RPC URI
  uri: string,
  // Authentication username
  username?: string,
  // Authentication password
  password?: string,
  // Bitcoin network
  network: BitcoinNetwork,
  // Address type. Default: bech32
  addressType?: bitcoin.AddressType
}

export default class BitcoinNodeWalletProvider extends WalletProvider {
  _addressType: bitcoin.AddressType
  _network: BitcoinNetwork
  _rpc: JsonRpcProvider
  _addressInfoCache: {[key: string]: Address}

  constructor (opts: ProviderOptions) {
    const { uri, username, password, network, addressType = bitcoin.AddressType.BECH32 } = opts
    super({ network })
    const addressTypes = Object.values(bitcoin.AddressType)
    if (!addressTypes.includes(addressType)) {
      throw new Error(`addressType must be one of ${addressTypes.join(',')}`)
    }
    this._addressType = addressType
    this._network = network
    this._rpc = new JsonRpcProvider(uri, username, password)
    this._addressInfoCache = {}
  }

  async signMessage (message: string, from: string) {
    return this._rpc.jsonrpc('signmessage', from, message).then((result: string) => Buffer.from(result, 'base64').toString('hex'))
  }

  async withTxFee (func: () => Promise<Transaction<bitcoin.Transaction>>, feePerByte: BigNumber) {
    const feePerKB = feePerByte.div(1e8).times(1000).toNumber()
    const originalTxFee : number = (await this._rpc.jsonrpc('getwalletinfo')).paytxfee
    await this._rpc.jsonrpc('settxfee', feePerKB)

    const result = await func()

    await this._rpc.jsonrpc('settxfee', originalTxFee)

    return result
  }

  async _sendTransaction (options: SendOptions) {
    const value = new BigNumber(options.value).dividedBy(1e8).toNumber()
    const hash = await this._rpc.jsonrpc('sendtoaddress', options.to, value, '', '', false, true)
    const transaction = await this._rpc.jsonrpc('gettransaction', hash, true)
    const fee = new BigNumber(transaction.fee).abs().times(1e8).toNumber()
    return normalizeTransactionObject(decodeRawTransaction(transaction.hex, this._network), fee)
  }

  async sendTransaction (options: SendOptions) {
    return options.fee
      ? this.withTxFee(async () => this._sendTransaction(options), options.fee)
      : this._sendTransaction(options)
  }

  async updateTransactionFee (tx: Transaction<bitcoin.Transaction>, newFeePerByte: BigNumber) {
    const txHash = isString(tx) ? tx : tx.hash
    return this.withTxFee(async () => {
      const result = await this._rpc.jsonrpc('bumpfee', txHash)
      const transaction = await this._rpc.jsonrpc('gettransaction', result.txid, true)
      const fee = new BigNumber(transaction.fee).abs().times(1e8).toNumber()
      return normalizeTransactionObject(decodeRawTransaction(transaction.hex, this._network), fee)
    }, newFeePerByte)
  }

  async signPSBT (data: string, inputs: bitcoin.PsbtInputTarget[]) {
    const psbt = Psbt.fromBase64(data, { network: this._network })

    for (const input of inputs) {
      const usedAddresses = await this.getUsedAddresses()
      const address = usedAddresses.find(address => address.derivationPath === input.derivationPath)
      const wif = await this.dumpPrivKey(address.address)
      const keyPair = ECPair.fromWIF(wif, this._network)
      psbt.signInput(input.index, keyPair)
    }

    return psbt.toBase64()
  }

  // inputs consists of 
  async signBatchP2SHTransaction (inputs: [{ inputTxHex: string, index: number, vout: any, outputScript: Buffer }] , addresses: string, tx: any, lockTime = 0, segwit = false) {
    let wallets = []
    for (const address of addresses) {
      const wif = await this.dumpPrivKey(address)
      const wallet = ECPair.fromWIF(wif, this._network)
      wallets.push(wallet)
    }

    let sigs = []
    for (let i = 0; i < inputs.length; i++) {
      let sigHash
      if (segwit) {
        sigHash = tx.hashForWitnessV0(inputs[i].index, inputs[i].outputScript, inputs[i].vout.vSat, BitcoinJsTransaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
      } else {
        sigHash = tx.hashForSignature(inputs[i].index, inputs[i].outputScript, BitcoinJsTransaction.SIGHASH_ALL)
      }

      const sig = script.signature.encode(wallets[i].sign(sigHash), BitcoinJsTransaction.SIGHASH_ALL)
      sigs.push(sig)
    }

    return sigs
  }

  async dumpPrivKey (address: string): Promise<string> {
    return this._rpc.jsonrpc('dumpprivkey', address)
  }

  async getNewAddress (addressType: bitcoin.AddressType, label = '') {
    const params = addressType ? [label, addressType] : [label]
    const newAddress = await this._rpc.jsonrpc('getnewaddress', ...params)

    if (!newAddress) return null

    return this.getAddressInfo(newAddress)
  }

  async getAddressInfo (address: string): Promise<Address> {
    if (address in this._addressInfoCache) {
      return this._addressInfoCache[address]
    }

    const addressInfo: bitcoin.rpc.AddressInfo = await this._rpc.jsonrpc('getaddressinfo', address)

    let publicKey, derivationPath

    if (!addressInfo.iswatchonly) {
      publicKey = addressInfo.pubkey
      derivationPath = addressInfo.hdkeypath
    }
    const addressObject = new Address({ address, publicKey, derivationPath })
    this._addressInfoCache[address] = addressObject
    return addressObject
  }

  async getAddresses () {
    return this.getUsedAddresses()
  }

  async getUnusedAddress () {
    return this.getNewAddress(this._addressType)
  }

  async getUsedAddresses () {
    const usedAddresses : bitcoin.rpc.AddressGrouping[] = await this._rpc.jsonrpc('listaddressgroupings')
    const emptyAddresses : bitcoin.rpc.ReceivedByAddress[] = await this._rpc.jsonrpc('listreceivedbyaddress', 0, true, false)

    const addrs = uniq([
      ...flatten(usedAddresses).map(addr => addr[0]),
      ...emptyAddresses.map(a => a.address)
    ])

    const addressObjects = await Promise.all(addrs.map(address => this.getAddressInfo(address)))

    return addressObjects
  }

  async getWalletAddress (address: string) {
    return this.getAddressInfo(address)
  }

  async isWalletAvailable () {
    try {
      await this._rpc.jsonrpc('getwalletinfo')
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

  async generateSecret (message: string) {
    const secretAddressLabel = 'secretAddress'
    let address
    try {
      const labelAddresses = await this._rpc.jsonrpc('getaddressesbylabel', secretAddressLabel)
      address = Object.keys(labelAddresses)[0]
    } catch (e) { // Label does not exist
      address = (await this.getNewAddress(bitcoin.AddressType.LEGACY, secretAddressLabel)).address // Signing only possible with legacy addresses
    }
    const signedMessage = await this.signMessage(message, address)
    const secret = sha256(signedMessage)
    return secret
  }
}
