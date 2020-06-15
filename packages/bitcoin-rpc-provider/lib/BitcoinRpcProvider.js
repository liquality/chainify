import { isArray, flatten } from 'lodash'
import BigNumber from 'bignumber.js'

import JsonRpcProvider from '@liquality/jsonrpc-provider'
import { addressToString } from '@liquality/utils'

import { version } from '../package.json'

export default class BitcoinRpcProvider extends JsonRpcProvider {
  constructor (uri, username, password, numberOfBlockConfirmation = 1, defaultFeePerByte = 3) {
    super(uri, username, password)
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte
  }

  async decodeRawTransaction (rawTransaction) {
    const data = await this.jsonrpc('decoderawtransaction', rawTransaction)
    const { txid: hash, vout } = data
    const value = vout.reduce((p, n) => p + parseInt(n.value), 0)
    const output = { hash, value, _raw: { hex: rawTransaction, data } }
    return output
  }

  async getFeePerByte (numberOfBlocks = this._numberOfBlockConfirmation) {
    try {
      const { feerate } = await this.jsonrpc('estimatesmartfee', numberOfBlocks)

      if (feerate && feerate > 0) {
        return Math.ceil((feerate * 1e8) / 1024)
      }

      throw new Error('Invalid estimated fee')
    } catch (e) {
      return this._defaultFeePerByte
    }
  }

  async getMinRelayFee () {
    const { relayfee } = await this.jsonrpc('getnetworkinfo')
    return relayfee * 1e8
  }

  async withTxFee (func, feePerByte) {
    const feePerKB = BigNumber(feePerByte).div(1e8).times(1000).toNumber()
    const originalTxFee = (await this.jsonrpc('getwalletinfo')).paytxfee
    await this.jsonrpc('settxfee', feePerKB)

    const result = await func()

    await this.jsonrpc('settxfee', originalTxFee)

    return result
  }

  async sendTransaction (to, value, data, feePerByte) {
    to = addressToString(to)
    value = BigNumber(value).dividedBy(1e8).toNumber()

    const send = async () => {
      return this.jsonrpc('sendtoaddress', to, value, '', '', false, true)
    }

    return feePerByte ? this.withTxFee(send, feePerByte) : send()
  }

  async updateTransactionFee (txHash, newFeePerByte) {
    return this.withTxFee(async () => {
      const result = await this.jsonrpc('bumpfee', txHash)
      return result.txid
    }, newFeePerByte)
  }

  async isAddressUsed (address) {
    const amountReceived = await this.getReceivedByAddress(address)

    return amountReceived > 0
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [ addresses ]
    }

    const _utxos = await this.getUnspentTransactions(addresses)
    const utxos = flatten(_utxos)

    return utxos
      .reduce((acc, utxo) => acc.plus(utxo.satoshis), new BigNumber(0))
  }

  async getUnspentTransactions (addresses) {
    addresses = addresses.map(addressToString)
    const utxos = await this.jsonrpc('listunspent', 0, 9999999, addresses)
    return utxos.map(utxo => ({ ...utxo, satoshis: BigNumber(utxo.amount).times(1e8).toNumber() }))
  }

  async getAddressTransactionCounts (addresses) {
    const receivedAddresses = await this.jsonrpc('listreceivedbyaddress', 0, false, true)
    const transactionCountsArray = addresses.map(addr => {
      const receivedAddress = receivedAddresses.find(receivedAddress => receivedAddress.address === addressToString(addr))
      const transactionCount = receivedAddress ? receivedAddress.txids.length : 0
      return { [addressToString(addr)]: transactionCount }
    })
    const transactionCounts = Object.assign({}, ...transactionCountsArray)
    return transactionCounts
  }

  async getReceivedByAddress (address) {
    address = addressToString(address)
    return this.jsonrpc('getreceivedbyaddress', address)
  }

  async importAddresses (addresses) {
    const request = addresses.map(address => ({ scriptPubKey: { address }, timestamp: 0 }))
    return this.jsonrpc('importmulti', request)
  }

  async getTransactionHex (transactionHash) {
    return this.jsonrpc('getrawtransaction', transactionHash)
  }

  async generateBlock (numberOfBlocks) {
    const newAddress = await this.jsonrpc('getnewaddress')
    return this.jsonrpc('generatetoaddress', numberOfBlocks, newAddress)
  }

  async getBlockByHash (blockHash, includeTx = false) {
    const data = await this.jsonrpc('getblock', blockHash)
    const {
      hash,
      height: number,
      mediantime: timestamp,
      difficulty,
      size,
      previousblockhash: parentHash,
      nonce,
      confirmations
    } = data
    let { tx: transactions } = data

    if (includeTx) {
      const txs = transactions.map(this.getMethod('getTransactionByHash'))
      transactions = await Promise.all(txs)
    }

    return {
      hash,
      number,
      timestamp,
      difficulty: parseFloat(BigNumber(difficulty).toFixed()),
      size,
      parentHash,
      nonce,
      transactions,
      confirmations
    }
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this.getBlockByHash(await this.jsonrpc('getblockhash', blockNumber), includeTx)
  }

  async getBlockHeight () {
    return this.jsonrpc('getblockcount')
  }

  async getTransactionByHash (transactionHash) {
    return this.getRawTransactionByHash(transactionHash, true, true)
  }

  async getTransactionFee (tx) {
    const isCoinbaseTx = tx._raw.vin.find(vin => vin.coinbase)
    if (isCoinbaseTx) return // Coinbase transactions do not have a fee

    const inputs = tx._raw.vin.map((vin) => ({ txid: vin.txid, vout: vin.vout }))
    const inputTransactions = await Promise.all(
      inputs.map(input => this.getRawTransactionByHash(input.txid, true))
    )
    const inputValues = inputTransactions.map((inputTx, index) => {
      const vout = inputs[index].vout
      const output = inputTx._raw.vout[vout]
      return output.value * 1e8
    })
    const inputValue = inputValues.reduce((a, b) => a.plus(BigNumber(b)), BigNumber(0))
    const outputValue = tx._raw.vout.reduce((a, b) => a.plus(BigNumber(b.value).times(BigNumber(1e8))), BigNumber(0))
    const feeValue = inputValue.minus(outputValue)
    return feeValue.toNumber()
  }

  async getRawTransactionByHash (transactionHash, decode = false, addFees = false) {
    const tx = await this.jsonrpc('getrawtransaction', transactionHash, decode ? 1 : 0)
    if (!decode) return tx
    const value = tx.vout.reduce((p, n) => p.plus(BigNumber(n.value).times(1e8)), BigNumber(0))
    const result = {
      hash: tx.txid,
      value: value.toNumber(),
      _raw: tx,
      confirmations: 0
    }

    if (tx.confirmations > 0) {
      const block = await this.getBlockByHash(tx.blockhash)
      Object.assign(result, {
        blockHash: block.hash,
        blockNumber: block.number,
        confirmations: tx.confirmations
      })
    }

    if (addFees) {
      const totalFee = await this.getTransactionFee(result)
      if (totalFee) {
        const fee = Math.round(totalFee / tx.vsize)
        Object.assign(result, {
          fee,
          totalFee
        })
      }
    }

    return result
  }

  async sendRawTransaction (rawTransaction) {
    return this.jsonrpc('sendrawtransaction', rawTransaction)
  }

  async sendBatchTransaction (transactions) {
    let outputs = {}
    for (const tx of transactions) {
      outputs[addressToString(tx.to)] = BigNumber(tx.value).dividedBy(1e8).toNumber()
    }
    const rawTxOutputs = await this.createRawTransaction([], outputs)
    const rawTxFunded = await this.fundRawTransaction(rawTxOutputs)
    const rawTxSigned = await this.signRawTransaction(rawTxFunded.hex)
    return this.sendRawTransaction(rawTxSigned.hex)
  }

  async signRawTransaction (hexstring, prevtxs, privatekeys, sighashtype) {
    return this.jsonrpc('signrawtransactionwithwallet', hexstring, prevtxs, privatekeys)
  }

  async createRawTransaction (transactions, outputs) {
    return this.jsonrpc('createrawtransaction', transactions, outputs)
  }

  async fundRawTransaction (hexstring) {
    return this.jsonrpc('fundrawtransaction', hexstring)
  }
}

BitcoinRpcProvider.version = version
