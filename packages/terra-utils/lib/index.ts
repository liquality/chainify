import { Block, SwapParams, Transaction, terra } from '@liquality/types'
import { addressToString, validateExpiration, validateSecretHash, validateValue } from '@liquality/utils'
import { InvalidAddressError } from '@liquality/errors'

export const normalizeBlock = (data: any): Block => ({
  hash: data.block_id.hash,
  timestamp: convertDateToTimestamp(data.block.header.time),
  size: Number(data.block.header.height),
  number: Number(data.block.header.height),
  parentHash: data.block.last_commit.block_id.hash
})

export const normalizeTransaction = (data: any, asset: string): Transaction<terra.InputTransaction> => {
  const value = data.tx?.msg?.[0]?.init_coins?.get(asset)?.amount || 0

  let txParams = data.tx?.msg?.[0]?.init_msg || data.tx?.msg?.[0]?.execute_msg?.claim || {}

  if (!Object.keys(txParams).length) {
    const initMsg = data.tx?.value?.msg?.[0]?.value?.init_msg
    const executeMsg = data.tx?.value?.msg?.[0]?.value?.execute_msg

    if (initMsg) {
      txParams = JSON.parse(Buffer.from(initMsg, 'base64').toString())
    }

    if (executeMsg) {
      txParams.method = JSON.parse(Buffer.from(executeMsg, 'base64').toString())

      if (txParams.method.claim) {
        txParams.secret = txParams.method.claim.secret
      }
    }
  }

  const contractAddress =
    data?.logs?.[0]?.eventsByType?.instantiate_contract?.contract_address[0] ||
    data?.logs?.[0]?.eventsByType?.execute_contract?.contract_address[0] ||
    data?.logs?.[0]?.events[0]?.attributes?.filter((e: any) => e.key === 'contract_address')?.[0]?.value ||
    ''

  return {
    value: Number(value),
    hash: data.txhash,
    ...(txParams?.secret && { secret: txParams.secret }),
    _raw: {
      ...txParams,
      contractAddress
    }
  }
}

export const doesTransactionMatchInitiation = (swapParams: SwapParams, transactionParams: any): boolean => {
  return (
    swapParams.recipientAddress === transactionParams.buyer &&
    swapParams.refundAddress === transactionParams.seller &&
    swapParams.secretHash === transactionParams.secret_hash &&
    swapParams.expiration === transactionParams.expiration &&
    swapParams.value.eq(transactionParams.value)
  )
}

export const validateSwapParams = (swapParams: SwapParams) => {
  validateValue(swapParams.value)
  validateSecretHash(swapParams.secretHash)
  validateExpiration(swapParams.expiration)
  validateAddress(addressToString(swapParams.recipientAddress))
  validateAddress(addressToString(swapParams.refundAddress))
}

const convertDateToTimestamp = (fullDate: string): number => {
  const dateAndTime = fullDate.split('.')[0]

  const [date, time] = dateAndTime.split('T')

  const [year, month, day] = date.split('-').map((e) => Number(e))
  const [hour, minute, second] = time.split(':').map((e) => Number(e))

  const dateFormat = new Date(Date.UTC(year, month - 1, day, hour, minute, second))

  return Math.floor(dateFormat.getTime() / 1000)
}

const validateAddress = (address: string): void => {
  if (typeof address !== 'string' || address.length !== 44) {
    throw new InvalidAddressError(`Invalid address: ${address}`)
  }
}
