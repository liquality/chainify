export interface Block<TransactionType = any> {
  // Block number
  number: number
  // Block hash
  hash: string
  // Block timestamp in seconds
  timestamp: number
  // The size of this block in bytes
  size: number
  // The difficulty field
  difficulty: number
  // Hash of the parent block
  parentHash: string
  // Nonce
  nonce: number
  // List of transactions
  transactions?: TransactionType[]
}
