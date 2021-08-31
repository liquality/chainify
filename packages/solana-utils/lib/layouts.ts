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

export const refundSchema = new Map([
  [
    Template,
    {
      kind: 'struct',
      fields: [['instruction', 'u8']]
    }
  ]
])
