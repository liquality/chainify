import { SendOptions } from '../chain'

export interface TerraSendOptions extends SendOptions {
  messages?: any[]
}

export interface InputTransaction {
  buyer?: string
  sender?: string
  expiration?: number
  value?: number
  secret_hash?: string
  secret?: string
  contractAddress?: string
  method?: {
    claim?: {
      secret: string
    }
    refund: {}
  }
}
