import { addressToString } from '@liquality/utils'
import { ensure0x, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { NftProvider, Address } from '@liquality/types'
import { NftBaseProvider } from '@liquality/nft-base-provider'

import { Signer } from '@ethersproject/abstract-signer'

import NftErc721_ABI from './NftErc721_ABI.json'
const erc721InterfaceID = '0x80ac58cd'

export default class NftErc721Provider extends NftBaseProvider implements Partial<NftProvider> {
  constructor(signer: Signer) {
    super(signer, NftErc721_ABI as any, erc721InterfaceID)
  }

  async balance(contract: Address | string) {
    await super.setContract(contract)

    const amount = await this._contract.functions.balanceOf(await this._signer.getAddress())
    return amount[0].toNumber()
  }

  async transfer(contract: Address | string, receiver: Address | string, tokenID: number) {
    await super.setContract(contract)

    const txWithHash = await this._contract['safeTransferFrom(address,address,uint256)'](
      await this._signer.getAddress(),
      ensure0x(addressToString(receiver)),
      tokenID.toString()
    )
    return normalizeTransactionObject(txWithHash)
  }

  async approve(contract: Address | string, operator: Address | string, tokenID: number) {
    await super.setContract(contract)

    const txWithHash = await this._contract.functions.approve(ensure0x(addressToString(operator)), tokenID.toString())
    return normalizeTransactionObject(txWithHash)
  }

  async isApproved(contract: Address | string, tokenID: number) {
    await super.setContract(contract)

    const operator = await this._contract.functions.getApproved(tokenID.toString())
    return operator[0]
  }

  async approveAll(contract: Address | string, operator: Address | string, state = true) {
    await super.setContract(contract)

    const txWithHash = await this._contract.functions.setApprovalForAll(ensure0x(addressToString(operator)), state)
    return normalizeTransactionObject(txWithHash)
  }

  async isApprovedForAll(contract: Address | string, operator: Address | string) {
    await super.setContract(contract)

    const state = await this._contract.functions.isApprovedForAll(
      await this._signer.getAddress(),
      ensure0x(addressToString(operator))
    )
    return state[0]
  }
}
