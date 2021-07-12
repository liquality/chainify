import { Block, Transaction, cosmos } from '@liquality/types'

function normalizeBlock(blockResponse: cosmos.BlockResponse) {
  const normalizedBlock: Block<cosmos.Tx> = {
    number: blockResponse.block.header.height,
    hash: blockResponse.block_id.hash,
    timestamp: new Date(blockResponse.block.header.time).getTime() / 1000,
    size: 0, // size is unknown
    parentHash: blockResponse.block.header.last_block_id.hash
    // difficulty?: number;
    // nonce?: number;
    // transactions?: cosmos.Tx[] // TODO: parse utf8 encoded strings
  }

  return normalizedBlock
}

async function normalizeTx(tx: cosmos.Tx, blockHash: string) {
  const blockHeight = parseInt(tx.height)

  const normalizedTx: Transaction<cosmos.Tx> = {
    hash: tx.hash,
    value: 0, // TODO: set to proper value if possible
    blockHash: blockHash,
    blockNumber: blockHeight,
    confirmations: 0, // cosmos has instant validity
    feePrice: 0, // TODO: ...
    fee: 0, // TODO: ...
    secret: '', // TODO: ...
    _raw: tx
  }

  return normalizedTx
}

export { normalizeBlock, normalizeTx }
