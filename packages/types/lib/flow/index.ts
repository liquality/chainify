export interface Block {
  id: string
  parentId: string
  height: number
  timestamp: string
  collectionGuarantees: any[]
  blockSeals: any[]
  signatures: string[]
}
export interface Tx {
  hash: string
}
