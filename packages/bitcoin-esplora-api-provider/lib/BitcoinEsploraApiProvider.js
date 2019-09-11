import axios from 'axios'
import Provider from '@liquality-dev/provider'
import { isArray, flatten } from 'lodash'
import BigNumber from 'bignumber.js'

import { addressToString } from '@liquality-dev/utils'

import { version } from '../package.json'

export default class BitcoinEsploraApiProvider extends Provider {
  constructor (url, numberOfBlockConfirmation = 1, defaultFeePerByte = 3) {
    super()
    this.url = url
    this._numberOfBlockConfirmation = numberOfBlockConfirmation
    this._defaultFeePerByte = defaultFeePerByte

    this._axios = axios.create({
      baseURL: url,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  async getFeePerByte (numberOfBlocks = this._numberOfBlockConfirmation) {
    try {
      const feeEstimates = (await this._axios('/fee-estimates')).data
      const blockOptions = Object.keys(feeEstimates)
      const closestBlockOption = blockOptions.reduce((prev, curr) => {
        return Math.abs(prev - numberOfBlocks) < Math.abs(curr - numberOfBlocks) ? prev : curr
      })
      const rate = feeEstimates[closestBlockOption]
      return rate
    } catch (e) {
      return this._defaultFeePerByte
    }
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

  async _getUnspentTransactions (address) {
    const response = await this._axios.get(`/address/${addressToString(address)}/utxo`)
    return response.data.map(utxo => ({
      ...utxo,
      address: addressToString(address),
      satoshis: utxo.value,
      amount: BigNumber(utxo.value).dividedBy(1e8).toNumber()
    }))
  }

  async getUnspentTransactions (addresses) {
    const utxoSets = await Promise.all(addresses.map(addr => this._getUnspentTransactions(addr)))
    const utxos = flatten(utxoSets)
    return utxos
  }

  async getTransactionHex (transactionHash) {
    const response = await this._axios.get(`/tx/${transactionHash}/hex`)
    return response.data
  }

  async getTransaction (transactionHash) {
    const response = await this._axios.get(`/tx/${transactionHash}`)
    const currentHeight = await this.getBlockHeight()
    return this.formatTransaction(response.data, currentHeight)
  }

  formatTransaction (tx, currentHeight) {
    const value = tx.vout.reduce((p, n) => p.plus(BigNumber(n.value)), BigNumber(0))

    const rawVin = tx.vin.map(vin => ({
      txid: vin.txid,
      vout: vin.vout,
      scriptSig: {
        asm: vin.scriptsig_asm,
        hex: vin.scriptsig
      },
      txinwitness: vin.witness
    }))

    const rawVout = tx.vout.map((vout, i) => ({
      value: BigNumber(vout.value).dividedBy(1e8).toNumber(),
      n: i,
      scriptPubKey: {
        asm: vout.scriptpubkey_asm,
        hex: vout.scriptpubkey,
        type: vout.scriptpubkey_type,
        addresses: [
          vout.scriptpubkey_address
        ]
      }
    }))

    const rawTx = {
      ...tx,
      vin: rawVin,
      vout: rawVout
    }

    const confirmations = tx.status.confirmed ? currentHeight - tx.status.block_height + 1 : 0

    return {
      hash: tx.txid,
      value: value.toNumber(),
      _raw: rawTx,
      blockHash: tx.status.block_hash,
      blockNumber: tx.status.block_height,
      confirmations
    }
  }

  async getBlockTransactions (blockHash) {
    let transactions = []
    const currentHeight = await this.getBlockHeight()
    for (let i = 0; ;i += 25) {
      try {
        const response = await this._axios.get(`/block/${blockHash}/txs/${i}`)
        const data = response.data
        if (isArray(data)) {
          transactions = transactions.concat(data.map(tx => this.formatTransaction(tx, currentHeight)))
        }
      } catch (e) {
        if (e.response.data === 'start index out of range') {
          break
        } else {
          throw e
        }
      }
    }
    return transactions
  }

  async getBlockByHash (blockHash, includeTx = false) {
    const response = await this._axios.get(`/block/${blockHash}`)
    const data = response.data
    const {
      id: hash,
      height: number,
      timestamp,
      // difficulty,
      size,
      previousblockhash: parentHash,
      nonce
      // confirmations
    } = data

    let transactions = await this.getBlockTransactions(blockHash)

    return {
      hash,
      number,
      timestamp,
      size,
      parentHash,
      nonce,
      transactions
    }
  }

  async getBlockHash (blockNumber) {
    const response = await this._axios.get(`/block-height/${blockNumber}`)
    return response.data
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this.getBlockByHash(await this.getBlockHash(blockNumber), includeTx)
  }

  async getBlockHeight () {
    const response = await this._axios.get('/blocks/tip/height')
    return parseInt(response.data)
  }

  async getTransactionByHash (transactionHash) {
    return this.getRawTransactionByHash(transactionHash, true)
  }

  async getRawTransactionByHash (transactionHash, decode = false) {
    return decode ? this.getTransaction(transactionHash) : this.getTransactionHex(transactionHash)
  }

  async sendRawTransaction (rawTransaction) {
    const response = await this._axios.post('/tx', rawTransaction)
    return response.data
  }
}

BitcoinEsploraApiProvider.version = version
