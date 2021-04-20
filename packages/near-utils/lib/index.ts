import { near, Transaction } from '@liquality/types'
import BN from 'bn.js'

export { transactions, Account, InMemorySigner, providers, KeyPair, keyStores } from 'near-api-js'
export { BN }

function toBase64(str: string, encoding = 'hex' as BufferEncoding): string {
  try {
    return Buffer.from(str, encoding).toString('base64')
  } catch (e) {
    return str
  }
}

function fromBase64(str: string, encoding?: BufferEncoding): any {
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

function toNearTimestampFormat(ts: number): number {
  return ts * 1000 * 1000 * 1000
}

function fromNearTimestamp(ts: number): number {
  return Math.floor(ts / (1000 * 1000 * 1000))
}

function normalizeTransactionObject(tx: near.InputTransaction, currentHeight?: number) {
  const normalizedTx = { confirmations: 0 } as Transaction<near.InputTransaction>

  const blockNumber = tx.transaction.blockNumber || tx.blockNumber
  if (blockNumber) {
    if (currentHeight) {
      normalizedTx.confirmations = currentHeight - blockNumber
    }

    normalizedTx.blockNumber = blockNumber
  }

  normalizedTx.blockHash = tx.blockHash
  normalizedTx.hash = `${tx.transaction.hash}_${tx.transaction.signer_id}`
  normalizedTx.value = 0
  normalizedTx._raw = tx

  return normalizedTx
}

function parseReceipt(_tx: near.InputTransaction): near.NearSwapTransaction {
  const normalizedTx = normalizeTransactionObject(_tx)
  const tx = normalizedTx._raw

  const nearSwapTx = { ...normalizedTx } as near.NearSwapTransaction

  if (tx) {
    nearSwapTx.sender = tx.transaction.signer_id
    nearSwapTx.receiver = tx.transaction.receiver_id

    if (tx.transaction.actions) {
      tx.transaction.actions.forEach((a: any) => {
        if (a.Transfer) {
          nearSwapTx.value = a.Transfer.deposit
        }

        if (a.DeployContract) {
          nearSwapTx.code = a.DeployContract.code
        }

        if (a.FunctionCall) {
          const method = a.FunctionCall.method_name

          switch (method) {
            case 'init': {
              const args = fromBase64(a.FunctionCall.args)
              nearSwapTx.swap = {
                method,
                secretHash: fromBase64(args.secretHash, 'hex') as string,
                expiration: fromNearTimestamp(args.expiration),
                recipient: args.buyer
              }
              break
            }

            case 'claim': {
              const args = fromBase64(a.FunctionCall.args)
              nearSwapTx.swap = {
                method,
                secret: fromBase64(args.secret, 'hex') as string
              }
              break
            }

            case 'refund': {
              nearSwapTx.swap = { method }
              break
            }

            default: {
              const args = fromBase64(a.FunctionCall.args)
              nearSwapTx._raw = { ...args, method }
              break
            }
          }
        }
      })
    }
  }
  return nearSwapTx
}

export { toBase64, fromBase64, normalizeTransactionObject, parseReceipt, toNearTimestampFormat, fromNearTimestamp }
