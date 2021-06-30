import { Address, BigNumber, SwapParams } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { InvalidAddressError } from '@liquality/errors'
import { base58, sha256 } from '@liquality/crypto'
import { serialize, deserialize } from 'borsh'

import { initSchema, claimSchema, refundSchema, InitData, Template } from './layouts'

export function validateAddress(_address: Address | string) {
  const address = addressToString(_address)

  if (typeof address !== 'string') {
    throw new InvalidAddressError(`Invalid address: ${address}`)
  }

  if (address.length !== 44) {
    throw new InvalidAddressError(`Invalid address. Minimum length is 2`)
  }
}

export function compareParams(swapParams: SwapParams, transactionParams: InitData) {
  return (
    swapParams.recipientAddress === transactionParams.buyer &&
    swapParams.refundAddress === transactionParams.seller &&
    swapParams.secretHash === transactionParams.secret_hash &&
    new BigNumber(swapParams.expiration).eq(transactionParams.expiration) &&
    swapParams.value.eq(transactionParams.value)
  )
}

export function _deserialize(data: string) {
  if (data) {
    const decoded = base58.decode(data)

    const instruction = decoded[0]

    let schemaToUse

    switch (instruction) {
      case 0: {
        schemaToUse = initSchema
        break
      }
      case 1: {
        schemaToUse = claimSchema
        break
      }
      case 2: {
        schemaToUse = refundSchema
        break
      }
      default: {
        break
      }
    }

    const deserilized = deserialize(schemaToUse, Template, decoded)

    return deserilized
  }
}

export const createRefundBuffer = () => {
  const refund = new Template({ instruction: 2 })

  return serialize(refundSchema, refund)
}

export const createClaimBuffer = (secret: string) => {
  const claim = new Template({
    instruction: 1,
    secret: secret.toString()
  })

  return serialize(claimSchema, claim)
}

export const createInitBuffer = ({ buyer, seller, expiration, secret_hash, value }: InitData) => {
  const initTemplate = new Template({
    instruction: 0,
    buyer,
    seller,
    secret_hash,
    expiration,
    value
  })

  return serialize(initSchema, initTemplate)
}

export function _validateSecret(swapParams: SwapParams, data: { secret: string }): boolean {
  return swapParams.secretHash === sha256(data.secret)
}
