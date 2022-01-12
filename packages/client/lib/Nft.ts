import { NftProvider, BigNumber, Address, Transaction } from '@liquality/types'

export default class Nft implements NftProvider {
  client: any

  constructor(client: any) {
    this.client = client
  }

  /** @inheritdoc */
  async balance(contract: Address | string, tokenIDs?: BigNumber | BigNumber[]): Promise<BigNumber | BigNumber[]> {
    const balance = await this.client.getMethod('balance')(contract, tokenIDs)
    return balance
  }

  /** @inheritdoc */
  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIds: BigNumber | BigNumber[],
    values?: BigNumber[]
  ): Promise<Transaction> {
    const transaction = await this.client.getMethod('transfer')(contract, receiver, tokenIds, values)
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
