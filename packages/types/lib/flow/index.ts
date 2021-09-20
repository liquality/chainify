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
