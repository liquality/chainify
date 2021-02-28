declare module 'ethereumjs-tx' {
  import { Buffer } from 'safe-buffer'
  import * as BigNumber from 'bignumber.js'

  class Tx {
    constructor (raw: Buffer|Tx.TransactionProperties)
    sign(privateKey: Buffer): void
    serialize(): Buffer
  }

  namespace Tx {
    interface TransactionProperties {
      nonce?: Buffer | number | string
      gasPrice?: Buffer | BigNumber.BigNumber | number | string
      gasLimit?: Buffer | BigNumber.BigNumber | number | string
      gas?: Buffer | BigNumber.BigNumber | number | string
      to?: Buffer | string
      value?: Buffer | string | number | BigNumber.BigNumber
      data?: Buffer | string
      v?: Buffer | number | string
      r?: Buffer | number | string
      s?: Buffer | number | string
      chainId?: number
    }
  }

  export = Tx
}