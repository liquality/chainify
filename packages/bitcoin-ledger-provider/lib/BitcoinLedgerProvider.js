import { BigNumber } from 'bignumber.js'
import bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'

import LedgerProvider from '@liquality/ledger-provider'
import BitcoinWalletProvider from '@liquality/bitcoin-wallet-provider'
import HwAppBitcoin from '@ledgerhq/hw-app-btc'

import {
  padHexStart
} from '@liquality/crypto'
import {
  compressPubKey,
  getAddressNetwork
} from '@liquality/bitcoin-utils'
import networks from '@liquality/bitcoin-networks'
import { addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class BitcoinLedgerProvider extends BitcoinWalletProvider(LedgerProvider) {
  constructor (network = networks.bitcoin, addressType = 'bech32') {
    super(network, addressType, [HwAppBitcoin, network, 'BTC'])
    this._walletPublicKeyCache = {}
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    const sig = await app.signMessageNew(address.derivationPath, hex)
    return sig.r + sig.s
  }

  async _buildTransaction (_outputs, feePerByte, fixedInputs) {
    const app = await this.getApp()

    const unusedAddress = await this.getUnusedAddress(true)
    const { inputs, change, fee } = await this.getInputsForAmount(_outputs, feePerByte, fixedInputs)
    const ledgerInputs = await this.getLedgerInputs(inputs)
    const paths = inputs.map(utxo => utxo.derivationPath)

    const outputs = _outputs.map(output => {
      const outputScript = Buffer.isBuffer(output.to) ? output.to : bitcoin.address.toOutputScript(output.to, this._network) // Allow for OP_RETURN
      return { amount: this.getAmountBuffer(output.value), script: outputScript }
    })

    if (change) {
      outputs.push({
        amount: this.getAmountBuffer(change.value),
        script: bitcoin.address.toOutputScript(addressToString(unusedAddress), this._network)
      })
    }

    const serializedOutputs = app.serializeTransactionOutputs({ outputs }).toString('hex')

    return { hex: await app.createPaymentTransactionNew(
      ledgerInputs,
      paths,
      unusedAddress.derivationPath,
      serializedOutputs,
      undefined,
      undefined,
      ['bech32', 'p2sh-segwit'].includes(this._addressType),
      undefined,
      this._addressType === 'bech32' ? ['bech32'] : undefined
    ),
    fee }
  }

  async signP2SHTransaction (inputTxHex, tx, address, vout, outputScript, lockTime = 0, segwit = false) {
    const app = await this.getApp()
    const walletAddress = await this.getWalletAddress(address)

    if (!segwit) {
      tx.setInputScript(vout.n, outputScript) // TODO: is this ok for p2sh-segwit??
    }

    const ledgerInputTx = await app.splitTransaction(inputTxHex, true)
    const ledgerTx = await app.splitTransaction(tx.toHex(), true)
    const ledgerOutputs = (await app.serializeTransactionOutputs(ledgerTx)).toString('hex')
    const ledgerSig = await app.signP2SHTransaction(
      [[ledgerInputTx, vout.n, outputScript.toString('hex'), 0]],
      [walletAddress.derivationPath],
      ledgerOutputs.toString('hex'),
      lockTime,
      undefined, // SIGHASH_ALL
      segwit,
      2
    )

    const finalSig = segwit ? ledgerSig[0] : ledgerSig[0] + '01' // Is this a ledger bug? Why non segwit signs need the sighash appended?
    const sig = Buffer.from(finalSig, 'hex')

    return sig
  }

  // inputs consists of [{ inputTxHex, index, vout, outputScript }]
  async signBatchP2SHTransaction (inputs, addresses, tx, lockTime = 0, segwit = false) {
    const app = await this.getApp()

    let walletAddressDerivationPaths = []
    for (const address of addresses) {
      const walletAddress = await this.getWalletAddress(address)
      walletAddressDerivationPaths.push(walletAddress.derivationPath)
    }

    if (!segwit) {
      for (const input of inputs) {
        tx.setInputScript(input.vout.n, input.outputScript)
      }
    }

    const ledgerTx = await app.splitTransaction(tx.toHex(), true)
    const ledgerOutputs = (await app.serializeTransactionOutputs(ledgerTx)).toString('hex')

    let ledgerInputs = []
    for (const input of inputs) {
      const ledgerInputTx = await app.splitTransaction(input.inputTxHex, true)
      ledgerInputs.push([ledgerInputTx, input.index, input.outputScript.toString('hex'), 0])
    }

    const ledgerSigs = await app.signP2SHTransaction(
      ledgerInputs,
      walletAddressDerivationPaths,
      ledgerOutputs.toString('hex'),
      lockTime,
      undefined,
      segwit,
      2
    )

    let finalLedgerSigs = []
    for (const ledgerSig of ledgerSigs) {
      const finalSig = segwit ? ledgerSig : ledgerSig + '01'
      finalLedgerSigs.push(Buffer.from(finalSig, 'hex'))
    }

    return finalLedgerSigs
  }

  getAmountBuffer (amount) {
    let hexAmount = BigNumber(Math.round(amount)).toString(16)
    hexAmount = padHexStart(hexAmount, 16)
    const valueBuffer = Buffer.from(hexAmount, 'hex')
    return valueBuffer.reverse()
  }

  async getLedgerInputs (unspentOutputs) {
    const app = await this.getApp()

    return Promise.all(unspentOutputs.map(async utxo => {
      const hex = await this.getMethod('getTransactionHex')(utxo.txid)
      const tx = app.splitTransaction(hex, true)
      return [ tx, utxo.vout, undefined, 0 ]
    }))
  }

  async _getWalletPublicKey (path) {
    const app = await this.getApp()
    const format = this._addressType === 'p2sh-segwit' ? 'p2sh' : this._addressType
    return app.getWalletPublicKey(path, { format: format })
  }

  async getWalletPublicKey (path) {
    if (path in this._walletPublicKeyCache) {
      return this._walletPublicKeyCache[path]
    }

    const walletPublicKey = await this._getWalletPublicKey(path)
    this._walletPublicKeyCache[path] = walletPublicKey
    return walletPublicKey
  }

  async baseDerivationNode () {
    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const compressedPubKey = compressPubKey(walletPubKey.publicKey)
    const node = bip32.fromPublicKey(
      Buffer.from(compressedPubKey, 'hex'),
      Buffer.from(walletPubKey.chainCode, 'hex'),
      this._network
    )
    return node
  }

  async getConnectedNetwork () {
    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const network = getAddressNetwork(walletPubKey.bitcoinAddress)
    // Bitcoin Ledger app does not distinguish between regtest & testnet
    if (this._network.name === networks.bitcoin_regtest.name &&
      network.name === networks.bitcoin_testnet.name) {
      return networks.bitcoin_regtest
    }
    return network
  }
}

BitcoinLedgerProvider.version = version
