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

  async _getAddressDetails(address) {
    return (await axios.get(`https://testnet.blockchain.info/balance?active=${address}&cors=true`)).data[address]
  }

  async _getUnspentTransactions(address) {
    return (await axios.get(`https://testnet.blockchain.info/unspent?active=${address}&cors=true`)).data.unspent_outputs
  }

  async _getUnspentInputs(amount) { // TODO: actually implement this properly
    const getAddressAtIndex = async (index) => this._ledgerBtc.getWalletPublicKey(`44'/0'/0'/${index}`)

    let unspentInputs = []
    let unusedAddress
    let currentPath = 0
    for (let addressHasTransactions = true; addressHasTransactions; ++currentPath) {
      const address = await getAddressAtIndex(currentPath)
      const addressDetails = await this._getAddressDetails(address.bitcoinAddress)
      addressHasTransactions = addressDetails.n_tx > 0
      if (addressHasTransactions) {
        const utxos = await this._getUnspentTransactions(address.bitcoinAddress)
        unspentInputs.push.apply(unspentInputs, utxos)
      } else {
        unusedAddress = address
      }
    }

    return {
      unusedAddress,
      unspentInputs
    }
  }

  async _getUnspentInputsToUse (amount, utxos) {
    let unspentInputsToUse = []
    let amountAccumulated = 0
    const unspentInputs = this._getUnspentInputs(amount)
    unspentInputs.every((utxo) => {
      amountAccumulated += utxo.value
      unspentInputsToUse.push(utxo)
      return (amountAccumulated > amount)
    })
  }

  async sendTransaction (from, to, value) {
    await this._connectToLedger()

    const inputs = await this._getInputs(value)

    console.log(addresses)

    // console.log(addresses)
    // find UTXOs for addresses[0]

    // this._ledgerBtc.createPaymentTransactionNew()
  }
}
