import { Block as BlockSchema, Transaction as TransactionSchema } from '@liquality/schema'
import { ethereum, Transaction } from '@liquality/types'
import { padHexStart } from '@liquality/crypto'

import eip55 from 'eip55'
import { pick } from 'lodash'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

const GWEI = 1e9

/**
 * Converts a hex string to the ethereum format
 * @param {*} hash
 */
function ensure0x (hash: string) {
  return hash.startsWith('0x') ? hash : `0x${hash}`
}

/**
 * Converts an ethereum hex string to the standard format
 * @param {*} hash
 */
function remove0x (hash: string) {
  return hash.replace(/^0x/, '')
}

/**
 * Converts an ethereum address to the standard format
 * @param {*} address
 */
function removeAddress0x (address: string) {
  return remove0x(address).toLowerCase()
}

function checksumEncode (hash: string) {
  return eip55.encode(ensure0x(hash))
}

function ensureBlockFormat (block?: number) {
  if (block === undefined) {
    return 'latest'
  } else {
    return ensure0x(padHexStart(block.toString(16)))
  }
}

// TODO: is this really needed? Why not return original response?
function formatEthResponse (obj: any): any {
  if (typeof obj === 'string' || obj instanceof String) {
    obj = remove0x(obj as string)
  } else if (Array.isArray(obj) && typeof obj[0] === 'object') {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = formatEthResponse(obj[i])
    }
  } else if (Array.isArray(obj)) {
    obj = obj.map(remove0x)
  } else {
    for (let key in obj) {
      if (obj[key] === null) continue
      if (Array.isArray(obj[key])) {
        obj[key] = formatEthResponse(obj[key])
      } else {
        if ((BlockSchema.properties[key] &&
          BlockSchema.properties[key].type === 'number') ||
          (TransactionSchema.properties[key] &&
          TransactionSchema.properties[key].type === 'number')) {
          obj[key] = parseInt(obj[key])
        } else {
          if (obj[key]) {
            obj[key] = remove0x(obj[key])
          }
        }
      }
    }
  }
  return obj
}

function normalizeTransactionObject (tx: ethereum.TransactionResponse, currentHeight?: number) : Transaction<ethereum.TransactionResponse> {
  if (!(typeof tx === 'object' && tx !== null)) {
    throw new Error(`Invalid transaction object: "${tx}"`)
  }

  const normalizedTx : Transaction<ethereum.TransactionResponse> = {
    ...pick(tx, ['blockNumber', 'blockHash', 'hash', 'value', 'confirmations']),
    _raw: tx
  }

  // TODO: TS NORMALIZE OUTSIDE Normalize data field. Called `data` in `sendTransaction` calls. `input` everywhere else
  // if ('data' in normalizedTx._raw) {
  //   normalizedTx._raw.input = normalizedTx._raw.data
  //   delete normalizedTx._raw.data
  // }

  if (normalizedTx.blockNumber === null) {
    delete normalizedTx.blockNumber
  } else if (!isNaN(normalizedTx.blockNumber) && !('confirmations' in normalizedTx)) {
    normalizedTx.confirmations = currentHeight - normalizedTx.blockNumber + 1
  }
  if (normalizedTx.blockHash === null) {
    delete normalizedTx.blockHash
  }

  if (tx.gasLimit && tx.gasPrice) {
    const gas = tx.gasLimit
    const gasPrice = tx.gasPrice

    normalizedTx.fee = gas.times(gasPrice)
    normalizedTx.feePrice = gasPrice.div(GWEI)
  }

  return normalizedTx
}

function buildTransaction (txOptions: ethereum.UnsignedTransaction) : ethereum.RawTransaction {
  const tx : ethereum.RawTransaction = {
    from: ensure0x(txOptions.from),
    value: txOptions.value ? ensure0x(txOptions.value.toString(16)) : '0x0'
  }

  if (txOptions.gasPrice) tx.gasPrice = ensure0x(txOptions.gasPrice.times(GWEI).dp(0, BigNumber.ROUND_CEIL).toString(16))
  if (txOptions.to) tx.to = ensure0x(txOptions.to)
  if (txOptions.data) tx.data = ensure0x(txOptions.data)
  if (txOptions.nonce !== null && txOptions.nonce !== undefined) tx.nonce = ensure0x(txOptions.nonce.toString(16))

  return tx
}

export {
  ensure0x,
  remove0x,
  removeAddress0x,
  checksumEncode,
  formatEthResponse,
  normalizeTransactionObject,
  ensureBlockFormat,
  buildTransaction,
  version
}
