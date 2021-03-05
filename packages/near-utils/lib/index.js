import { version } from '../package.json'

function toBase64 (str, encoding = 'hex') {
  try {
    return Buffer.from(str, encoding).toString('base64')
  } catch (e) {
    return str
  }
}

function fromBase64 (str, encoding) {
  if (!str) {
    return {}
  }

  try {
    const decoded = Buffer.from(str, 'base64').toString(encoding)
    try {
      return JSON.parse(decoded)
    } catch (e) {
      return decoded
    }
  } catch (e) {
    return str
  }
}

function toNearTimestampFormat (ts) {
  return ts * 1000 * 1000 * 1000
}

function fromNearTimestamp (ts) {
  return ts / (1000 * 1000 * 1000)
}

function normalizeTransactionObject (tx, currentHeight) {
  if (tx.transaction && tx.transaction_outcome) {
    tx = { ...tx.transaction, ...tx.transaction_outcome }
  }

  const normalizedTx = { confirmations: 0 }

  if (tx.blockNumber) {
    if (currentHeight) {
      normalizedTx.confirmations = tx.blockNumber - currentHeight
    }

    normalizedTx.blockNumber = tx.blockNumber
  }

  normalizedTx.blockHash = tx.block_hash
  normalizedTx.hash = `${tx.hash}_${tx.signer_id}`
  normalizedTx.value = 0
  normalizedTx._raw = tx

  return normalizedTx
}

function parseReceipt (_tx) {
  const normalizedTx = normalizeTransactionObject(_tx)
  const tx = normalizedTx._raw

  if (tx) {
    normalizedTx.sender = tx.signer_id
    normalizedTx.receiver = tx.receiver_id

    if (tx.actions) {
      tx.actions.forEach(a => {
        if (a.Transfer) {
          normalizedTx.value = a.Transfer.deposit
        }

        if (a.DeployContract) {
          normalizedTx.code = a.DeployContract.code
        }

        if (a.FunctionCall) {
          const method = a.FunctionCall.method_name

          switch (method) {
            case 'init': {
              const args = fromBase64(a.FunctionCall.args)
              normalizedTx.swap = {
                method,
                secretHash: fromBase64(args.secretHash, 'hex'),
                expiration: fromNearTimestamp(args.expiration),
                recipient: args.buyer
              }
              break
            }

            case 'claim': {
              const args = fromBase64(a.FunctionCall.args)
              normalizedTx.swap = {
                method,
                secret: fromBase64(args.secret, 'hex')
              }
              break
            }

            case 'refund': {
              normalizedTx.swap = { method }
              break
            }

            default: {
              const args = fromBase64(a.FunctionCall.args)
              normalizedTx.raw = { ...args, method }
              break
            }
          }
        }
      })
    }
  }
  return normalizedTx
}
export { toBase64, fromBase64, normalizeTransactionObject, parseReceipt, toNearTimestampFormat, fromNearTimestamp, version }
