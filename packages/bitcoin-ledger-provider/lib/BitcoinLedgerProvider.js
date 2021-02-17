import LedgerProvider from '@liquality/ledger-provider'
import BitcoinWalletProvider from '@liquality/bitcoin-wallet-provider'

import {
  padHexStart
} from '@liquality/crypto'
import {
  compressPubKey,
  getAddressNetwork,
  decodeRawTransaction
} from '@liquality/bitcoin-utils'
import networks from '@liquality/bitcoin-networks'
import { addressToString } from '@liquality/utils'
import HwAppBitcoin from '@ledgerhq/hw-app-btc'
import { BigNumber } from 'bignumber.js'
import bip32 from 'bip32'
import * as bitcoin from 'bitcoinjs-lib'

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

    const outputScriptHex = app.serializeTransactionOutputs({ outputs }).toString('hex')

    const isSegwit = ['bech32', 'p2sh-segwit'].includes(this._addressType)

    const txHex = await app.createPaymentTransactionNew({
      inputs: ledgerInputs,
      associatedKeysets: paths,
      changePath: unusedAddress.derivationPath,
      outputScriptHex,
      segwit: isSegwit,
      useTrustedInputForSegwit: isSegwit,
      additionals: this._addressType === 'bech32' ? ['bech32'] : []
    })

    return { hex: txHex, fee }
  }

  // inputs consists of [{ index, derivationPath }]
  async signPSBT (data, inputs) {
    const psbt = bitcoin.Psbt.fromBase64(data, { network: this._network })
    const app = await this.getApp()

    const inputsArePubkey = psbt.txInputs.every((input, index) =>
      ['witnesspubkeyhash', 'pubkeyhash', 'p2sh-witnesspubkeyhash'].includes(psbt.getInputType(index))
    )

    if (inputsArePubkey && psbt.txInputs.length !== inputs.length) {
      throw new Error('signPSBT: Ledger must sign all inputs when they are all regular pub key hash payments.')
    }

    if (inputsArePubkey) {
      const ledgerInputs = await this.getLedgerInputs(psbt.txInputs.map(input => ({ txid: input.hash.reverse().toString('hex'), vout: input.index })))

      const getInputDetails = async (input) => {
        const txHex = await this.getMethod('getRawTransactionByHash')(input.hash.reverse().toString('hex'))
        const tx = decodeRawTransaction(txHex, this._network)
        const address = tx.vout[input.index].scriptPubKey.addresses[0]
        const walletAddress = await this.getWalletAddress(address)
        return walletAddress
      }

      const inputDetails = await Promise.all(psbt.txInputs.map(getInputDetails))
      const paths = inputDetails.map(i => i.derivationPath)
      const outputScriptHex = app.serializeTransactionOutputs({
        outputs: psbt.txOutputs.map(output => ({ script: output.script, amount: this.getAmountBuffer(output.value) }))
      }).toString('hex')
      const isSegwit = ['bech32', 'p2sh-segwit'].includes(this._addressType)
      const changeAddress = await this.findAddress(psbt.txOutputs.map(output => output.address), true)

      const txHex = await app.createPaymentTransactionNew({
        inputs: ledgerInputs,
        associatedKeysets: paths,
        changePath: changeAddress && changeAddress.derivationPath,
        outputScriptHex,
        segwit: isSegwit,
        useTrustedInputForSegwit: isSegwit,
        additionals: this._addressType === 'bech32' ? ['bech32'] : []
      })

      const signedTransaction = bitcoin.Transaction.fromHex(txHex)

      psbt.setVersion(1) // Ledger payment txs use v1 and there is no option to change it - fuck knows why
      for (const input of inputs) {
        const signer = {
          network: this._network,
          publicKey: inputDetails[input.index].publicKey,
          sign: async () => {
            const sigInput = signedTransaction.ins[input.index]
            if (sigInput.witness.length) {
              return bitcoin.script.signature.decode(sigInput.witness[0]).signature
            } else return sigInput.script
          }
        }

        await psbt.signInputAsync(input.index, signer)
      }

      return psbt.toBase64()
    }

    const ledgerInputs = []
    const walletAddresses = []
    let isSegwit = false

    for (const input of inputs) {
      const walletAddress = await this.getDerivationPathAddress(input.derivationPath)
      walletAddresses.push(walletAddress)
      const { witnessScript, redeemScript } = psbt.data.inputs[input.index]
      const { hash: inputHash, index: inputIndex } = psbt.txInputs[input.index]
      const outputScript = witnessScript || redeemScript
      const inputTxHex = await this.getMethod('getRawTransactionByHash')(inputHash.reverse().toString('hex'))
      const ledgerInputTx = await app.splitTransaction(inputTxHex, true)
      ledgerInputs.push([ledgerInputTx, inputIndex, outputScript.toString('hex'), 0])
      if (witnessScript) isSegwit = true
    }

    const ledgerTx = await app.splitTransaction(psbt.__CACHE.__TX.toHex(), true)
    const ledgerOutputs = await app.serializeTransactionOutputs(ledgerTx)

    const ledgerSigs = await app.signP2SHTransaction({
      inputs: ledgerInputs,
      associatedKeysets: walletAddresses.map(address => address.derivationPath),
      outputScriptHex: ledgerOutputs.toString('hex'),
      lockTime: psbt.locktime,
      segwit: isSegwit,
      transactionVersion: 2
    })

    for (const input of inputs) {
      const signer = {
        network: this._network,
        publicKey: walletAddresses[input.index].publicKey,
        sign: async () => {
          const finalSig = isSegwit ? ledgerSigs[input.index] : ledgerSigs[input.index] + '01' // Is this a ledger bug? Why non segwit signs need the sighash appended?
          const { signature } = bitcoin.script.signature.decode(Buffer.from(finalSig, 'hex'))
          return signature
        }
      }

      await psbt.signInputAsync(input.index, signer)
    }

    return psbt.toBase64()
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
    hexAmount = padHexStart(hexAmount, 8)
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
    if (this._baseDerivationNode) return this._baseDerivationNode

    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const compressedPubKey = compressPubKey(walletPubKey.publicKey)
    this._baseDerivationNode = bip32.fromPublicKey(
      Buffer.from(compressedPubKey, 'hex'),
      Buffer.from(walletPubKey.chainCode, 'hex'),
      this._network
    )
    return this._baseDerivationNode
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
