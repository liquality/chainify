import { NftProvider, Address, Transaction } from '@liquality/types'

export default class Nft implements NftProvider {
  client: any

  constructor(client: any) {
    this.client = client
  }

  /** @inheritdoc */
  async balance(contract: Address | string, tokenIDs?: number[]): Promise<number | number[]> {
    const balance = await this.client.getMethod('balance')(contract, tokenIDs)
    return balance
  }

  /** @inheritdoc */
  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: number[],
    values?: number[],
    data?: string
  ): Promise<Transaction> {
    const transaction = await this.client.getMethod('transfer')(contract, receiver, tokenIDs, values, data)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async approve(contract: Address | string, operator: Address | string, tokenID: number): Promise<Transaction> {
    const transaction = await this.client.getMethod('approve')(contract, operator, tokenID)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async isApproved(contract: Address | string, tokenID: number): Promise<Address> {
    const operator = await this.client.getMethod('isApproved')(contract, tokenID)
    return operator
  }

  /** @inheritdoc */
  async approveAll(contract: Address | string, operator: Address | string, state?: boolean): Promise<Transaction> {
    const transaction = await this.client.getMethod('approveAll')(contract, operator, state)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async isApprovedForAll(contract: Address | string, operator: Address | string): Promise<boolean> {
    const state = await this.client.getMethod('isApprovedForAll')(contract, operator)
    return state
  }

  /** @inheritdoc */
  async fetch(owners?: Address[] | string[]): Promise<any> {
    const nftData = await this.client.getMethod('fetch')(owners)
    return nftData
  }
}
