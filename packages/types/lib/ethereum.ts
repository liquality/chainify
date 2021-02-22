import BigNumber from 'bignumber.js'

export declare type RawTransaction = {
  from?: string
  to?: string
  nonce?: string
  gasLimit?: string
  gasPrice?: string
  data?: string
  value?: string
}

export declare type UnsignedTransaction = {
  from?: string
  to?: string
  nonce?: number
  gasLimit?: BigNumber
  gasPrice?: BigNumber
  data?: string
  value?: BigNumber
  chainId?: number
}

export interface Transaction {
  hash?: string
  to?: string
  from?: string
  nonce: number
  gasLimit: BigNumber
  gasPrice: BigNumber
  data: string
  value: BigNumber
  chainId: number
  r?: string
  s?: string
  v?: number
}

export type TransactionRequest = {
  to?: string
  from?: string
  nonce?: BigNumber

  gasLimit?: BigNumber
  gasPrice?: BigNumber

  data?: string
  value?: BigNumber
  chainId?: number
}

export interface TransactionResponse extends Transaction {
  hash: string

  // Only if a transaction has been mined
  blockNumber?: number
  blockHash?: string
  timestamp?: number

  confirmations: number

  // Not optional (as it is in Transaction)
  from: string

  // The raw transaction
  raw?: string
};

export type BlockTag = string | number

interface _Block {
  hash: string
  parentHash: string
  number: number

  timestamp: number
  nonce: string
  difficulty: number

  gasLimit: BigNumber
  gasUsed: BigNumber

  miner: string
  extraData: string
}

export interface Block extends _Block {
  transactions: Array<string>
}

export interface BlockWithTransactions extends _Block {
  transactions: Array<TransactionResponse>
}

export interface Log {
  blockNumber: number
  blockHash: string
  transactionIndex: number

  removed: boolean

  address: string
  data: string

  topics: Array<string>

  transactionHash: string
  logIndex: number
}

export interface TransactionReceipt {
  to: string
  from: string
  contractAddress: string
  transactionIndex: number
  root?: string
  gasUsed: BigNumber
  logsBloom: string
  blockHash: string
  transactionHash: string
  logs: Array<Log>
  blockNumber: number
  confirmations: number
  cumulativeGasUsed: BigNumber
  byzantium: boolean
  status?: number
}