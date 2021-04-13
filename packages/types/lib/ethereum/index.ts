import BigNumber from 'bignumber.js'

/** MIT License

Copyright (c) 2018 moody

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

/**
 * @pattern ^0x[a-fA-F0-9]*$
 */
export type Hex = string
/**
 * @pattern ^0x[a-fA-F0-9]{64}$
 */
export type Hex256 = string
/**
 * @pattern ^0x[a-fA-F0-9]{40}$
 */
export type Hex160 = string
export type Address = Hex160
export type Topic = Hex256

export interface Log {
  logIndex: Hex
  blockNumber: Hex
  blockHash: Hex256
  transactionHash: Hex256
  transactionIndex: Hex
  address: Address
  data: Hex
  topics: Topic[]
  removed?: boolean

  [key: string]: any
}

export declare type UnsignedTransaction = {
  from?: Address
  to?: Address
  nonce?: number
  gas?: BigNumber
  gasPrice?: BigNumber
  data?: Hex
  value?: BigNumber
  chainId?: number
}

export interface TransactionRequest {
  from: Address
  to?: Address | null
  value: Hex
  gas?: Hex
  gasPrice?: Hex
  data?: Hex
  nonce?: Hex
}

export interface PartialTransaction {
  hash?: Hex256
  nonce?: Hex

  from: Address
  to?: Address | null
  value: Hex
  gas?: Hex
  gasPrice?: Hex
  input?: Hex

  // these are included by both geth and parity but not required
  v?: Hex
  r?: Hex
  s?: Hex

  // only mined transactions
  blockHash?: Hex256
  blockNumber?: Hex
  transactionIndex?: Hex
}

export interface Transaction extends PartialTransaction {
  hash: Hex256
  nonce: Hex

  to: Address | null
  gas: Hex
  gasPrice: Hex
  input: Hex
}

export interface Block {
  hash: Hex256
  difficulty: Hex
  extraData: Hex
  gasLimit: Hex
  gasUsed: Hex
  logsBloom: Hex
  miner: Address
  mixHash?: Hex
  nonce?: Hex
  number: Hex
  parentHash: Hex256
  receiptsRoot: Hex
  sha3Uncles: Hex256
  size: Hex
  stateRoot: Hex
  timestamp: Hex
  totalDifficulty: Hex
  transactionsRoot: Hex256
  uncles: Hex256[]

  [key: string]: any
}

// 0x0 (FAILURE) or 0x1 (SUCCESS)
export type TransactionReceiptStatus = '0x0' | '0x1'

export interface TransactionReceipt {
  transactionHash: Hex256
  transactionIndex: Hex
  blockNumber: Hex
  blockHash: Hex256
  cumulativeGasUsed: Hex
  gasUsed: Hex
  from?: Address
  to?: Address
  contractAddress: Address | null
  logs: Log[]
  logsBloom: Hex
  status: TransactionReceiptStatus

  [key: string]: any
}

export interface BlockWithTransactionHashes extends Block {
  transactions: Hex256[]

  [key: string]: any
}

export interface BlockWithFullTransactions extends Block {
  transactions: Transaction[]

  [key: string]: any
}
