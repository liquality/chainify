import { NftProvider, BigNumber, Address, Transaction } from '@liquality/types'

export default class Nft implements NftProvider {
  client: any

  constructor(client: any) {
    this.client = client
  }

  /** @inheritdoc */
  async balance(contract: Address | string, tokenIDs?: BigNumber[]): Promise<BigNumber | BigNumber[]> {
    const balance = await this.client.getMethod('balance')(contract, tokenIDs)
    return balance
  }

  /** @inheritdoc */
  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: BigNumber | BigNumber[],
    values?: BigNumber[]
  ): Promise<Transaction> {
    const transaction = await this.client.getMethod('transfer')(contract, receiver, tokenIDs, values)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async approve(contract: Address | string, operator: Address | string, tokenID: BigNumber): Promise<Transaction> {
    const transaction = await this.client.getMethod('approve')(contract, operator, tokenID)
    this.client.assertValidTransaction(transaction)
    return transaction
  }

  /** @inheritdoc */
  async isApproved(contract: Address | string, tokenID: BigNumber): Promise<Address> {
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
  async isApprovedForAll(
    contract: Address | string,
    owner: Address | string,
    operator: Address | string
  ): Promise<boolean> {
    const state = await this.client.getMethod('isApprovedForAll')(contract, owner, operator)
    return state
  }
}
