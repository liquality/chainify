import { BigNumber, Block, Transaction, cosmos } from '@liquality/types'
import { Sha256 } from '@cosmjs/crypto'
import { toHex, fromBase64 } from '@cosmjs/encoding'
import { logs, parseCoins, Coin } from '@cosmjs/stargate'
import { Tx } from 'cosmjs-types/cosmos/tx/v1beta1/tx'

function normalizeBlock(blockResponse: cosmos.BlockResponse, txs: cosmos.Tx[]) {
  const normalizedBlock: Block<cosmos.Tx> = {
    number: parseInt(blockResponse.block.header.height),
    hash: blockResponse.block_id.hash,
    timestamp: Math.floor(new Date(blockResponse.block.header.time).getTime() / 1000),
    size: 0,
    parentHash: blockResponse.block.header.last_block_id.hash,
    transactions: txs
  }

  return normalizedBlock
}

async function normalizeTx(tx: cosmos.Tx, blockHash: string, confirmations: number, coinDecimals: number) {
  const blockHeight = parseInt(tx.height)

  const decimals = Math.pow(10, coinDecimals)

  // fetching transferred amount from logs
  const _log = logs.parseRawLog(tx.tx_result.log)
  const transferAttribute = logs.findAttribute(_log, 'transfer', 'amount')
  const transferredValue = coinToNumber(parseCoins(transferAttribute.value)[0], decimals)

  // calculate feePrice and fee in NON minimal denomination
  const gasWanted = parseInt(tx.tx_result.gas_wanted)
  const txDecoded = Tx.decode(fromBase64(tx.tx))
  const fee = coinToNumber(txDecoded.authInfo.fee.amount[0], decimals)
  const feePrice = fee / gasWanted

  const normalizedTx: Transaction<cosmos.Tx> = {
    hash: tx.hash,
    value: transferredValue,
    blockHash,
    blockNumber: blockHeight,
    confirmations,
    feePrice,
    fee,
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

function coinToNumber(coin: Coin, decimals: number): number {
  return new BigNumber(coin.amount).dividedBy(new BigNumber(decimals)).toNumber()
}

export { normalizeBlock, normalizeTx, getTxHash, coinToNumber }
