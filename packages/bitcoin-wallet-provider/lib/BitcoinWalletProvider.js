import { AddressTypes, selectCoins, normalizeTransactionObject, decodeRawTransaction } from '@liquality/bitcoin-utils'
import { Address, addressToString, asyncSetImmediate } from '@liquality/utils'

import * as bitcoin from 'bitcoinjs-lib'
import { BigNumber } from 'bignumber.js'

const ADDRESS_GAP = 20
const NONCHANGE_ADDRESS = 0
const CHANGE_ADDRESS = 1
const NONCHANGE_OR_CHANGE_ADDRESS = 2

const ADDRESS_TYPE_TO_PREFIX = {
  'legacy': 44,
  'p2sh-segwit': 49,
  'bech32': 84
}

export default superclass => class BitcoinWalletProvider extends superclass {
  constructor (network, addressType = 'bech32', superArgs = []) {
    if (!AddressTypes.includes(addressType)) {
      throw new Error(`addressType must be one of ${AddressTypes.join(',')}`)
    }

    const baseDerivationPath = `${ADDRESS_TYPE_TO_PREFIX[addressType]}'/${network.coinType}'/0'`

    super(...superArgs)

    this._baseDerivationPath = baseDerivationPath
    this._network = network
    this._addressType = addressType
    this._addressesCache = {}
  }

  async buildTransaction (to, value, data, feePerByte) {
    return this._buildTransaction([{ to, value }], feePerByte)
  }

  async buildBatchTransaction (transactions) {
    return this._buildTransaction(transactions)
  }

  async _sendTransaction (transactions, feePerByte) {
    const { hex, fee } = await this._buildTransaction(transactions, feePerByte)
    await this.getMethod('sendRawTransaction')(hex)
    return normalizeTransactionObject(decodeRawTransaction(hex, this._network), fee)
  }

  async sendTransaction (to, value, data, feePerByte) {
    return this._sendTransaction([{ to, value }], feePerByte)
  }

  async sendBatchTransaction (transactions) {
    return this._sendTransaction(transactions)
  }

  async buildSweepTransaction (externalChangeAddress, feePerByte) {
    return this._buildSweepTransaction(externalChangeAddress, feePerByte)
  }

  async sendSweepTransaction (externalChangeAddress, feePerByte) {
    const { hex, fee } = await this._buildSweepTransaction(externalChangeAddress, feePerByte)
    await this.getMethod('sendRawTransaction')(hex)
    return normalizeTransactionObject(decodeRawTransaction(hex, this._network), fee)
  }

  async updateTransactionFee (tx, newFeePerByte) {
    const txHash = typeof tx === 'string' ? tx : tx.hash
    const transaction = (await this.getMethod('getTransactionByHash')(txHash))._raw
    const fixedInputs = [transaction.vin[0]] // TODO: should this pick more than 1 input? RBF doesn't mandate it

    const addressesPerCall = 50
    let changeOutput
    let index = 0
    while (index < 1000 && !changeOutput) {
      const changeAddresses = (await this.getAddresses(index, addressesPerCall, true)).map(a => a.address)
      changeOutput = transaction.vout.find(vout => changeAddresses.includes(vout.scriptPubKey.addresses[0]))
      index += addressesPerCall
    }

    let outputs = transaction.vout
    if (changeOutput) {
      outputs = outputs.filter(vout => vout.scriptPubKey.addresses[0] !== changeOutput.scriptPubKey.addresses[0])
    }

    // TODO more checks?
    const transactions = outputs.map(output =>
      ({ to: output.scriptPubKey.addresses[0], value: BigNumber(output.value).times(1e8).toNumber() })
    )
    const { hex, fee } = await this._buildTransaction(transactions, newFeePerByte, fixedInputs)
    await this.getMethod('sendRawTransaction')(hex)
    return normalizeTransactionObject(decodeRawTransaction(hex, this._network), fee)
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

    throw new Error('Wallet does not contain address')
  }

  getAddressFromPublicKey (publicKey) {
    return this.getPaymentVariantFromPublicKey(publicKey).address
  }

  getPaymentVariantFromPublicKey (publicKey) {
    if (this._addressType === 'legacy') {
      return bitcoin.payments.p2pkh({ pubkey: publicKey, network: this._network })
    } else if (this._addressType === 'p2sh-segwit') {
      return bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this._network }),
        network: this._network })
    } else if (this._addressType === 'bech32') {
      return bitcoin.payments.p2wpkh({ pubkey: publicKey, network: this._network })
    }
  }

  async importAddresses () {
    const change = await this.getAddresses(0, 200, true)
    const nonChange = await this.getAddresses(0, 200, false)
    const all = [...nonChange, ...change].map(addressToString)
    await this.getMethod('importAddresses')(all)
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    if (numAddresses < 1) { throw new Error('You must return at least one address') }

    const baseDerivationNode = await this.baseDerivationNode()

    const addresses = []
    const lastIndex = startingIndex + numAddresses
    const changeVal = change ? '1' : '0'

    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const subPath = changeVal + '/' + currentIndex
      const path = this._baseDerivationPath + '/' + subPath

      if (path in this._addressesCache) {
        addresses.push(this._addressesCache[path])
        continue
      }

      const publicKey = baseDerivationNode.derivePath(subPath).publicKey
      const address = this.getAddressFromPublicKey(publicKey)
      const addressObject = new Address({
        address,
        publicKey,
        derivationPath: path,
        index: currentIndex
      })

      this._addressesCache[path] = addressObject
      addresses.push(addressObject)

      await asyncSetImmediate()
    }

    return addresses
  }

  async _getUsedUnusedAddresses (numAddressPerCall = 100, addressType) {
    const usedAddresses = []
    const addressCountMap = { change: 0, nonChange: 0 }
    const unusedAddressMap = { change: null, nonChange: null }

    let addrList
    let addressIndex = 0
    let changeAddresses = []
    let nonChangeAddresses = []

    /* eslint-disable no-unmodified-loop-condition */
    while (
      (addressType === NONCHANGE_OR_CHANGE_ADDRESS && (
        addressCountMap.change < ADDRESS_GAP || addressCountMap.nonChange < ADDRESS_GAP)
      ) ||
      (addressType === NONCHANGE_ADDRESS && addressCountMap.nonChange < ADDRESS_GAP) ||
      (addressType === CHANGE_ADDRESS && addressCountMap.change < ADDRESS_GAP)
    ) {
      /* eslint-enable no-unmodified-loop-condition */
      addrList = []

      if ((addressType === NONCHANGE_OR_CHANGE_ADDRESS || addressType === CHANGE_ADDRESS) &&
           addressCountMap.change < ADDRESS_GAP) {
        // Scanning for change addr
        changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        addrList = addrList.concat(changeAddresses)
      } else {
        changeAddresses = []
      }

      if ((addressType === NONCHANGE_OR_CHANGE_ADDRESS || addressType === NONCHANGE_ADDRESS) &&
           addressCountMap.nonChange < ADDRESS_GAP) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      const transactionCounts = await this.getMethod('getAddressTransactionCounts')(addrList)

      for (let address of addrList) {
        const isUsed = transactionCounts[address] > 0
        const isChangeAddress = changeAddresses.find(a => address.equals(a))
        const key = isChangeAddress ? 'change' : 'nonChange'

        if (isUsed) {
          usedAddresses.push(address)
          addressCountMap[key] = 0
          unusedAddressMap[key] = null
        } else {
          addressCountMap[key]++

          if (!unusedAddressMap[key]) {
            unusedAddressMap[key] = address
          }
        }
      }

      addressIndex += numAddressPerCall
    }

    let firstUnusedAddress
    const indexNonChange = unusedAddressMap.nonChange ? unusedAddressMap.nonChange.index : Infinity
    const indexChange = unusedAddressMap.change ? unusedAddressMap.change.index : Infinity

    if (indexNonChange <= indexChange) firstUnusedAddress = unusedAddressMap.nonChange
    else firstUnusedAddress = unusedAddressMap.change

    return {
      usedAddresses,
      unusedAddress: unusedAddressMap,
      firstUnusedAddress
    }
  }

  async getUsedAddresses (numAddressPerCall = 100) {
    return this._getUsedUnusedAddresses(numAddressPerCall, NONCHANGE_OR_CHANGE_ADDRESS)
      .then(({ usedAddresses }) => usedAddresses)
  }

  async getUnusedAddress (change = false, numAddressPerCall = 100) {
    const addressType = change ? CHANGE_ADDRESS : NONCHANGE_ADDRESS
    const key = change ? 'change' : 'nonChange'
    return this._getUsedUnusedAddresses(numAddressPerCall, addressType)
      .then(({ unusedAddress }) => unusedAddress[key])
  }

  async getInputsForAmount (_targets = [], _feePerByte, fixedInputs = [], numAddressPerCall = 100, sweep = false) {
    let addressIndex = 0
    let changeAddresses = []
    let nonChangeAddresses = []
    let addressCountMap = {
      change: 0,
      nonChange: 0
    }

    const feePerBytePromise = this.getMethod('getFeePerByte')()
    let feePerByte = _feePerByte || false

    while (addressCountMap.change < ADDRESS_GAP || addressCountMap.nonChange < ADDRESS_GAP) {
      let addrList = []

      if (addressCountMap.change < ADDRESS_GAP) {
        // Scanning for change addr
        changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        addrList = addrList.concat(changeAddresses)
      } else {
        changeAddresses = []
      }

      if (addressCountMap.nonChange < ADDRESS_GAP) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      let utxos
      if (sweep === false || fixedInputs.length === 0) {
        utxos = await this.getMethod('getUnspentTransactions')(addrList)
        utxos = utxos.map(utxo => {
          const addr = addrList.find(a => a.equals(utxo.address))
          return {
            ...utxo,
            value: BigNumber(utxo.amount).times(1e8).toNumber(),
            derivationPath: addr.derivationPath
          }
        })
      } else {
        utxos = fixedInputs
      }

      const utxoBalance = utxos.reduce((a, b) => a + (b['value'] || 0), 0)

      const transactionCounts = await this.getMethod('getAddressTransactionCounts')(addrList)

      if (feePerByte === false) feePerByte = await feePerBytePromise
      const minRelayFee = await this.getMethod('getMinRelayFee')()
      if (feePerByte < minRelayFee) {
        throw new Error(`Fee supplied (${feePerByte} sat/b) too low. Minimum relay fee is ${minRelayFee} sat/b`)
      }

      if (fixedInputs.length) {
        for (const input of fixedInputs) {
          const txHex = await this.getMethod('getRawTransactionByHash')(input.txid)
          const tx = decodeRawTransaction(txHex, this._network)
          input.value = BigNumber(tx.vout[input.vout].value).times(1e8).toNumber()
          input.address = tx.vout[input.vout].scriptPubKey.addresses[0]
          const walletAddress = await this.getWalletAddress(input.address)
          input.derivationPath = walletAddress.derivationPath
        }
      }

      let targets
      if (sweep) {
        const outputBalance = _targets.reduce((a, b) => a + (b['value'] || 0), 0)

        const amountToSend = utxoBalance - (feePerByte * (((_targets.length + 1) * 39) + (utxos.length * 153))) // todo better calculation

        targets = _targets.map((target, i) => ({ id: 'main', value: target.value }))
        targets.push({ id: 'main', value: amountToSend - outputBalance })
      } else {
        targets = _targets.map((target, i) => ({ id: 'main', value: target.value }))
      }

      const { inputs, outputs, fee } = selectCoins(utxos, targets, Math.ceil(feePerByte), fixedInputs)

      if (inputs && outputs) {
        let change = outputs.find(output => output.id !== 'main')

        if (change && change.length) {
          change = change[0].value
        }

        return {
          inputs,
          change,
          outputs,
          fee
        }
      }

      for (let address of addrList) {
        const isUsed = transactionCounts[address.address]
        const isChangeAddress = changeAddresses.find(a => address.equals(a))
        const key = isChangeAddress ? 'change' : 'nonChange'

        if (isUsed) {
          addressCountMap[key] = 0
        } else {
          addressCountMap[key]++
        }
      }

      addressIndex += numAddressPerCall
    }

    throw new Error('Not enough balance')
  }
}
