import { Block, Transaction } from '@liquality/types'

export const normalizeBlock = (data: any): Block => ({
  hash: data.block_id.hash,
  timestamp: convertDateToTimestamp(data.block.header.time),
  size: Number(data.block.header.height),
  number: Number(data.block.header.height),
  parentHash: data.block.last_commit.block_id.hash
})

export const normalizeTransaction = (data: any): Transaction => {
  const value = data.tx.msg[0]?.init_coins?.get('uluna')?.amount || 0

  // const initData = data.tx.msg[0].init_msg

  return {
    value: Number(value),
    hash: data.txhash,
    _raw: {}
  }
}

const convertDateToTimestamp = (fullDate: string): number => {
  const dateAndTime = fullDate.split('.')[0]

  const [date, time] = dateAndTime.split('T')

  const [year, month, day] = date.split('-').map((e) => Number(e))
  const [hour, minute, second] = time.split(':').map((e) => Number(e))

  const dateFormat = new Date(Date.UTC(year, month - 1, day, hour, minute, second))

  return Math.floor(dateFormat.getTime() / 1000)
}
