export interface BlockResponse {
  id: string
  parentId: string
  height: number
  timestamp: string
  collectionGuarantees: any[]
  blockSeals: any[]
  signatures: string[]
}
export interface Tx {
  script: string
  args: any[]
  referenceBlockId: string
  gasLimit: number
  proposalKey: ProposalKey
  payer: string
  authorizers: string[]
  payloadSignatures: Signature[]
  envelopeSignatures: Signature[]
  status: number
  statusCode: number
  errorMessage: string
  events: Event[]

  txId?: string
  blockNumber?: number
  blockConfirmations?: number
}
export interface Event {
  type: string
  transactionId: string
  transactionIndex: number
  eventIndex: number
  data: any
}
export interface Signature {
  address: string
  keyId: number
  signature: string
}

export interface ProposalKey {
  address: string
  keyId: number
  sequenceNumber: number
}
