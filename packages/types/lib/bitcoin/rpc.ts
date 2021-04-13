import { Transaction } from './'

export interface UTXO {
  txid: string
  vout: number
  address: string
  label: string
  scriptPubKey: string
  amount: number
  confirmations: number
  redeemScript: string
  witnessScript: string
  spendable: boolean
  solvable: boolean
  desc: string
  safe: boolean
}

export interface ReceivedByAddress {
  involvesWatchOnly: boolean
  address: string
  account: string
  amount: number
  cofirmations: number
  label: string
  txids: string[]
}

export interface MinedTransaction extends Transaction {
  blockhash: string
  confirmations: number
  blocktime: number
  number: number
}

export interface FundRawResponse {
  hex: string
  fee: number
  changepos: number
}

export interface AddressInfo {
  iswatchonly: boolean
  pubkey: string
  hdkeypath: string
  // ...
}

export type AddressGrouping = string[][]

export interface ReceivedByAddress {
  involvesWatchonly: boolean
  address: string
  account: string
  amount: number
  confirmations: number
  label: string
  txids: string[]
}

export interface Block {
  hash: string
  confirmations: number
  size: number
  strippedSize: number
  weight: number
  height: number
  version: number
  versionHex: string
  merkleroot: string
  tx: string[]
  time: number
  mediantime: number
  nonce: number
  bits: string
  difficulty: number
  chainwork: string
  nTx: number
  previousblockhash: string
  nextblockhash?: string
}
