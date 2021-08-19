import { Block, SwapParams, Transaction, terra } from '@liquality/types'
import { addressToString, validateExpiration, validateSecretHash, validateValue } from '@liquality/utils'
import { InvalidAddressError } from '@liquality/errors'
import { DateTime } from 'luxon'

export const normalizeBlock = (data: any): Block => ({
  hash: data.block_id.hash,
  timestamp: convertDateToTimestamp(data.block.header.time),
  size: Number(data.block.header.height),
  number: Number(data.block.header.height),
  parentHash: data.block.last_commit.block_id.hash
})

export const normalizeTransaction = (
  data: any,
  asset: string,
  currentBlock?: number
): Transaction<terra.InputTransaction> => {
  const msg = data.tx.msg?.[0] || data.tx.value?.msg?.[0]?.value

  let value = 0

  if (Array.isArray(msg?.init_coins)) {
    value = msg.init_coins.find((e: any) => e.denom === asset)?.amount
  } else if (typeof msg?.init_coins === 'object') {
    value = msg.init_coins.get(asset)?.amount
  }

  let txParams = msg?.init_msg || msg?.execute_msg || {}

  if (Object.keys(txParams).length) {
    const initMsg = msg?.init_msg
    const executeMsg = msg?.execute_msg

    if (initMsg) {
      txParams = initMsg
    }

    if (executeMsg) {
      txParams.method = executeMsg

      if (txParams.method.claim) {
        txParams.secret = txParams.method.claim.secret
      }
    }
  }

  const logs = data.logs?.[0]

  const contractAddress =
    logs?.eventsByType?.execute_contract?.contract_address[0] ||
    logs?.events?.find((e: any) => e.type === 'wasm')?.attributes.find((e: any) => e.key === 'contract_address')
      .value ||
    ''

  return {
    value: Number(value),
    hash: data.txhash,
    confirmations: Math.min(currentBlock - data.height, 10),
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
  return DateTime.fromISO(fullDate).toSeconds()
}

const validateAddress = (address: string): void => {
  if (typeof address !== 'string' || address.length !== 44) {
    throw new InvalidAddressError(`Invalid address: ${address}`)
  }
}
