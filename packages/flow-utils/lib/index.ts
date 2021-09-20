// import { near, SwapParams, Transaction, Address } from '@liquality/types'
// import { validateValue, validateSecretHash, validateExpiration, addressToString } from '@liquality/utils'
// import { InvalidAddressError } from '@liquality/errors'
// import BN from 'bn.js'

// export { validateSecret, validateSecretAndHash } from '@liquality/utils'
// export { transactions, Account, InMemorySigner, providers, KeyPair, keyStores } from 'near-api-js'
// export { BN }

import { Transaction, Block, flow } from '@liquality/types'

async function normalizeTx(tx: flow.Tx, txHash: string) {
  // TODO: fix tx
  const normalizedTx: Transaction<flow.Tx> = {
    hash: txHash,
    value: 0,
    blockHash: tx.referenceBlockId,
    blockNumber: 0,
    confirmations: 0,
    feePrice: 0,
    fee: 0,
    secret: '',
    _raw: tx
  }

  return normalizedTx
}

function normalizeBlock(blockResponse: flow.BlockResponse, txs: flow.Tx[]) {
  const normalizedBlock: Block<flow.Tx> = {
    number: blockResponse.height,
    hash: blockResponse.id,
    timestamp: Math.floor(new Date(blockResponse.timestamp).getTime() / 1000),
    size: 0,
    parentHash: blockResponse.parentId,
    transactions: txs
  }

  return normalizedBlock
}

export { normalizeTx, normalizeBlock }
