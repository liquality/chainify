import BigNumber from 'bignumber.js'
import { SendOptions } from '../chain'

export interface SolanaSendOptions extends SendOptions {
  instructions?: any[]
  accounts?: any[]
  bytecode?: number[]
}
export interface SolanaBlock {
  blockhash: string
  parentSlot: number
  previousBlockhash: string
  blockHeight?: number
  blockTime: number
}

export interface InputTransaction {
  programId: string
  data?: any
  expiration?: number
  recipientAddress?: string
  refundAddress?: string
  value?: BigNumber
}

export interface InitData {
  buyer: string
  seller: string
  secret_hash: string
  expiration: number
  value: number
}
