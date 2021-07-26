import { Address, BigNumber, Block, solana, SwapParams, Transaction } from '@liquality/types'
import {
  addressToString,
  validateSecretAndHash,
  validateValue,
  validateExpiration,
  validateSecretHash
} from '@liquality/utils'
import { InvalidAddressError } from '@liquality/errors'
import { base58 } from '@liquality/crypto'
import { ParsedConfirmedTransaction } from '@solana/web3.js'
import { serialize, deserialize as deserializer } from 'borsh'
import filter from 'lodash/filter'

import { initSchema, claimSchema, refundSchema, InitData, Template as _Template } from './layouts'

export const Template = _Template

export function validateAddress(_address: Address | string) {
  const address = addressToString(_address)

  if (typeof address !== 'string') {
    throw new InvalidAddressError(`Invalid address: ${address}`)
  }

  if (address.length !== 44) {
    throw new InvalidAddressError(`Invalid address. Length should be 44`)
  }
}

export function doesTransactionMatchInitiation(swapParams: SwapParams, transactionParams: InitData) {
  return (
    swapParams.recipientAddress === transactionParams.buyer &&
    swapParams.refundAddress === transactionParams.seller &&
    swapParams.secretHash === transactionParams.secret_hash &&
    new BigNumber(swapParams.expiration).eq(transactionParams.expiration) &&
    swapParams.value.eq(transactionParams.value)
  )
}

export function deserialize(data: string) {
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

    return deserializer(schemaToUse, Template, decoded)
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

export function validateSecret(swapParams: SwapParams, data: { secret: string }): boolean {
  validateSecretAndHash(data.secret, swapParams.secretHash)

  return true
}

export function normalizeTransaction(
  tx: ParsedConfirmedTransaction,
  signatureStatus?: any
): Transaction<solana.InputTransaction> {
  const {
    transaction: {
      message: { accountKeys, instructions },
      signatures
    }
  } = tx

  const [hash] = signatures
  const [firstInstruction] = instructions as any

  const transactionData: {
    lamports: number
    programId: string
    confirmations?: number
    _raw?: {
      buyer?: string
      seller?: string
      secret_hash?: string
      value?: BigNumber
      expiration?: number
      programAccount?: string
    }
    secret?: string
  } = {
    lamports: 0,
    programId: '',
    _raw: {}
  }

  const txData = filter(instructions as any, 'data')

  let deserialized

  if (txData.length) {
    deserialized = deserialize(txData[0].data)

    transactionData._raw = { ...transactionData._raw, ...deserialized }

    if (deserialized.secret) {
      transactionData.secret = deserialized.secret
    }
  }

  if (firstInstruction.parsed) {
    transactionData.lamports = firstInstruction.parsed.info.lamports

    const { type } = firstInstruction.parsed

    switch (type) {
      case 'finalize': {
        transactionData.programId = firstInstruction.parsed.info.account
        break
      }
      case 'createAccount': {
        transactionData._raw.programAccount = firstInstruction.parsed.info.newAccount
        break
      }
      default: {
        break
      }
    }
  }

  if (!transactionData.programId) {
    transactionData.programId = accountKeys[accountKeys.length - 1].pubkey.toString()
  }

  if (signatureStatus?.value?.confirmationStatus === 'finalized') {
    transactionData.confirmations = 31
  }

  return {
    hash,
    value: transactionData.lamports,
    ...(transactionData.secret && { secret: transactionData.secret }),
    ...(transactionData.confirmations && { confirmations: transactionData.confirmations }),
    _raw: {
      programId: transactionData.programId,
      ...transactionData._raw
    }
  }
}

export function normalizeBlock(block: solana.SolanaBlock): Block {
  return {
    hash: block.blockhash,
    number: block.parentSlot + 1,
    parentHash: block.previousBlockhash,
    size: block.blockHeight,
    timestamp: block.blockTime,
    transactions: []
  }
}

export function validateSwapParams(swapParams: SwapParams): void {
  validateValue(swapParams.value)
  validateSecretHash(swapParams.secretHash)
  validateExpiration(swapParams.expiration)
  validateAddress(swapParams.recipientAddress)
  validateAddress(swapParams.refundAddress)
}
