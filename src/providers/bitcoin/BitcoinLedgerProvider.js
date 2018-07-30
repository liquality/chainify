import Provider from '../../Provider'

import axios from 'axios'
import Transport from '@alias/ledger-transport'
import LedgerBtc from '@ledgerhq/hw-app-btc'

export default class BitcoinLedgerProvider extends Provider {
  constructor () {
    super()
    this._ledgerBtc = false
    this._derivationPath = `44'/0'/0'/0`
  }

  async _connectToLedger () {
    if (!this._ledgerBtc) {
      const transport = await Transport.create()
      this._ledgerBtc = new LedgerBtc(transport)
    }
  }

  async _updateDerivationPath (path) {
    this._derivationPath = path
  }

  async getAddresses () {
    await this._connectToLedger()

    const { bitcoinAddress } = await this._ledgerBtc.getWalletPublicKey(this._derivationPath)

    return [ bitcoinAddress ]
  }

  async signMessage (message, from) {
    await this._connectToLedger()

    const hex = Buffer.from(message).toString('hex')

    return this._ledgerBtc.signMessageNew(this._derivationPath, hex)
  }

  async _getAddressDetails (address) {
    return (await axios.get(`https://testnet.blockchain.info/balance?active=${address}&cors=true`)).data[address]
  }

  async _getUnspentTransactions (address) {
    return (await axios.get(`https://testnet.blockchain.info/unspent?active=${address}&cors=true`)).data.unspent_outputs
  }

  async _getTransactionHex (transactionHash) {
    return (await axios.get(`https://testnet.blockchain.info/rawtx/${transactionHash}?format=hex&cors=true`)).data
  }

  async _getSpendingDetails () {
    let addresses = []
    let unspentInputs = []
    let unusedAddress
    let addressIndex = 0
    for (let addressHasTransactions = true; addressHasTransactions; ++addressIndex) {
      const path = `44'/0'/0'/${addressIndex}`
      const address = {
        ...(await this._ledgerBtc.getWalletPublicKey(path)),
        path
      }
      addresses.push(address)
      const addressDetails = await this._getAddressDetails(address.bitcoinAddress)
      addressHasTransactions = addressDetails.n_tx > 0
      if (addressHasTransactions) {
        let utxos = await this._getUnspentTransactions(address.bitcoinAddress)
        utxos = utxos.map((utxo) => ({
          ...utxo,
          path,
          address: address.bitcoinAddress
        }))
        unspentInputs.push.apply(unspentInputs, utxos)
      } else {
        unusedAddress = address
      }
    }

    return {
      addresses,
      unusedAddress,
      unspentInputs
    }
  }

  _getFee (numInputs, numOutputs, pricePerByte) { // TODO: lazy fee estimation
    return ((numInputs * 148) + (numOutputs * 34) + 10) * pricePerByte
  }

  _getUnspentInputsForAmount (unspentInputs, amount, numOutputs) {
    let unspentInputsToUse = []
    let amountAccumulated = 0
    unspentInputs.every((utxo) => {
      amountAccumulated += utxo.value
      unspentInputsToUse.push(utxo)
      return amountAccumulated < (amount + this._getFee(unspentInputsToUse.length, numOutputs, 3)) // TODO: hardcoded satoshi per byte
    })
    return unspentInputsToUse
  }

  async _getLedgerInputs (unspentInputs) {
    const ledgerInputs = []
    for (let unspentInput of unspentInputs) {
      const transactionHex = await this._getTransactionHex(unspentInput.tx_hash_big_endian)
      const tx = await this._ledgerBtc.splitTransaction(transactionHex)
      ledgerInputs.push([tx, unspentInput.tx_output_n])
    }
    return ledgerInputs
  }

  async sendTransaction (from, to, value, data) {
    await this._connectToLedger()

    const {addresses, unusedAddress, unspentInputs} = await this._getSpendingDetails()

    const unspentInputsToUse = this._getUnspentInputsForAmount(unspentInputs, value, 2)

    const fee = this._getFee(unspentInputsToUse.length, 2, 3) // TODO: hardcoded num outputs + satoshi per byte fee

    const totalAmount = unspentInputsToUse.reduce((acc, input) => acc + input.value, 0)

    if (totalAmount < value + fee) {
      throw new Error('Not enough balance')
    }

    const ledgerInputs = await this._getLedgerInputs(unspentInputsToUse)

    console.log(addresses)

    console.log(ledgerInputs)

    const paths = unspentInputsToUse.map(input => input.path)

    console.log(paths)

    const sendAmount = value
    const changeAmount = totalAmount - value - fee

    // OP_DUP OP_HASH160 <PUB_KEY> OP_EQUALVERIFY OP_CHECKSIG
    const sendP2PKHScript = `76a914${to}88ac`
    const changeP2PKHScript = `76a914${unusedAddress.bitcoinAddress}88ac`

    const outputs = [
      {amount: Buffer.alloc(8, sendAmount), script: Buffer.alloc(sendP2PKHScript.length / 2, sendP2PKHScript, 'hex')},
      {amount: Buffer.alloc(8, changeAmount), script: Buffer.alloc(changeP2PKHScript.length / 2, changeP2PKHScript, 'hex')}
    ]

    const serializedOutputs = this._ledgerBtc.serializeTransactionOutputs({ outputs })

    const signedTransaction = await this._ledgerBtc.createPaymentTransactionNew(ledgerInputs, paths, unusedAddress.path, serializedOutputs)

    return signedTransaction
  }
}
