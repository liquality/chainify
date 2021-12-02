export interface InputTransaction {
  buyer?: string
  seller?: string
  expiration?: number
  value?: number
  secret_hash?: string
  secret?: string
  contractAddress?: string
  method?: {
    claim?: {
      secret: string
    }
    refund?: () => void
  }
  confirmations?: number
  codeId?: number
}
