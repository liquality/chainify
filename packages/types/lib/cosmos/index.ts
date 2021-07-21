export interface RpcResponse {
  jsonrpc?: string
  id?: number
  result: any
}

export interface Attribute {
  key: string
  value: string
  index: boolean
}

export interface Event {
  type: string
  attributes: Attribute[]
}

export interface TxResult {
  code: number
  data: string
  log: string
  info: string
  gas_wanted: string
  gas_used: string
  events: Event[]
  codespace: string
}

export interface Tx {
  hash: string
  height: string
  index?: number
  tx_result: TxResult
  tx: string
}

export interface BlockId {
  hash: string
  parts?: any
}

export interface BlockHeader {
  version?: any
  chain_id: string
  height: string
  time: string
  last_block_id?: BlockId
  last_commit_hash?: string
  data_hash?: string
  validators_hash?: string
  next_validators_hash?: string
  consensus_hash?: string
  app_hash?: string
  last_results_hash?: string
  evidence_hash?: string
  proposer_address?: string
}

export interface BlockData {
  txs: string[]
}

export interface Block {
  header: BlockHeader
  data: BlockData
  evidence: any
  last_commit: any
}

export interface BlockResponse {
  block_id: BlockId
  block: Block
}

export interface Currency {
  coinDenom: string
  coinMinimalDenom: string
  coinDecimals: number
}
