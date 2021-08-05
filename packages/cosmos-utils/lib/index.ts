import { BigNumber, Block, Transaction, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { Sha256 } from '@cosmjs/crypto'
import { toHex, fromBase64 } from '@cosmjs/encoding'
import { logs, parseCoins, Coin } from '@cosmjs/stargate'

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

async function normalizeTx(tx: cosmos.Tx, options: cosmos.NormalizeTxOptions) {
  const normalizedTx: Transaction<cosmos.Tx> = {
    ...options,
    hash: tx.hash,
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

function getValueFromLogs(log: string, network: CosmosNetwork): { transferredValue: number; completionTime?: number } {
  // fetching transferred amount from logs
  const _log = logs.parseRawLog(log)

  const action = logs.findAttribute(_log, 'message', 'action')

  let transferredValue: number
  let completionTime: number
  switch (action.value) {
    // IBC transfer
    case 'transfer':
    case 'send': {
      const data = logs.findAttribute(_log, 'transfer', 'amount')
      const decimals = Math.pow(10, network.defaultCurrency.coinDecimals)
      transferredValue = coinToNumber(parseCoins(data.value)[0], decimals)
      break
    }
    case 'delegate': {
      const stakingCurrency = network.stakingCurrency ? network.stakingCurrency : network.defaultCurrency
      const data = logs.findAttribute(_log, 'delegate', 'amount')
      const decimals = Math.pow(10, stakingCurrency.coinDecimals)
      // cosmos logs bug work around
      transferredValue = coinToNumber(parseCoins(data.value + stakingCurrency.coinMinimalDenom)[0], decimals)
      break
    }
    case 'begin_unbonding': {
      const data = logs.findAttribute(_log, 'transfer', 'amount')
      const decimals = Math.pow(10, network.defaultCurrency.coinDecimals)
      transferredValue = coinToNumber(parseCoins(data.value)[0], decimals)

      const time = logs.findAttribute(_log, 'unbond', 'completion_time').value
      completionTime = Math.floor(new Date(time).getTime() / 1000)

      break
    }
    case 'withdraw_delegator_reward': {
      const data = logs.findAttribute(_log, 'withdraw_rewards', 'amount')

      if (data.value == '') {
        transferredValue = 0
        break
      }

      const decimals = Math.pow(10, network.defaultCurrency.coinDecimals)
      transferredValue = coinToNumber(parseCoins(data.value)[0], decimals)
      break
    }

    default:
  }

  return { transferredValue, completionTime }
}

function coinToNumber(coin: Coin, decimals: number): number {
  return new BigNumber(coin.amount).dividedBy(new BigNumber(decimals)).toNumber()
}

function validateAddress(address: string): string {
  return address.startsWith('0x') ? address : '0x' + address
}

export { normalizeBlock, normalizeTx, getTxHash, getValueFromLogs, coinToNumber, validateAddress }
