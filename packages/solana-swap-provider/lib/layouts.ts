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
        ['expiration', 'u64']
      ]
    }
  ]
])

export const createInitBuffer = (buyer: string, seller: string, secret_hash: string, expiration: number) => {
  const initTemplate = new Template({
    instruction: INTRSUCTION.INIT,
    buyer,
    seller,
    secret_hash,
    expiration
  })

  return serialize(initSchema, initTemplate)
}

const claimSchema = new Map([
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

const refundSchema = new Map([
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
