import BigNumber from 'bignumber.js'
import { SendOptions } from '../chain'

export interface SolanaSendOptions extends SendOptions {
  instructions: any[]
  accounts: any[]
  bytecode: number[]
}
export interface SolanaBlock {
  blockhash: string
  parentSlot: number
  previousBlockhash: string
  blockHeight: number
  blockTime: number
}

export interface InputTransaction {
  programId: string
  data?: object
  expiration?: number
  recipientAddress?: string
  refundAddress?: string
  value?: BigNumber
}
