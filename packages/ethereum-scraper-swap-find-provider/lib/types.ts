import { ethereum } from '@liquality/types'

export interface Transaction {
  from: ethereum.Address
  to: ethereum.Address | null
  hash: ethereum.Hex256
  value: ethereum.Hex
  gas?: ethereum.Hex
  gasPrice?: ethereum.Hex
  input?: ethereum.Hex
  secret?: ethereum.Hex
  blockHash: ethereum.Hex256
  blockNumber: ethereum.Hex
  status: ethereum.TransactionReceiptStatus
  contractAddress: ethereum.Address
  timestamp: ethereum.Hex
  confirmations: number
}
