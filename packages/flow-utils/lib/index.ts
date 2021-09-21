// import { near, SwapParams, Transaction, Address } from '@liquality/types'
// import { validateValue, validateSecretHash, validateExpiration, addressToString } from '@liquality/utils'
// import { InvalidAddressError } from '@liquality/errors'
// import BN from 'bn.js'

// export { validateSecret, validateSecretAndHash } from '@liquality/utils'
// export { transactions, Account, InMemorySigner, providers, KeyPair, keyStores } from 'near-api-js'
// export { BN }

import { Transaction, Block, flow } from '@liquality/types'

async function normalizeTx(rawTx: flow.Tx) {
  const normalizedTx: Transaction<flow.Tx> = {
    hash: rawTx.txId,
    value: 0, // TODO: fetch value from events
    blockHash: rawTx.referenceBlockId,
    blockNumber: rawTx.blockNumber,
    confirmations: rawTx.blockConfirmations,
    // feePrice: 0,
    fee: 0, // TODO: is it possible to fetch fee?
    // secret: '',
    _raw: rawTx
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
