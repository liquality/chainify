import KibaProvider from '@liquality/kiba-provider'
import { Address } from '@liquality/utils'
import * as bitcoin from 'bitcoinjs-lib'
import { calculateFee, getAddressNetwork } from '@liquality/bitcoin-utils'

import { version } from '../package.json'

const blockchain = 'bitcoin'

export default class BitcoinKibaProvider extends KibaProvider {
  constructor (kibaProvider, network, addressType = 'bech32') {
    super(kibaProvider, network)

    this._network = network
    this._addressType = addressType
  }

  async signMessage (message, from) {
    const method = 'SIGN_MESSAGE'
    const params = {
      blockchain,
      message,
      messageType: 'string'
    }

    const { data: signature } = await this.kiba(method, params)

    return signature
  }

  async getAccounts () {
    const method = 'GET_ACCOUNTS'
    const params = {
      blockchain
    }

    const accounts = await this.kiba(method, params)

    return accounts[0]
  }

  async getUnusedAddress (change = false) {
    const { address: accountAddress } = await this.getAccounts()

    const method = 'GET_UNUSED_ADDRESS'
    const params = {
      blockchain,
      account: {
        address: accountAddress,
        blockchain
      },
      change
    }

    const { address, publicKey } = await this.kiba(method, params)

    return new Address({
      address,
      publicKey: Buffer.from(publicKey)
    })
  }

  async getUsedAddresses (change = false) {
    const { address: accountAddress } = await this.getAccounts()

    const method = 'GET_USED_ADDRESSES'
    const params = {
      blockchain,
      account: {
        address: accountAddress,
        blockchain
      },
      change
    }

    const kibaAddresses = await this.kiba(method, params)

    const addresses = []

    for (let i = 0; i < kibaAddresses.length; i++) {
      const kibaAddress = kibaAddresses[i]
      const { address, publicKey } = kibaAddress
      addresses.push(new Address({
        address,
        publicKey: Buffer.from(publicKey.data)
      }))
    }

    return addresses
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    if (numAddresses < 1) { throw new Error('You must return at least one address') }

    const usedAddresses = await this.getUsedAddresses(change)
    const unusedAddress = await this.getUnusedAddress(change)

    const allAddresses = [...usedAddresses, unusedAddress]
    const addresses = []

    const lastIndex = startingIndex + numAddresses

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      if (currentIndex >= allAddresses.length) break

      const { address, publicKey } = allAddresses[currentIndex]

      addresses.push(new Address({
        address,
        publicKey: Buffer.from(publicKey),
        index: currentIndex
      }))
    }

    return addresses
  }

  async _buildTransaction (to, value) {
    value = value + calculateFee(3, 3, 9) // Currently Kiba assumes txfee is 5004 satoshis

    const method = 'SIGN_TXN'
    const params = {
      blockchain: 'bitcoin',
      amount: {
        value: parseFloat(parseInt(value) / 10e7).toString(),
        unit: 'bitcoin'
      },
      to,
      network: this._network.name === 'bitcoin' ? 'Mainnet' : 'Testnet3',
      coin: 'BTC'
    }

    const { signedTransaction } = await this.kiba(method, params)

    return signedTransaction
  }

  async buildTransaction (to, value) {
    return this._buildTransaction(to, value)
  }

  async sendTransaction (to, value) {
    const signedTransaction = await this._buildTransaction(to, value)
    return this.getMethod('sendRawTransaction')(signedTransaction)
  }

  async _buildBatchTransaction (outputs) {
    let transactions = []
    if (outputs.length === 0) {
      throw new Error(`transaction must have at least one output`)
    } else if (outputs.length > 1) {
      for (const output of outputs) {
        const { to, value } = output

        transactions.push({
          amount: {
            amount: parseFloat(parseInt(value) / 10e7).toString(),
            unit: {
              power: 0,
              value: 'bitcoin',
              text: 'bitcoin'
            }
          },
          to
        })
      }
    }

    const method = 'SIGN_BATCH_TXN'
    const params = {
      blockchain: 'bitcoin',
      transactions,
      network: this._network.name === 'bitcoin' ? 'Mainnet' : 'Testnet3',
      coin: 'BTC'
    }

    const { signedTransaction } = await this.kiba(method, params)

    return signedTransaction
  }

  async buildBatchTransaction (transactions) {
    return this._buildBatchTransaction(transactions)
  }

  async sendBatchTransaction (transactions) {
    const signedTransaction = await this._buildBatchTransaction(transactions)
    return this.getMethod('sendRawTransaction')(signedTransaction)
  }

  async signP2SHTransaction (inputTxHex, tx, address, vout, outputScript, lockTime = 0, segwit = false) {
    let sigHash
    if (segwit) {
      sigHash = tx.hashForWitnessV0(0, outputScript, vout.vSat, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
    } else {
      sigHash = tx.hashForSignature(0, outputScript, bitcoin.Transaction.SIGHASH_ALL)
    }

    const method = 'SIGN_P2SH_TXN'
    const params = {
      blockchain: 'bitcoin',
      transaction: {
        initiationTxRaw: inputTxHex,
        sigHash: sigHash.toString('hex'),
        address,
        vout,
        vOut: vout,
        outputScript: outputScript.toString('hex'),
        lockTime,
        segwit
      },
      network: this._network.name === 'bitcoin' ? 'Mainnet' : 'Testnet3',
      coin: 'BTC'
    }

    const { signature } = await this.kiba(method, params)
    const sig = Buffer.from(signature, 'hex')

    return sig
  }

  // inputs consists of [{ inputTxHex, index, vout, outputScript }]
  async signBatchP2SHTransaction (inputs, addresses, tx, lockTime = 0, segwit = false) {
    let sigHashes = []
    for (let i = 0; i < inputs.length; i++) {
      const index = inputs[i].txInputIndex ? inputs[i].txInputIndex : inputs[i].index
      let sigHash
      if (segwit) {
        sigHash = tx.hashForWitnessV0(index, inputs[i].outputScript, inputs[i].vout.vSat, bitcoin.Transaction.SIGHASH_ALL) // AMOUNT NEEDS TO BE PREVOUT AMOUNT
      } else {
        sigHash = tx.hashForSignature(index, inputs[i].outputScript, bitcoin.Transaction.SIGHASH_ALL)
      }

      sigHashes.push(sigHash)
    }

    const method = 'SIGN_BATCH_P2SH_TXN'
    const params = {
      blockchain: 'bitcoin',
      transaction: {
        inputsToSign: inputs,
        addresses,
        sigHashes,
        lockTime,
        segwit
      },
      network: this._network.name === 'bitcoin' ? 'Mainnet' : 'Testnet3',
      coin: 'BTC'
    }

    const { signatures } = await this.kiba(method, params)

    let sigs = []
    for (const signature of signatures) {
      sigs.push(Buffer.from(signature, 'hex'))
    }

    return sigs
  }

  async getWalletAddress (address) {
    let index = 0
    let change = false

    // A maximum number of addresses to lookup after which it is deemed
    // that the wallet does not contain this address
    const maxAddresses = 1000
    const addressesPerCall = 50

    while (index < maxAddresses) {
      const addrs = await this.getAddresses(index, addressesPerCall, change)
      const addr = addrs.find(addr => addr.equals(address))
      if (addr) return addr

      index += addressesPerCall
      if (index === maxAddresses && change === false) {
        index = 0
        change = true
      }
    }

    throw new Error('BitcoinJs: Wallet does not contain address')
  }

  async getConnectedNetwork () {
    const { address } = (await this.getAddresses(0, 1))[0]

    return getAddressNetwork(address)
  }
}

BitcoinKibaProvider.version = version
