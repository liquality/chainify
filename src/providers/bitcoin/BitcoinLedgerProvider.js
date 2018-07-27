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

  _getUnspentInputsForAmount (unspentInputs, amount) {
    let unspentInputsToUse = []
    let amountAccumulated = 0
    unspentInputs.every((utxo) => {
      amountAccumulated += utxo.value
      unspentInputsToUse.push(utxo)
      return (amountAccumulated < amount) // TODO: FEES?
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

  async sendTransaction (from, to, value) {
    await this._connectToLedger()

    const {addresses, unusedAddress, unspentInputs} = await this._getSpendingDetails()

    const unspentInputsToUse = this._getUnspentInputsForAmount(unspentInputs, value)

    const totalAmount = unspentInputsToUse.reduce((acc, input) => acc + input.value, 0)

    if (totalAmount < value) {
      throw new Error('Not enough balance')
    }

    const ledgerInputs = await this._getLedgerInputs(unspentInputsToUse)

    console.log(addresses)

    console.log(ledgerInputs)

    const paths = unspentInputsToUse.map(input => input.path)

    const changePath = unusedAddress.path

    console.log(changePath)

    console.log(paths)
  }
}
