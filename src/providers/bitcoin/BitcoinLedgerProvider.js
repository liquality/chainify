import LedgerProvider from '../LedgerProvider'
import Bitcoin from '@ledgerhq/hw-app-btc'

import { BigNumber } from 'bignumber.js'
import { base58, padHexStart } from '../../crypto'
import { pubKeyToAddress, addressToPubKeyHash, compressPubKey } from './BitcoinUtil'
import Address from '../../Address'
import networks from './networks'
import bip32 from 'bip32'

export default class BitcoinLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.bitcoin, segwit: false }, numberOfBlockConfirmation = 1) {
    super(Bitcoin, `${chain.segwit ? '49' : '44'}'/${chain.network.coinType}'/0'/`)
    this._derivationPath = `${chain.segwit ? '49' : '44'}'/${chain.network.coinType}'/0'/`
    this._network = chain.network
    this._bjsnetwork = chain.network.name.replace('bitcoin_', '') // for bitcoin js
    this._segwit = chain.segwit
    this._coinType = chain.network.coinType
    this._walletPublicKeyCache = {}
  }

  async _getWalletPublicKey (path) {
    const app = await this.getApp()
    return app.getWalletPublicKey(path, undefined, this._segwit)
  }

  async getWalletPublicKey (path) {
    if (path in this._walletPublicKeyCache) {
      return this._walletPublicKeyCache[path]
    }

    const walletPublicKey = this._getWalletPublicKey(path)
    this._walletPublicKeyCache[path] = walletPublicKey
    return walletPublicKey
  }

  async getAddressFromDerivationPath (path) {
    const app = await this.getApp()
    const { bitcoinAddress } = await app.getWalletPublicKey(path, false, this._segwit)
    return new Address(bitcoinAddress, path)
  }

  async signMessage (message, from) {
    const app = await this.getApp()
    const address = await this.getWalletAddress(from)
    const hex = Buffer.from(message).toString('hex')
    return app.signMessageNew(address.derivationPath, hex)
  }

  // async getUnusedAddress (from = {}) {
  //   let addressIndex = from.index || 0
  //   let unusedAddress = false
  //
  //   while (!unusedAddress) {
  //     const address = await this.getAddressFromIndex(addressIndex)
  //     const isUsed = await this.getMethod('isAddressUsed')(address.address)
  //
  //     if (!isUsed) {
  //       unusedAddress = address
  //     }
  //
  //     addressIndex++
  //   }
  //
  //   return unusedAddress
  // }

  getAmountBuffer (amount) {
    let hexAmount = BigNumber(Math.round(amount)).toString(16)
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

  /*
  async getUtxosForAmount (amount, numAddressPerCall = 10) {
    console.log('getUtxosForAmount', amount, numAddressPerCall)
    const utxosToUse = []
    let addressIndex = 0
    let currentAmount = 0
    let numOutputsOffset = 0

    const feePerByte = await this.getMethod('getFeePerByte')(this._numberOfBlockConfirmation)

    while (currentAmount < amount) {
      console.log('getUtxosForAmount', currentAmount, amount)

      //const addresses = await this.getAddresses(addressIndex, numAddressPerCall)
      const addresses = await this.getAddressExtendedPubKeys(addressIndex)
      var bjs = require('bitcoinjs-lib')
      var node = bjs.HDNode.fromBase58(xpubkeys[0], bjs.networks.mainnet);
      for ( var i = 0; i < 200; i++ ) {
        console.log('addy', node.derivePath('0/' + i).getAddress());
        console.log('change', node.derivePath('1/' + i).getAddress());
      }

      const addressList = addresses.map(addr => addr.address)
      //console.log('getUtxosForAmount', addresses, addressList)

      const utxos = await this.getMethod('getAddressUtxos')(addressList)
      console.log('Address UTXOs', utxos, addressList)

      utxos.forEach((utxo) => {
        if (currentAmount < amount) {
          const utxoVal = utxo.satoshis
          if (utxoVal > 0) {
            currentAmount += utxoVal
            addresses.forEach((address) => {
              if (address.address === utxo.address) {
                utxo.derivationPath = address.derivationPath
              }
            })
            utxosToUse.push(utxo)

            const fees = this.calculateFee(utxosToUse.length, numOutputsOffset + 1)
            let totalCost = amount + fees

            if (numOutputsOffset === 0 && currentAmount > totalCost) {
              numOutputsOffset = 1
              totalCost -= fees
              totalCost += this.calculateFee(utxosToUse.length, 2, feePerByte)
            }
          }
        }
      })
      addressIndex += numAddressPerCall
    }
    return utxosToUse
  }
  */

  async getUtxosForAmount (amount, numAddressPerCall = 100) {
    const addressGap = 20
    const utxosToUse = []
    let totalCost = amount
    let addressIndex = 0
    let currentAmount = 0
    let changeAddresses = []
    let plainChangeAddresses = []
    let nonChangeAddresses = []
    let addressCountMap = {
      change: 0,
      nonChange: 0
    }

    const feePerBytePromise = this.getMethod('getFeePerByte')()
    let feePerByte = false

    while (currentAmount < totalCost) {
      let addrList = []

      if (addressCountMap.change >= addressGap && addressCountMap.nonChange >= addressGap) {
        if (currentAmount < totalCost) {
          // TODO: Better error
          throw new Error('Not Enough Balance')
        }
        break
      }

      if (addressCountMap.change < addressGap) {
        // Scanning for change addr
        changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        plainChangeAddresses = changeAddresses.map(a => a.address)
        addrList = addrList.concat(changeAddresses)
      } else {
        plainChangeAddresses = []
      }

      if (addressCountMap.nonChange < addressGap) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      const stringAddresses = addrList.map(a => a.address)
      let [ confirmedAdd, utxosMempool, utxos ] = await Promise.all([
        this.getMethod('getAddressBalances')(stringAddresses),
        this.getMethod('getAddressMempool')(stringAddresses),
        this.getMethod('getAddressUtxos')(stringAddresses)
      ])
      const usedAddresses = confirmedAdd.concat(utxosMempool).map(address => address.address)
      for (let i = 0; i < stringAddresses.length; i++) {
        const address = stringAddresses[i]
        const isUsed = usedAddresses.indexOf(address) !== -1
        const isChangeAddress = plainChangeAddresses.indexOf(address) !== -1
        const key = isChangeAddress ? 'change' : 'nonChange'

        if (isUsed) {
          addressCountMap[key] = 0
        } else {
          addressCountMap[key]++
        }
      }

      utxos = utxos
        .filter(utxo => utxosMempool.filter(mempoolUtxo => utxo.txid === mempoolUtxo.prevtxid).length === 0)
      utxosMempool = utxosMempool
        .filter(utxo => utxosMempool.filter(mempoolUtxo => utxo.txid === mempoolUtxo.prevtxid).length === 0)
        .filter(utxo => utxo.prevtxid === undefined)
        .map(utxo => { utxo.outputIndex = utxo.index; return utxo })
      utxos = utxos.concat(utxosMempool)

      if (feePerByte === false) feePerByte = await feePerBytePromise

      for (const utxo of utxos) {
        const utxoVal = utxo.satoshis
        if (utxoVal > 0) {
          currentAmount += utxoVal
          addrList.forEach(address => {
            if (address.address === utxo.address) {
              utxo.derivationPath = address.derivationPath
            }
          })
          utxosToUse.push(utxo)
          totalCost = amount + this.calculateFee(utxosToUse.length, 2, feePerByte)
          if (currentAmount > totalCost) break
        }
      }

      addressIndex += numAddressPerCall
    }

    return utxosToUse
  }

  // async getUtxosForAmount (amount, feePerByte) {
  //   const utxosToUse = []
  //   let addressIndex = 0
  //   let currentAmount = 0
  //   let totalCost = amount
  //   let fees = 0
  //
  //   while ((currentAmount < totalCost)) {
  //     const address = await this.getAddressFromIndex(addressIndex)
  //
  //     if (addressIndex >= 20) { // Skip checking whether address is unused for first 20
  //       const isAddressUsed = await this.getMethod('isAddressUsed')(address.address)
  //       if (!isAddressUsed) break
  //     }
  //     const utxos = await this.getMethod('getUnspentTransactions')(address.address)
  //     for (const utxo of utxos) {
  //       const utxoVal = utxo.satoshis
  //       if (utxoVal > 0) {
  //         currentAmount += utxoVal
  //         utxo.derivationPath = address.derivationPath
  //         utxosToUse.push(utxo)
  //         fees = this.calculateFee(utxosToUse.length, 2, feePerByte)
  //         totalCost = amount + fees
  //         if (currentAmount > totalCost) break
  //       }
  //     }
  //
  //     addressIndex++
  //   }
  //
  //   return utxosToUse
  // }

  async getLedgerInputs (unspentOutputs) {
    const app = await this.getApp()

    return Promise.all(unspentOutputs.map(async utxo => {
      const hex = await this.getMethod('getTransactionHex')(utxo.txid)
      const tx = app.splitTransaction(hex, true)
      const vout = ('vout' in utxo) ? utxo.vout : utxo.outputIndex

      return [ tx, vout ]
    }))
  }

  async getWalletInfo (numAddressPerCall = 10, from = {}) {
    let addressIndex = from.index || 0
    let unusedAddress = false
    let usedAddresses = []
    let balance = 0

    while (!unusedAddress) {
      let addresses = await this.getAddresses(addressIndex, numAddressPerCall)
      const addressList = addresses.map(addr => addr.address)

      const addressDeltas = await this.getMethod('getAddressDeltas')(addressList)

      addressDeltas.forEach((delta) => {
        const addressIndex = addresses.findIndex(address => address.address === delta.address)
        if (addresses[addressIndex].balance === undefined) { addresses[addressIndex].balance = 0 }
        addresses[addressIndex].balance += delta.satoshis
        balance += delta.satoshis
      })

      addresses.forEach((address) => {
        if (!unusedAddress) {
          if (address.balance === undefined) {
            unusedAddress = address.address
          } else {
            usedAddresses.push(address.address)
          }
        }
      })

      addressIndex += numAddressPerCall
    }
    return { balance, unusedAddress, usedAddresses }
  }

  async sendTransaction (to, value, data, from) {
    const [ feePerByte, app ] = await Promise.all([
      this.getMethod('getFeePerByte')(),
      this.getApp()
    ])

    if (data) {
      const scriptPubKey = padHexStart(data)
      to = pubKeyToAddress(scriptPubKey, this._network.name, 'scriptHash')
    }
    const unusedAddress = await this.getUnusedAddress(true)
    // const unspentOutputsToUse = await this.getUtxosForAmount(value, feePerByte)
    const unspentOutputsToUse = await this.getUtxosForAmount(value)
    const totalAmount = unspentOutputsToUse.reduce((acc, utxo) => acc + utxo.satoshis, 0)
    const fee = this.calculateFee(unspentOutputsToUse.length, 1, feePerByte)
    let totalCost = value + fee
    let hasChange = false

    if (totalAmount > totalCost) {
      hasChange = true

      totalCost -= fee
      totalCost += this.calculateFee(unspentOutputsToUse.length, 2, feePerByte)
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

  async getLedgerAddresses (startingIndex, numAddresses, change = false) {
    const walletPubKey = await this.getWalletPublicKey(this._baseDerivationPath)
    const compressedPubKey = compressPubKey(walletPubKey.publicKey)
    const node = bip32.fromPublicKey(
      Buffer.from(compressedPubKey, 'hex'),
      Buffer.from(walletPubKey.chainCode, 'hex'),
      this._network
    )

    const addresses = []
    const lastIndex = startingIndex + numAddresses
    const changeVal = change ? '1' : '0'
    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const subPath = changeVal + '/' + currentIndex
      const publicKey = node.derivePath(subPath).publicKey
      const address = pubKeyToAddress(publicKey, this._network.name, 'pubKeyHash')
      const path = this._baseDerivationPath + subPath
      addresses.push({
        address,
        publicKey: publicKey.toString('hex'),
        derivationPath: path,
        index: currentIndex
      })
    }

    return addresses
  }

  // addressType
  // nonChange: 0
  // change: 1
  // both: 2
  async _getUsedUnusedAddresses (numAddressPerCall = 100, addressType) {
    const addressGap = 20
    const usedAddresses = []
    const addressCountMap = { change: 0, nonChange: 0 }
    let unusedAddresses = []
    let addressIndex = 0
    let changeAddresses = []
    let plainChangeAddresses = []
    let nonChangeAddresses = []

    /* eslint-disable no-unmodified-loop-condition */
    while ((addressType === 2 && (addressCountMap.change < addressGap || addressCountMap.nonChange < addressGap)) ||
           (addressType === 0 && addressCountMap.nonChange < addressGap) ||
           (addressType === 1 && addressCountMap.change < addressGap)) {
      /* eslint-enable no-unmodified-loop-condition */
      let addrList = []

      if ((addressType === 2 || addressType === 1) && addressCountMap.change < addressGap) {
        // Scanning for change addr
        changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        plainChangeAddresses = changeAddresses.map(a => a.address)
        addrList = addrList.concat(changeAddresses)
      } else {
        plainChangeAddresses = []
      }

      if ((addressType === 2 || addressType === 0) && addressCountMap.nonChange < addressGap) {
        // Scanning for non change addr
        nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        addrList = addrList.concat(nonChangeAddresses)
      }

      const stringAddresses = addrList.map(a => a.address)
      const [ confirmedAdd, utxosMempool ] = await Promise.all([
        this.getMethod('getAddressBalances')(stringAddresses),
        this.getMethod('getAddressMempool')(stringAddresses)
      ])
      const totalUsedAddresses = confirmedAdd.concat(utxosMempool).map(address => address.address)
      for (let i = 0; i < addrList.length; i++) {
        const address = stringAddresses[i]
        const isUsed = totalUsedAddresses.indexOf(address) !== -1
        const isChangeAddress = plainChangeAddresses.indexOf(address) !== -1
        const key = isChangeAddress ? 'change' : 'nonChange'

        if (isUsed) {
          usedAddresses.push(addrList[i])
          addressCountMap[key] = 0
          unusedAddresses = []
        } else {
          addressCountMap[key]++
          unusedAddresses.push(addrList[i])
        }
      }

      addressIndex += numAddressPerCall
    }

    return {
      usedAddresses,
      unusedAddresses
    }
  }

  async getUsedAddresses (numAddressPerCall = 100) {
    return this._getUsedUnusedAddresses(numAddressPerCall, 2)
      .then(({ usedAddresses }) => usedAddresses)
  }

  async getUnusedAddress (change = false, numAddressPerCall = 100) {
    const addressType = change ? 1 : 0
    return this._getUsedUnusedAddresses(numAddressPerCall, addressType)
      .then(({ unusedAddresses }) => unusedAddresses[0])
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this.getLedgerAddresses(startingIndex, numAddresses, change)
  }
}
