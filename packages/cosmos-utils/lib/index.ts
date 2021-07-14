import { Block, Transaction, cosmos } from '@liquality/types'
import { Sha256 } from '@cosmjs/crypto'
import { toHex, fromBase64 } from '@cosmjs/encoding'

function normalizeBlock(blockResponse: cosmos.BlockResponse, txs: cosmos.Tx[]) {
  const normalizedBlock: Block<cosmos.Tx> = {
    number: parseInt(blockResponse.block.header.height),
    hash: blockResponse.block_id.hash,
    timestamp: new Date(blockResponse.block.header.time).getTime() / 1000,
    size: 0,
    parentHash: blockResponse.block.header.last_block_id.hash,
    transactions: txs
  }

  return normalizedBlock
}

async function normalizeTx(tx: cosmos.Tx, blockHash: string) {
  const blockHeight = parseInt(tx.height)

  const normalizedTx: Transaction<cosmos.Tx> = {
    hash: tx.hash,
    value: 0,
    blockHash: blockHash,
    blockNumber: blockHeight,
    confirmations: 0, // cosmos has instant validity
    feePrice: 0,
    fee: 0,
    secret: '',
    _raw: tx
  }

  return normalizedTx
}

function getTxHash(txBase64: string): string {
  const buff = fromBase64(txBase64)
  const digest = new Sha256(buff).digest()
  return '0x' + toHex(digest)
}

export { normalizeBlock, normalizeTx, getTxHash }
