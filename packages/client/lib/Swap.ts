import { sha256 } from '@liquality/crypto'
import { UnimplementedMethodError } from '@liquality/errors'
import { SwapParams, SwapProvider, Transaction, BigNumber } from '@liquality/types'

export default class Swap implements SwapProvider {
  client: any

  constructor (client: any) {
    this.client = client
  }

  /** @inheritdoc */
  async findInitiateSwapTransaction (swapParams: SwapParams, blockNumber?: number) : Promise<Transaction> {
    return this.client.getMethod('findInitiateSwapTransaction')(swapParams, blockNumber)
  }

  /** @inheritdoc */
  async findClaimSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('findClaimSwapTransaction')(swapParams, initiationTxHash, blockNumber)
  }

  /** @inheritdoc */
  async findRefundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('findRefundSwapTransaction')(swapParams, initiationTxHash, blockNumber)
  }

  /** @inheritdoc */
  async findFundSwapTransaction (swapParams: SwapParams, initiationTxHash: string, blockNumber?: number) : Promise<Transaction | null> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('findFundSwapTransaction')(swapParams, initiationTxHash, blockNumber)
  }

  /** @inheritdoc */
  async generateSecret (message: string) : Promise<string> {
    try {
      return this.client.getMethod('generateSecret')(message)
    } catch (e) {
      if (!(e instanceof UnimplementedMethodError)) throw e
    }
    const address = (await this.client.getMethod('getAddresses')())[0]
    const signedMessage = await this.client.getMethod('signMessage')(message, address.address)
    const secret = sha256(signedMessage)
    return secret
  }

  /** @inheritdoc */
  async getSwapSecret (claimTxHash: string) : Promise<string> {
    return this.client.getMethod('getSwapSecret')(claimTxHash)
  }

  /** @inheritdoc */
  async initiateSwap (swapParams: SwapParams, fee: BigNumber) : Promise<Transaction> {
    const transaction = await this.client.getMethod('initiateSwap')(swapParams, fee)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async fundSwap (swapParams: SwapParams, initiationTxHash: string, fee: BigNumber) : Promise<Transaction | null> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    return this.client.getMethod('fundSwap')(swapParams, initiationTxHash, fee)
  }

  /** @inheritdoc */
  verifyInitiateSwapTransaction (swapParams: SwapParams, initiationTxHash: string) : Promise<boolean> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    } 

    return this.client.getMethod('verifyInitiateSwapTransaction')(swapParams, initiationTxHash)
  }

  /** @inheritdoc */
  async claimSwap (swapParams: SwapParams, initiationTxHash: string, secret: string, fee: BigNumber) : Promise <Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    if (!(/[A-Fa-f0-9]{64}/.test(secret))) {
      throw new TypeError('Secret should be a 32 byte hex string')
    }

    const transaction = await this.client.getMethod('claimSwap')(swapParams, initiationTxHash, secret, fee)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async refundSwap (swapParams: SwapParams, initiationTxHash: string, fee: BigNumber) : Promise<Transaction> {
    if (!(/^[A-Fa-f0-9]+$/.test(initiationTxHash))) {
      throw new TypeError('Initiation transaction hash should be a valid hex string')
    }

    const transaction = await this.client.getMethod('refundSwap')(swapParams, initiationTxHash, fee)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  get doesBlockScan () : boolean {
    try {
      return this.client.getMethod('doesBlockScan')()
    } catch (e) {
      if (!(e instanceof UnimplementedMethodError)) throw e
    }
    return true
  }
}
