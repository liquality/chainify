import { SendOptions } from '../chain'

export interface SolanaSendOptions extends SendOptions {
  signer: any
}

export interface SolanaBlock {
  blockhash: string
  parentSlot: number
  previousBlockhash: string
  blockHeight: number
  blockTime: number
}
