import { NftProvider, BigNumber, Address, Transaction } from '@liquality/types'

export default class Nft implements NftProvider {
  client: any

  constructor(client: any) {
    this.client = client
  }

  /** @inheritdoc */
  async balance(contract: Address | string): Promise<BigNumber> {
    const balance = await this.client.getMethod('balance')(contract)
    return balance
  }

  /** @inheritdoc */
  async transfer(contract: Address | string, receiver: Address | string, tokenId: BigNumber): Promise<Transaction> {
    const transaction = await this.client.getMethod('transfer')(contract, receiver, tokenId)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async approve(contract: Address | string, receiver: Address | string, tokenId: BigNumber): Promise<Transaction> {
    const transaction = await this.client.getMethod('approve')(contract, receiver, tokenId)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async approveAll(contract: Address | string, receiver: Address | string, state?: boolean): Promise<Transaction> {
    const transaction = await this.client.getMethod('approveAll')(contract, receiver, state)
    this.client.assertValidTransaction(transaction)
    return transaction
  }
}
