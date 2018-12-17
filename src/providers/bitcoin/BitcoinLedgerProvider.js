import LedgerProvider from '../LedgerProvider'
import Bitcoin from '@ledgerhq/hw-app-btc'

import { BigNumber } from 'bignumber.js'
import { base58, padHexStart, sha256, ripemd160 } from '../../crypto'
import { pubKeyToAddress, addressToPubKeyHash, compressPubKey, createXPUB, encodeBase58Check, parseHexString } from './BitcoinUtil'
import Address from '../../Address'
import networks from '../../networks'
import bip32 from 'bip32'

export default class BitcoinLedgerProvider extends LedgerProvider {
  constructor (chain = { network: networks.bitcoin, segwit: false }, numberOfBlockConfirmation = 1) {
    super(Bitcoin, `${chain.segwit ? '49' : '44'}'/${chain.network.coinType}'/0'/`)
    this._derivationPath = `${chain.segwit ? '49' : '44'}'/${chain.network.coinType}'/0'/`
    this._network = chain.network
    this._bjsnetwork = chain.network.name.replace('bitcoin_', '') // for bitcoin js
    this._segwit = chain.segwit
    this._coinType = chain.network.coinType
  }

  async getPubKey (from) {
    const app = await this.getApp()
    const derivationPath = from.derivationPath ||
    await this.getDerivationPathFromAddress(from)
    return app.getWalletPublicKey(derivationPath)
  }

  async getAddressExtendedPubKey (path) {
    const app = await this.getApp()
    var parts = path.split('/')
    var prevPath = parts[0] + '/' + parts[1]
    var account = parseInt(parts[2])
    var segwit = this._segwit
    var network = this._network.bip32.public
    const finalize = async fingerprint => {
      // var path = prevPath + '/' + account
      let nodeData = await app.getWalletPublicKey(path, undefined, segwit)
      var publicKey = compressPubKey(nodeData.publicKey)
      var childnum = (0x80000000 | account) >>> 0
      var xpub = createXPUB(
        3,
        fingerprint,
        childnum,
        nodeData.chainCode,
        publicKey,
        network
      )
      return encodeBase58Check(xpub)
    }

    let nodeData = await app.getWalletPublicKey(prevPath, undefined, segwit)
    var publicKey = compressPubKey(nodeData.publicKey)
    publicKey = parseHexString(publicKey)
    var result = sha256(Buffer.from(publicKey, 'hex'))
    result = ripemd160(result)
    var fingerprint =
      ((result[0] << 24) | (result[1] << 16) | (result[2] << 8) | result[3]) >>>
      0
    return finalize(fingerprint)
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

  async getUtxosForAmount (amount, numAddressPerCall = 10) {
    const utxosToUse = []
    const foundUnusedAddrMap = {
      change: false,
      nonChange: false
    }
    let totalCost = amount
    let addressIndex = 0
    let currentAmount = 0

    const cAddr = (await this.getUnusedAddress(true, numAddressPerCall)).address
    const ncAddr = (await this.getUnusedAddress(false, numAddressPerCall)).address
    const feePerByte = await this.getMethod('getFeePerByte')()

    while (currentAmount < totalCost) {
      let addrList = []

      if (foundUnusedAddrMap.change && foundUnusedAddrMap.nonChange) {
        if (currentAmount < totalCost) {
          // TODO: Better error
          throw new Error('Not Enough Balance')
        }
        break
      }

      if (!foundUnusedAddrMap.change) {
        // Scanning for change addr
        const changeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, true)
        const idxChangeAddr = changeAddresses.findIndex(a => a.address === cAddr)
        if (idxChangeAddr !== -1) {
          changeAddresses.length = idxChangeAddr
          foundUnusedAddrMap.change = true
        }
        addrList = addrList.concat(changeAddresses)
      }

      if (!foundUnusedAddrMap.nonChange) {
        // Scanning for non change addr
        const nonChangeAddresses = await this.getAddresses(addressIndex, numAddressPerCall, false)
        const idxNcAddr = nonChangeAddresses.findIndex(a => a.address === ncAddr)
        if (idxNcAddr !== -1) {
          nonChangeAddresses.length = idxNcAddr
          foundUnusedAddrMap.nonChange = true
        }
        addrList = addrList.concat(nonChangeAddresses)
      }

      let utxos = await this.getMethod('getAddressUtxos')(addrList.map(a => a.address))
      let utxosMempool = await this.getMethod('getAddressMempool')(addrList.map(a => a.address))
      utxos = utxos.filter(utxo => utxosMempool.filter(mempoolUtxo => utxo.txid === mempoolUtxo.prevtxid).length === 0)
      utxosMempool = utxosMempool.filter(utxo => utxosMempool.filter(mempoolUtxo => utxo.txid === mempoolUtxo.prevtxid).length === 0)
      utxosMempool = utxosMempool.filter(utxo => utxo.prevtxid === undefined)
      utxosMempool = utxosMempool.map(utxo => { utxo.outputIndex = utxo.index; return utxo })
      utxos = utxos.concat(utxosMempool)

      for (const utxo of utxos) {
        const utxoVal = utxo.satoshis
        if (utxoVal > 0) {
          currentAmount += utxoVal
          addrList.forEach(address => {
            if (address.address === utxo.address) {
              // TODO: use obj
              utxo.derivationPath = address.derivationPath
            }
          })
          // utxo.derivationPath = address.derivationPath
          utxosToUse.push(utxo)
          let fees = this.calculateFee(utxosToUse.length, 2, feePerByte)
          totalCost = amount + fees
          if (currentAmount > totalCost) {
            break
          }
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
    const addresses = []
    const lastIndex = startingIndex + numAddresses
    const changeVal = change ? '1' : '0'
    const xpubkeys = await this.getAddressExtendedPubKeys(this._baseDerivationPath)
    const node = bip32.fromBase58(xpubkeys[0], this._network)
    for (let currentIndex = startingIndex; currentIndex < lastIndex; currentIndex++) {
      const address = pubKeyToAddress(node.derivePath(changeVal + '/' + currentIndex).__Q, this._network.name, 'pubKeyHash')
      const path = this._baseDerivationPath + changeVal + '/' + currentIndex
      addresses.push({
        address,
        derivationPath: path,
        index: currentIndex
      })
    }

    return addresses
  }

  async getUnusedAddress (change = false, addressesPerCall = 20) {
    let unusedAddress = null
    let addressesIndex = 0
    while (!unusedAddress) {
      let addresses = await this.getLedgerAddresses(addressesIndex, addressesPerCall, change)
      const addressArr = addresses.map(address => address.address)
      let isUsed = await this.getMethod('getAddressBalances')(addressArr)
      const isUsedMempool = await this.getMethod('getAddressMempool')(addressArr)
      isUsed = isUsed.concat(isUsedMempool)
      const dataarr = isUsed.map(address => address.address)
      for (var i = 0; i < addresses.length; i++) {
        if (dataarr.indexOf(addresses[i].address) < 0) {
          unusedAddress = addresses[i]
          break
        }
      }
      addressesIndex += addressesPerCall
    }
    return unusedAddress
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this.getLedgerAddresses(startingIndex, numAddresses, change)
  }
}
