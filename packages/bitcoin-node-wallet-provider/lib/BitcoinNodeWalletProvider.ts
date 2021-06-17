import { Psbt, ECPair, script, Transaction as BitcoinJsTransaction } from 'bitcoinjs-lib'
import { uniq, flatten, isString } from 'lodash'
import { WalletProvider } from '@liquality/wallet-provider'
import { JsonRpcProvider } from '@liquality/jsonrpc-provider'
import { bitcoin, SendOptions, BigNumber, Transaction, Address } from '@liquality/types'
import { BitcoinNetworks, BitcoinNetwork, BitcoinCashNetworks, ProtocolType } from '@liquality/bitcoin-networks'
import { normalizeTransactionObject, decodeRawTransaction, txApplyBitcoinCashSighash } from '@liquality/bitcoin-utils'
import { sha256 } from '@liquality/crypto'

const BIP70_CHAIN_TO_NETWORK: { [index: string]: BitcoinNetwork } = {
  main: BitcoinNetworks.bitcoin,
  test: BitcoinNetworks.bitcoin_testnet,
  regtest: BitcoinNetworks.bitcoin_regtest
}

const BIP70_CHAIN_TO_NETWORK_BCH: { [index: string]: BitcoinNetwork } = {
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
  network: BitcoinNetwork
  // Address type. Default: bech32
  addressType?: bitcoin.AddressType
}

export default class BitcoinNodeWalletProvider extends WalletProvider {
  _addressType: bitcoin.AddressType
  _network: BitcoinNetwork
  _rpc: JsonRpcProvider
  _addressInfoCache: { [key: string]: Address }

  constructor(opts: ProviderOptions) {
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

  async signMessage(message: string, from: string) {
    return this._rpc
      .jsonrpc('signmessage', from, message)
      .then((result: string) => Buffer.from(result, 'base64').toString('hex'))
  }

  async withTxFee(func: () => Promise<Transaction<bitcoin.Transaction>>, feePerByte: number) {
    const feePerKB = new BigNumber(feePerByte).div(1e8).times(1000).toNumber()
    const originalTxFee: number = (await this._rpc.jsonrpc('getwalletinfo')).paytxfee
    await this._rpc.jsonrpc('settxfee', feePerKB)

    const result = await func()

    await this._rpc.jsonrpc('settxfee', originalTxFee)

    return result
  }

  async _sendTransaction(options: SendOptions) {
    const value = new BigNumber(options.value).dividedBy(1e8).toNumber()
    const shouldNotReuse = []
    if (this._network.protocolType != ProtocolType.BitcoinCash) {
      // BCHN deviates from Core's syntax
      shouldNotReuse.push(true)
    }
    const hash = await this._rpc.jsonrpc('sendtoaddress', options.to, value, '', '', false, ...shouldNotReuse)
    const transaction = await this._rpc.jsonrpc('gettransaction', hash, true)
    const fee = new BigNumber(transaction.fee).abs().times(1e8).toNumber()
    return normalizeTransactionObject(decodeRawTransaction(transaction.hex, this._network), fee)
  }

  async sendTransaction(options: SendOptions) {
    return options.fee
      ? this.withTxFee(async () => this._sendTransaction(options), options.fee)
      : this._sendTransaction(options)
  }

  async updateTransactionFee(tx: Transaction<bitcoin.Transaction>, newFeePerByte: number) {
    if (!this._network.feeBumpCapable) {
      throw new Error('This coin does not support fee bumping')
    }
    const txHash = isString(tx) ? tx : tx.hash
    return this.withTxFee(async () => {
      const result = await this._rpc.jsonrpc('bumpfee', txHash)
      const transaction = await this._rpc.jsonrpc('gettransaction', result.txid, true)
      const fee = new BigNumber(transaction.fee).abs().times(1e8).toNumber()
      return normalizeTransactionObject(decodeRawTransaction(transaction.hex, this._network), fee)
    }, newFeePerByte)
  }

  async signPSBT(data: string, inputs: bitcoin.PsbtInputTarget[]) {
    const psbt = Psbt.fromBase64(data, { network: this._network })

    if (this._network.useBitcoinJSSign) {
      for (const input of inputs) {
        const usedAddresses = await this.getUsedAddresses()
        const address = usedAddresses.find((address) => address.derivationPath === input.derivationPath)
        const wif = await this.dumpPrivKey(address.address)
        const keyPair = ECPair.fromWIF(wif, this._network)
        psbt.signInput(input.index, keyPair)
      }

      return psbt.toBase64()
    }

    // This code is only for BCH
    const inputInfo: { inputTxHex: string; index: number; vout: any; outputScript: Buffer }[] = []
    const inputAddressInfo: string[] = []
    for (let i = 0; i < inputs.length; i++) {
      if (!psbt.data.inputs[inputs[i].index].witnessUtxo) {
        const funder = BitcoinJsTransaction.fromBuffer(psbt.data.inputs[inputs[i].index].nonWitnessUtxo)
        const outputIndex = (psbt as any).__CACHE.__TX.ins[inputs[i].index].index
        psbt.data.inputs[inputs[i].index].witnessUtxo = funder.outs[outputIndex]
      }

      const output = psbt.data.inputs[inputs[i].index].witnessUtxo.script
      const isP2SH = output.length == 23 && output[0] == 0xa9 && output[1] == 0x14 && output[22] == 0x87

      inputInfo.push({
        inputTxHex: '',
        index: inputs[i].index,
        vout: { vSat: psbt.data.inputs[inputs[i].index].witnessUtxo.value },
        outputScript: isP2SH ? psbt.data.inputs[inputs[i].index].redeemScript : output
      })
      const usedAddresses = await this.getUsedAddresses()
      const address = usedAddresses.find((address) => address.derivationPath === inputs[i].derivationPath)
      inputAddressInfo.push(address.address)
    }

    const sigs = await this.signBatchP2SHTransaction(inputInfo, inputAddressInfo, (psbt as any).__CACHE.__TX, 0)

    // Encode twice with different allowed sighashes
    // to locate them in the final hex and replace
    // them with the BTC-incompatible SigHash
    // which BitcoinJS does not let us encode
    const psbt2 = psbt.clone()

    for (let i = 0; i < inputs.length; i++) {
      const wif = await this.dumpPrivKey(inputAddressInfo[i])
      const keyPair = ECPair.fromWIF(wif, this._network)
      sigs[i][sigs[i].length - 1] = 3
      const partialSig = [
        {
          pubkey: keyPair.publicKey,
          // Pass by REFERENCE
          signature: Buffer.from(sigs[i])
        }
      ]
      psbt.data.updateInput(inputs[i].index, { partialSig })

      sigs[i][sigs[i].length - 1] = 2
      const partialSig2 = [
        {
          pubkey: keyPair.publicKey,
          signature: sigs[i]
        }
      ]
      psbt2.data.updateInput(inputs[i].index, { partialSig: partialSig2 })
    }

    const hex = psbt.toHex()
    const hex2 = psbt2.toHex()

    return Psbt.fromHex(
      txApplyBitcoinCashSighash(hex, hex2, this._network.protocolType == ProtocolType.BitcoinCash ? '41' : '01')
    ).toBase64()
  }

  async signBatchP2SHTransaction(
    inputs: { inputTxHex: string; index: number; vout: any; outputScript: Buffer }[],
    addresses: string[],
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
      let sigHashId = BitcoinJsTransaction.SIGHASH_ALL
      if (this._network.protocolType == ProtocolType.BitcoinCash) sigHashId |= 0x40

      let sigHash
      if (segwit || this._network.protocolType == ProtocolType.BitcoinCash) {
        sigHash = tx.hashForWitnessV0(inputs[i].index, inputs[i].outputScript, inputs[i].vout.vSat, sigHashId)
      } else {
        sigHash = tx.hashForSignature(inputs[i].index, inputs[i].outputScript, BitcoinJsTransaction.SIGHASH_ALL)
      }

      const sig = script.signature.encode(wallets[i].sign(sigHash), BitcoinJsTransaction.SIGHASH_ALL)

      if (this._network.protocolType == ProtocolType.BitcoinCash) {
        // Having bypassed BitcoinJS sanity checks
        sig[sig.length - 1] |= 0x40
      }
      sigs.push(sig)
    }

    return sigs
  }

  async dumpPrivKey(address: string): Promise<string> {
    return this._rpc.jsonrpc('dumpprivkey', address)
  }

  async getNewAddress(addressType: bitcoin.AddressType, label = '') {
    const params = addressType && this._network.segwitCapable ? [label, addressType] : [label]
    const newAddress = await this._rpc.jsonrpc('getnewaddress', ...params)

    if (!newAddress) return null

    return this.getAddressInfo(newAddress)
  }

  async getAddressInfo(address: string): Promise<Address> {
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

  async getAddresses() {
    return this.getUsedAddresses()
  }

  async getUnusedAddress() {
    return this.getNewAddress(this._addressType)
  }

  async getUsedAddresses() {
    const usedAddresses: bitcoin.rpc.AddressGrouping[] = await this._rpc.jsonrpc('listaddressgroupings')
    const emptyAddresses: bitcoin.rpc.ReceivedByAddress[] = await this._rpc.jsonrpc(
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
    if (this._network.protocolType == ProtocolType.BitcoinCash) return BIP70_CHAIN_TO_NETWORK_BCH[chain]
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
      address = (await this.getNewAddress(bitcoin.AddressType.LEGACY, secretAddressLabel)).address // Signing only possible with legacy addresses
    }
    const signedMessage = await this.signMessage(message, address)
    const secret = sha256(signedMessage)
    return secret
  }

  canUpdateFee() {
    return this._network.feeBumpCapable
  }
}
