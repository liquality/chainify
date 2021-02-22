import BigNumber from 'bignumber.js'

export interface Transaction <T = any> {
  // Transaction hash
  hash: string,
  // The value of the transaction
  value: BigNumber,
  // Hash of the block containing the transaction
  blockHash?: string,
  // The block number containing the trnasaction
  blockNumber?: number,
  // The number of confirmations of the transaction
  confirmations?: number,
  // The price per unit of fee
  feePrice?: BigNumber,
  // The total fee paid for the transaction
  fee?: BigNumber,
  // The raw transaction object
  _raw: T
}
