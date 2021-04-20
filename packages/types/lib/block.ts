export interface Block<TransactionType = any> {
  // Block number
  number: number
  // Block hash
  hash: string
  // Block timestamp in seconds
  timestamp: number
  // The size of this block in bytes
  size: number
  // Hash of the parent block
  parentHash: string
  // The difficulty field
  difficulty?: number
  // Nonce
  nonce?: number
  // List of transactions
  transactions?: TransactionType[]
}
