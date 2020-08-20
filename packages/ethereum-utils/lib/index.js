import { Block, Transaction } from '@liquality/schema'
import { padHexStart } from '@liquality/crypto'
import { addressToString } from '@liquality/utils'
import BigNumber from 'bignumber.js'
import eip55 from 'eip55'
import _ from 'lodash'

import { version } from '../package.json'

const GWEI = 1e9

/**
 * Converts a hex string to the ethereum format
 * @param {*} hash
 */
function ensure0x (hash) {
  return (typeof hash === 'string')
    ? hash.startsWith('0x') ? hash : `0x${hash}`
    : hash
}

/**
 * Converts an ethereum hex string to the standard format
 * @param {*} hash
 */
function remove0x (hash) {
  return (typeof hash === 'string') ? hash.replace(/^0x/, '') : hash
}

/**
 * Converts an ethereum address to the standard format
 * @param {*} address
 */
function removeAddress0x (address) {
  return remove0x(address).toLowerCase()
}

function checksumEncode (hash) {
  return eip55.encode(ensure0x(hash))
}

function ensureBlockFormat (block) {
  if (block === undefined) {
    return 'latest'
  } else {
    return (typeof block === 'number') ? ensure0x(padHexStart(block.toString(16))) : block
  }
}

function formatEthResponse (obj) {
  if (typeof obj === 'string' || obj instanceof String) {
    obj = remove0x(obj)
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
        if ((Block.properties[key] &&
          Block.properties[key].type === 'number') ||
          (Transaction.properties[key] &&
          Transaction.properties[key].type === 'number')) {
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

function normalizeTransactionObject (tx, currentHeight) {
  if (!tx) return

  const normalizedTx = {
    ..._.pick(tx, ['blockNumber', 'blockHash', 'hash', 'value', 'confirmations']),
    _raw: tx
  }

  if (normalizedTx.blockNumber === null) {
    delete normalizedTx.blockNumber
  } else if (!isNaN(normalizedTx.blockNumber) && !('confirmations' in normalizedTx)) {
    normalizedTx.confirmations = currentHeight - normalizedTx.blockNumber + 1
  }
  if (normalizedTx.blockHash === null) {
    delete normalizedTx.blockHash
  }

  if (tx.gas && tx.gasPrice) {
    const gas = BigNumber(parseInt(tx.gas, 16))
    const gasPrice = BigNumber(parseInt(tx.gasPrice, 16))

    normalizedTx.fee = gas.times(gasPrice).toNumber()
    normalizedTx.feePrice = gasPrice.div(GWEI).toNumber()
  }

  return normalizedTx
}

function buildTransaction (from, to, value, data, gasPrice, nonce) {
  const tx = {
    from: ensure0x(addressToString(from)),
    value: ensure0x(BigNumber(value).toString(16))
  }

  if (gasPrice) tx.gasPrice = ensure0x(BigNumber(gasPrice).times(GWEI).toString(16))
  if (to) tx.to = ensure0x(addressToString(to))
  if (data) tx.data = ensure0x(data)
  if (nonce !== null && nonce !== undefined) tx.nonce = ensure0x(nonce.toString(16))

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
