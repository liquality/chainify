import { addressToString } from '@liquality/utils'
import { ensure0x, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { Address } from '@liquality/types'
import { StandardError } from '@liquality/errors'
import { NftBaseProvider } from '@liquality/nft-base-provider'

import { isArray } from 'lodash'
import { Signer } from '@ethersproject/abstract-signer'

import NftErc1155_ABI from './NftErc1155_ABI.json'
const erc1155InterfaceID = '0xd9b67a26'

export default class NftErc1155Provider extends NftBaseProvider {
  constructor(signer: Signer) {
    super(signer, NftErc1155_ABI as any, erc1155InterfaceID)
  }

  async balance(contract: Address | string, tokenIDs: number | number[]) {
    if (!tokenIDs) {
      return 0
    }

    await super.balance(contract, tokenIDs)

    const owner = await this._signer.getAddress()

    if (isArray(tokenIDs)) {
      const addresses = Array.from({ length: tokenIDs.length }).fill(owner)
      const amounts = await this._contract.functions.balanceOfBatch(addresses, tokenIDs)
      return amounts[0].map((amount: any) => amount.toNumber())
    }

    const amount = await this._contract.functions.balanceOf(owner, tokenIDs)
    return amount[0].toNumber()
  }

  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: number[],
    values: number[],
    data = '0x00'
  ) {
    await super.transfer(contract, receiver, tokenIDs, values, data)

    if (isArray(tokenIDs) && isArray(values) && tokenIDs.length === values.length) {
      let txWithHash
      if (tokenIDs.length === 1) {
        txWithHash = await this._contract.functions.safeTransferFrom(
          await this._signer.getAddress(),
          ensure0x(addressToString(receiver)),
          tokenIDs[0],
          values[0],
          data
        )
      } else {
        txWithHash = await this._contract.functions.safeBatchTransferFrom(
          await this._signer.getAddress(),
          ensure0x(addressToString(receiver)),
          tokenIDs,
          values,
          data
        )
      }
      return normalizeTransactionObject(txWithHash)
    }

    throw new StandardError(`Incorrect input arguments in transfer method of ERC1155 Provider`)
  }

  async approveAll(contract: Address | string, receiver: Address | string, state = true) {
    await super.approveAll(contract, receiver, state)

    const txWithHash = await this._contract.functions.setApprovalForAll(ensure0x(addressToString(receiver)), state)
    return normalizeTransactionObject(txWithHash)
  }

  async isApprovedForAll(contract: Address | string, operator: Address | string) {
    await super.isApprovedForAll(contract, operator)

    const state = await this._contract.functions.isApprovedForAll(
      await this._signer.getAddress(),
      ensure0x(addressToString(operator))
    )
    return state[0]
  }
}
