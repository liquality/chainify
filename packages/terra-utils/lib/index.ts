export const normalizeBlock = (data: any) => ({
  hash: data.block_id.hash,
  timestamp: convertDateToTimestamp(data.block.header.time),
  size: Number(data.block.header.height),
  number: Number(data.block.header.height),
  parentHash: data.block.last_commit.block_id.hash
})

const convertDateToTimestamp = (fullDate: string) => {
  const dateAndHours = fullDate.split('.')[0]

  const [date, time] = dateAndHours.split('T')

  const [year, month, day] = date.split('-').map((e) => Number(e))
  const [hour, minute, second] = time.split(':').map((e) => Number(e))

  const dateFormat = new Date(Date.UTC(year, month - 1, day, hour, minute, second))

  return Math.floor(dateFormat.getTime() / 1000)
}
