import { serialize } from 'borsh'

const INTRSUCTION: { INIT: number; CLAIM: number; REFUND: number } = {
  INIT: 0,
  CLAIM: 1,
  REFUND: 2
}

class Assignable {
  [key: string]: any

  constructor(properties: any) {
    Object.keys(properties).forEach((key) => {
      this[key] = properties[key]
    })
  }
}

export class Template extends Assignable {}

export const initSchema = new Map([
  [
    Template,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['buyer', 'string'],
        ['seller', 'string'],
        ['secret_hash', 'string'],
        ['expiration', 'u64'],
        ['value', 'u64']
      ]
    }
  ]
])

export interface InitData {
  buyer: string
  seller: string
  secret_hash: string
  expiration: number
  value: number
}

export const createInitBuffer = ({ buyer, seller, expiration, secret_hash, value }: InitData) => {
  const initTemplate = new Template({
    instruction: INTRSUCTION.INIT,
    buyer,
    seller,
    secret_hash,
    expiration,
    value
  })

  return serialize(initSchema, initTemplate)
}

export const claimSchema = new Map([
  [
    Template,
    {
      kind: 'struct',
      fields: [
        ['instruction', 'u8'],
        ['secret', 'string']
      ]
    }
  ]
])

export const createClaimBuffer = (secret: string) => {
  const claim = new Template({
    instruction: INTRSUCTION.CLAIM,
    secret: secret.toString()
  })

  return serialize(claimSchema, claim)
}

export const refundSchema = new Map([
  [
    Template,
    {
      kind: 'struct',
      fields: [['instruction', 'u8']]
    }
  ]
])

export const createRefundBuffer = () => {
  const refund = new Template({ instruction: INTRSUCTION.REFUND })

  return serialize(refundSchema, refund)
}
