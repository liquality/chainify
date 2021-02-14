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

function normalizeTransactionObject (tx, confirmations) {
  if (tx.transaction && tx.transaction_outcome) {
    tx = { ...tx.transaction, ...tx.transaction_outcome }
  }

  const normalizedTx = { confirmations: 0, swap: {} }

  if (confirmations) {
    normalizedTx.confirmations = confirmations
  }
  if (tx) {
    normalizedTx.value = 0
    normalizedTx.hash = `${tx.hash}_${tx.signer_id}`
    normalizedTx.blockHash = tx.block_hash
    normalizedTx.sender = tx.signer_id
    normalizedTx.receiver = tx.receiver_id
    normalizedTx.rawHash = tx.hash

    if (tx.actions) {
      tx.actions.forEach((a) => {
        if (a.Transfer) {
          normalizedTx.value = a.Transfer.deposit
        }

        if (a.DeployContract) {
          normalizedTx.code = a.DeployContract.code
        }

        if (a.FunctionCall) {
          const method = a.FunctionCall.method_name

          switch (normalizedTx.swap.method) {
            case 'init': {
              normalizedTx.swap.method = method
              const args = fromBase64(a.FunctionCall.args)
              normalizedTx.swap.secretHash = fromBase64(args.secretHash, 'hex')
              normalizedTx.swap.expiration = args.expiration
              normalizedTx.swap.recipient = args.buyer
              break
            }

            case 'claim': {
              normalizedTx.swap.method = method
              const args = fromBase64(a.FunctionCall.args)
              normalizedTx.swap.secret = fromBase64(args.secret, 'hex')
              break
            }

            case 'refund': {
              normalizedTx.swap.method = method
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

export { toBase64, fromBase64, normalizeTransactionObject, version }
