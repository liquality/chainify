import { SendOptions } from '../chain'
import { Address } from '../address'

export enum MsgType {
  MsgSend = 'MsgSend',
  MsgDelegate = 'MsgDelegate',
  MsgUndelegate = 'MsgUndelegate',
  MsgWithdraw = 'MsgWithdraw',
  MsgTransfer = 'MsgTransfer'
}

export interface CosmosSendOptions extends SendOptions {
  type?: string
  from?: Address | string
  sourcePort?: string
  sourceChannel?: string
}

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
  completionTime?: number
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

export interface NormalizeTxOptions {
  value: number
  blockHash: string
  blockNumber: number
  confirmations: number
  feePrice: number
  fee: number
}

export interface Delegation {
  delegator_address: string
  validator_address: string
  shares: string
}

export interface Balance {
  denom: string
  amount: string
}

export interface DelegationObj {
  delegation: Delegation
  balance: Balance
}
export interface DelegationResponse {
  delegation_response: DelegationObj
}
