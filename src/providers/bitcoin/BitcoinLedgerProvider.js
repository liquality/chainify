import LedgerProvider from '../LedgerProvider'
import Bitcoin from '@ledgerhq/hw-app-btc'

import { BigNumber } from 'bignumber.js'
import { base58, padHexStart } from '../../crypto'
import { pubKeyToAddress, addressToPubKeyHash } from './BitcoinUtil'
import Address from '../../Address'
import networks from '../../networks'

export default class BitcoinLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.bitcoin, segwit: true }) {
    super(Bitcoin, `${chain.segwit ? '49' : '44'}'/${chain.network.coinType}'/0'/0/`)
    this._network = chain.network
    this._segwit = chain.segwit
    this._coinType = chain.network.coinType
  }

  async getPubKey (from) {
    const app = await this.getApp()
    const derivationPath = from.derivationPath ||
      await this.getDerivationPathFromAddress(from)

    return app.getWalletPublicKey(derivationPath)
  }

  async getAddressFromDerivationPath (path) {
    const app = await this.getApp()
    const { bitcoinAddress } = await app.getWalletPublicKey(path, false, this._segwit)
    return new Address(bitcoinAddress, path)
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const derivationPath = from.derivationPath ||
      await this.getDerivationPathFromAddress(from)

    const hex = Buffer.from(message).toString('hex')
    return app.signMessageNew(derivationPath, hex)
  }

  async getUnusedAddress (from = {}) {
    let addressIndex = from.index || 0
    let unusedAddress = false

    while (!unusedAddress) {
      const path = this.getDerivationPathFromIndex(addressIndex)
      const address = await this.getAddressFromDerivationPath(path)
      const isUsed = await this.getMethod('isAddressUsed')(address.address)

      if (!isUsed) {
        unusedAddress = address
      }

      addressIndex++
    }

    return unusedAddress
  }

  getAmountBuffer (amount) {
    let hexAmount = BigNumber(amount).toString(16)
    hexAmount = padHexStart(hexAmount, 16)
    const valueBuffer = Buffer.from(hexAmount, 'hex')
    return valueBuffer.reverse()
  }

  async splitTransaction (transactionHex, isSegwitSupported) {
    const app = await this.getApp()

    return app.splitTransaction(transactionHex, isSegwitSupported)
  }

  async serializeTransactionOutputs (transactionHex) {
    const app = await this.getApp()

    return app.serializeTransactionOutputs(transactionHex)
  }

  async signP2SHTransaction (inputs, associatedKeysets, changePath, outputScriptHex) {
    const app = await this.getApp()

    return app.signP2SHTransaction(inputs, associatedKeysets, changePath, outputScriptHex)
  }

  createScript (address) {
    const type = base58.decode(address).toString('hex').substring(0, 2).toUpperCase()
    const pubKeyHash = addressToPubKeyHash(address)

    if (type === this._network.pubKeyHash) {
      return [
        '76', // OP_DUP
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '88', // OP_EQUALVERIFY
        'ac' // OP_CHECKSIG
      ].join('')
    } else if (type === this._network.scriptHash) {
      return [
        'a9', // OP_HASH160
        '14', // data size to be pushed
        pubKeyHash, // <PUB_KEY_HASH>
        '87' // OP_EQUAL
      ].join('')
    } else {
      throw new Error('Not a valid address:', address)
    }
  }

  calculateFee (numInputs, numOutputs, feePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * feePerByte
  }

  async getUtxosForAmount (amount, feePerByte = 3, maxAddresses = 20) {
    const utxosToUse = []
    let addressIndex = 0
    let currentAmount = 0
    let numOutputsOffset = 0

    while ((currentAmount < amount) && maxAddresses > 0) {
      const path = this.getDerivationPathFromIndex(addressIndex)
      const address = await this.getAddressFromDerivationPath(path)
      const utxos = await this.getMethod('getUnspentTransactions')(address.address)
      const utxosValue = utxos.reduce((acc, utxo) => acc + (utxo.amount * 1e8), 0)

      utxos.forEach((utxo) => {
        currentAmount += utxosValue
        utxo.derivationPath = address.derivationPath
        utxosToUse.push(utxo)

        const fees = this.calculateFee(utxosToUse.length, numOutputsOffset + 1)
        let totalCost = amount + fees

        if (numOutputsOffset === 0 && currentAmount > totalCost) {
          numOutputsOffset = 1
          totalCost -= fees
          totalCost += this.calculateFee(utxosToUse.length, 2, feePerByte)
        }
      })

      addressIndex++
      maxAddresses--
    }

    return utxosToUse
  }

  async getLedgerInputs (unspentOutputs) {
    const app = await this.getApp()

    return Promise.all(unspentOutputs.map(async utxo => {
      const hex = await this.getMethod('getTransactionHex')(utxo.txid)
      const tx = app.splitTransaction(hex, true)

      return [ tx, utxo.vout ]
    }))
  }

  async sendTransaction (to, value, data, from) {
    const app = await this.getApp()

    if (data) {
      const scriptPubKey = padHexStart(data)
      to = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    }

    const unusedAddress = await this.getUnusedAddress(from)
    const unspentOutputsToUse = await this.getUtxosForAmount(value)

    const totalAmount = unspentOutputsToUse.reduce((acc, utxo) => acc + BigNumber(utxo.amount).times(1e8).toNumber(), 0)
    const fee = this.calculateFee(unspentOutputsToUse.length, 1, 3)
    let totalCost = value + fee
    let hasChange = false

    if (totalAmount > totalCost) {
      hasChange = true

      totalCost -= fee
      totalCost += this.calculateFee(unspentOutputsToUse.length, 2, 3)
    }

    if (totalAmount < totalCost) {
      throw new Error('Not enough balance')
    }

    const ledgerInputs = await this.getLedgerInputs(unspentOutputsToUse)
    const paths = unspentOutputsToUse.map(utxo => utxo.derivationPath)

    const sendAmount = value
    const changeAmount = totalAmount - totalCost

    const sendScript = this.createScript(to)

    let outputs = [{ amount: this.getAmountBuffer(sendAmount), script: Buffer.from(sendScript, 'hex') }]

    if (hasChange) {
      const changeScript = this.createScript(unusedAddress.address)
      outputs.push({ amount: this.getAmountBuffer(changeAmount), script: Buffer.from(changeScript, 'hex') })
    }

    const serializedOutputs = app.serializeTransactionOutputs({ outputs }).toString('hex')
    const signedTransaction = await app.createPaymentTransactionNew(ledgerInputs, paths, unusedAddress.derivationPath, serializedOutputs)

    return this.getMethod('sendRawTransaction')(signedTransaction)
  }
}
