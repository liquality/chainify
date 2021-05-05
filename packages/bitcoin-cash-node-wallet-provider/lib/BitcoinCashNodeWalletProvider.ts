import { ECPair } from 'bitcoinjs-lib'
import { uniq, flatten } from 'lodash'
import { WalletProvider } from '@liquality/wallet-provider'
import { JsonRpcProvider } from '@liquality/jsonrpc-provider'
import { bitcoinCash, SendOptions, BigNumber, Transaction, Address } from '@liquality/types'
import { BitcoinCashNetworks, BitcoinCashNetwork } from '../../bitcoin-cash-networks' //'@liquality/bitcoin-cash-networks'
import { normalizeTransactionObject, decodeRawTransaction, constructSweepSwap, bitcoreCash } from '../../bitcoin-cash-utils' //'@liquality/bitcoin-cash-utils'
import { sha256 } from '@liquality/crypto'

const BIP70_CHAIN_TO_NETWORK: { [index: string]: BitcoinCashNetwork } = {
  main: BitcoinCashNetworks.bitcoin_cash,
  test: BitcoinCashNetworks.bitcoin_cash_testnet,
  regtest: BitcoinCashNetworks.bitcoin_cash_regtest
}

interface ProviderOptions {
  // RPC URI
  uri: string
  // Authentication username
  username?: string
  // Authentication password
  password?: string
  // Bitcoin network
  network: BitcoinCashNetwork
}

export default class BitcoinNodeWalletProvider extends WalletProvider {
  _network: BitcoinCashNetwork
  _rpc: JsonRpcProvider
  _addressInfoCache: { [key: string]: Address }

  constructor(opts: ProviderOptions) {
    const { uri, username, password, network } = opts
    super({ network })
    this._network = network
    this._rpc = new JsonRpcProvider(uri, username, password)
    this._addressInfoCache = {}
  }

  async signMessage(message: string, from: string) {
    return this._rpc
      .jsonrpc('signmessage', from, message)
      .then((result: string) => Buffer.from(result, 'base64').toString('hex'))
  }

  async withTxFee(func: () => Promise<Transaction<bitcoinCash.Transaction>>, feePerByte: number) {
    const feePerKB = new BigNumber(feePerByte).div(1e8).times(1000).toNumber()
    const originalTxFee: number = (await this._rpc.jsonrpc('getwalletinfo')).paytxfee
    await this._rpc.jsonrpc('settxfee', feePerKB)

    const result = await func()

    await this._rpc.jsonrpc('settxfee', originalTxFee)

    return result
  }

  async _sendTransaction(options: SendOptions) {
    const value = new BigNumber(options.value).dividedBy(1e8).toNumber()

    // Bitcoin Core API:
    //const hash = await this._rpc.jsonrpc('sendtoaddress', options.to, value, '', '', false, true)
    // BCHN API:
    const hash = await this._rpc.jsonrpc('sendtoaddress', options.to, value, '', '', false)

    const transaction = await this._rpc.jsonrpc('gettransaction', hash, true)
    const fee = new BigNumber(transaction.fee).abs().times(1e8).toNumber()
    return normalizeTransactionObject(decodeRawTransaction(transaction.hex, this._network), fee)
  }

  async sendTransaction(options: SendOptions) {
    return options.fee
      ? this.withTxFee(async () => this._sendTransaction(options), options.fee)
      : this._sendTransaction(options)
  }

  /*async signPSBT(data: string, inputs: bitcoinCash.PsbtInputTarget[]) {
    const psbt = Psbt.fromBase64(data, { network: this._network })

    for (const input of inputs) {
      const usedAddresses = await this.getUsedAddresses()
      const address = usedAddresses.find((address) => address.derivationPath === input.derivationPath)
      const wif = await this.dumpPrivKey(address.address)
      const keyPair = ECPair.fromWIF(wif, this._network)
      psbt.signInput(input.index, keyPair)
    }

    return psbt.toBase64()
  }*/

  async sweepSwapOutput(
    utxo: any,
    secretHash: Buffer,
    recipientPublicKey: Buffer,
    refundPublicKey: Buffer,
    expiration: number,
    toAddress: Address,
    fromAddress: Address,
    outValue: number,
    feePerByte: number,
    secret?: Buffer
  ) {
    const privkey = await this.dumpPrivKey(fromAddress.address)

    return constructSweepSwap(
      new bitcoreCash.PrivateKey(privkey),
      utxo,
      secretHash,
      recipientPublicKey,
      refundPublicKey,
      expiration,
      toAddress,
      fromAddress,
      outValue,
      feePerByte,
      secret
    )
  }

  async signBatchP2SHTransaction(
    inputs: [{ inputTxHex: string; index: number; vout: any; outputScript: Buffer }],
    addresses: string,
    tx: any,
    locktime: number,
    segwit = false
  ) {
    const wallets = []
    for (const address of addresses) {
      const wif = await this.dumpPrivKey(address)
      const wallet = ECPair.fromWIF(wif, this._network)
      wallets.push(wallet)
    }

    const sigs = []
    for (let i = 0; i < inputs.length; i++) {
      let sigHash = tx.hashForWitnessV0(
        inputs[i].index,
        inputs[i].outputScript,
        inputs[i].vout.vSat,
        0x41
      ) // AMOUNT NEEDS TO BE PREVOUT AMOUNT

      const signed = wallets[i].sign(sigHash)

      // BitcoinJS does not allow SIGHASH_FORKID
      let signature = new bitcoreCash.crypto.Signature()
      let r = signed.slice(0, 32)
      let s = signed.slice(32)

      // @ts-ignore
      r.toBuffer = () => r
      // @ts-ignore
      s.toBuffer = () => s

      // @ts-ignore
      signature.set({
        r: r,
        s: s,
        isSchnorr: false,
        nhashtype: 0x01 | 0x40
      })
      // @ts-ignore
      sigs.push(signature.toTxFormat())
    }

    return sigs
  }

  async dumpPrivKey(address: string): Promise<string> {
    return this._rpc.jsonrpc('dumpprivkey', address)
  }

  async getNewAddress(label = '') {
    const newAddress = await this._rpc.jsonrpc('getnewaddress', label)

    if (!newAddress) return null

    return this.getAddressInfo(newAddress)
  }

  async getAddressInfo(address: string): Promise<Address> {
    if (address in this._addressInfoCache) {
      return this._addressInfoCache[address]
    }

    const addressInfo: bitcoinCash.rpc.AddressInfo = await this._rpc.jsonrpc('getaddressinfo', address)

    let publicKey, derivationPath

    if (!addressInfo.iswatchonly) {
      publicKey = addressInfo.pubkey
      derivationPath = addressInfo.hdkeypath
    }
    const addressObject = new Address({ address, publicKey, derivationPath })
    this._addressInfoCache[address] = addressObject
    return addressObject
  }

  async getAddresses() {
    return this.getUsedAddresses()
  }

  async getUnusedAddress() {
    return this.getNewAddress()
  }

  async getUsedAddresses() {
    const usedAddresses: bitcoinCash.rpc.AddressGrouping[] = await this._rpc.jsonrpc('listaddressgroupings')
    const emptyAddresses: bitcoinCash.rpc.ReceivedByAddress[] = await this._rpc.jsonrpc(
      'listreceivedbyaddress',
      0,
      true,
      false
    )

    const addrs = uniq([...flatten(usedAddresses).map((addr) => addr[0]), ...emptyAddresses.map((a) => a.address)])

    const addressObjects = await Promise.all(addrs.map((address) => this.getAddressInfo(address)))

    return addressObjects
  }

  async getWalletAddress(address: string) {
    return this.getAddressInfo(address)
  }

  async isWalletAvailable() {
    try {
      await this._rpc.jsonrpc('getwalletinfo')
      return true
    } catch (e) {
      return false
    }
  }

  async getConnectedNetwork() {
    const blockchainInfo = await this._rpc.jsonrpc('getblockchaininfo')
    const chain = blockchainInfo.chain
    return BIP70_CHAIN_TO_NETWORK[chain]
  }

  async generateSecret(message: string) {
    const secretAddressLabel = 'secretAddress'
    let address
    try {
      const labelAddresses = await this._rpc.jsonrpc('getaddressesbylabel', secretAddressLabel)
      address = Object.keys(labelAddresses)[0]
    } catch (e) {
      // Label does not exist
      address = (await this.getNewAddress(secretAddressLabel)).address // Signing only possible with legacy addresses
    }
    const signedMessage = await this.signMessage(message, address)
    const secret = sha256(signedMessage)
    return secret
  }

  canUpdateFee() {
    return false
  }
}
