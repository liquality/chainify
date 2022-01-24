import { addressToString } from '@liquality/utils'
import { ensure0x } from '@liquality/ethereum-utils'
import { NftProvider, Address, BigNumber } from '@liquality/types'
import { NftBaseProvider } from '@liquality/nft-base-provider'
import { StandardError } from '@liquality/errors'

import { isArray } from 'lodash'

import NftErc721_ABI from './NftErc721_ABI.json'
const erc721ProtocolName = 'ERC721'
const erc721InterfaceID = '0x80ac58cd'

export default class NftErc721Provider extends NftBaseProvider implements Partial<NftProvider> {
  constructor() {
    super(NftErc721_ABI as any, erc721InterfaceID, erc721ProtocolName)
  }

  async balance(contract: Address | string) {
    await super.supportsInterface(contract)
    const owner = ensure0x(addressToString((await this.client.getMethod('getAddresses')())[0]))

    const callData = await this._contract.populateTransaction.balanceOf(owner)
    const amountsEncoded = await this.getMethod('call')(ensure0x(addressToString(contract)), callData.data)
    const amountsDecoded = this._contract.interface.decodeFunctionResult('balanceOf', amountsEncoded)

    return amountsDecoded[0].toNumber()
  }

  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokensID: number[],
    values?: number[],
    data = '0x00'
  ) {
    if (!isArray(tokensID)) {
      throw new StandardError(`'tokenIDs' input argument must be a numeric array`)
    }

    if (tokensID.length > 1) {
      throw new StandardError(`'tokenIDs' can contain only single item in case of ERC721`)
    }

    await super.supportsInterface(contract)
    const owner = ensure0x(addressToString((await this.client.getMethod('getAddresses')())[0]))

    const txData = await this._contract.populateTransaction['safeTransferFrom(address,address,uint256,bytes)'](
      owner,
      ensure0x(addressToString(receiver)),
      tokensID[0].toString(),
      data
    )

    const tx = await this.client.chain.sendTransaction({
      to: ensure0x(addressToString(contract)),
      value: new BigNumber(0),
      data: txData.data
    })

    return tx
  }

  async approve(contract: Address | string, operator: Address | string, tokenID: number) {
    await super.supportsInterface(contract)

    const txData = await this._contract.populateTransaction.approve(
      ensure0x(addressToString(operator)),
      tokenID.toString()
    )

    const tx = await this.client.chain.sendTransaction({
      to: ensure0x(addressToString(contract)),
      value: new BigNumber(0),
      data: txData.data
    })

    return tx
  }

  async isApproved(contract: Address | string, tokenID: number) {
    await super.supportsInterface(contract)

    const callData = await this._contract.populateTransaction.getApproved(tokenID.toString())
    const addressEncoded = await this.getMethod('call')(ensure0x(addressToString(contract)), callData.data)
    const addressDecoded = this._contract.interface.decodeFunctionResult('getApproved', addressEncoded)

    return addressDecoded[0]
  }

  async approveAll(contract: Address | string, operator: Address | string, state = true) {
    await super.supportsInterface(contract)

    const txData = await this._contract.populateTransaction.setApprovalForAll(
      ensure0x(addressToString(operator)),
      state
    )

    const tx = await this.client.chain.sendTransaction({
      to: ensure0x(addressToString(contract)),
      value: new BigNumber(0),
      data: txData.data
    })

    return tx
  }

  async isApprovedForAll(contract: Address | string, operator: Address | string) {
    await super.supportsInterface(contract)
    const owner = ensure0x(addressToString((await this.client.getMethod('getAddresses')())[0]))

    const callData = await this._contract.populateTransaction.isApprovedForAll(
      owner,
      ensure0x(addressToString(operator))
    )
    const stateEncoded = await this.getMethod('call')(ensure0x(addressToString(contract)), callData.data)
    const stateDecoded = this._contract.interface.decodeFunctionResult('isApprovedForAll', stateEncoded)

    return stateDecoded[0]
  }
}
