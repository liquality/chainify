import { SendOptions } from '../chain'

export interface NearSendOptions extends SendOptions {
  actions?: any[]
}

export interface ExecutionError {
  error_message: string
  error_type: string
}

export enum ExecutionStatusBasic {
  Unknown = 'Unknown',
  Pending = 'Pending',
  Failure = 'Failure'
}

export interface ExecutionStatus {
  SuccessValue?: string
  SuccessReceiptId?: string
  Failure?: ExecutionError
}

export interface FinalExecutionStatus {
  SuccessValue?: string
  Failure?: ExecutionError
}

export enum FinalExecutionStatusBasic {
  NotStarted = 'NotStarted',
  Started = 'Started',
  Failure = 'Failure'
}

export interface ExecutionOutcome {
  logs: string[]
  receipt_ids: string[]
  gas_burnt: number
  status: ExecutionStatus | ExecutionStatusBasic
}

export interface ExecutionOutcomeWithId {
  id: string
  block_hash: string
  outcome: ExecutionOutcome
}

interface Tx {
  signer_id: string
  public_key: string
  nonce: number
  receiver_id: string
  actions: any[]
  signature: string
  hash: string
  blockNumber?: number
}

export interface InputTransaction {
  status: FinalExecutionStatus | FinalExecutionStatusBasic
  transaction: Tx
  transaction_outcome: ExecutionOutcomeWithId
  receipts_outcome: ExecutionOutcomeWithId[]
}

export interface NormalizedTransaction {
  confirmations: number
  blockNumber: number
  blockHash: string
  hash: string
  _raw: InputTransaction
  value: number
}

type NearSwapParams = {
  method: string
  secretHash?: string
  expiration?: number
  recipient?: string
  secret?: string
}

export interface NearSwapTransaction extends NormalizedTransaction {
  sender: string
  receiver: string
  code: string
  swap: NearSwapParams
}

export type NearScraperSwap = {
  block_hash: string
  block_timestamp: string
  hash: string
  action_index: number
  signer_id: string
  receiver_id: string
  action_kind: string
  args: { [key: string]: any }
}
