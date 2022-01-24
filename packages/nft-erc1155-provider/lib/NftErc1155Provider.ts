import { addressToString } from '@liquality/utils'
import { ensure0x } from '@liquality/ethereum-utils'
import { NftProvider, Address, BigNumber } from '@liquality/types'
import { StandardError } from '@liquality/errors'
import { NftBaseProvider } from '@liquality/nft-base-provider'

import { isArray } from 'lodash'

import NftErc1155_ABI from './NftErc1155_ABI.json'
const erc1155ProtocolName = 'ERC1155'
const erc1155InterfaceID = '0xd9b67a26'

export default class NftErc1155Provider extends NftBaseProvider implements Partial<NftProvider> {
  constructor() {
    super(NftErc1155_ABI as any, erc1155InterfaceID, erc1155ProtocolName)
  }

  async balance(contract: Address | string, tokenIDs: number[]) {
    if (!isArray(tokenIDs)) {
      throw new StandardError(`'tokenIDs' input argument must be a numeric array`)
    }

    await super.supportsInterface(contract)
    const owner = ensure0x(addressToString((await this.client.getMethod('getAddresses')())[0]))

    if (tokenIDs.length > 1) {
      const addresses = Array.from({ length: tokenIDs.length }).fill(owner)
      const callData = await this._contract.populateTransaction.balanceOfBatch(addresses, tokenIDs)
      const amountsEncoded = await this.getMethod('call')(ensure0x(addressToString(contract)), callData.data)
      const amountsDecoded = this._contract.interface.decodeFunctionResult('balanceOfBatch', amountsEncoded)
      return amountsDecoded[0].map((amount: any) => amount.toNumber())
    }

    const callData = await this._contract.populateTransaction.balanceOf(owner, tokenIDs[0])
    const amountEncoded = await this.getMethod('call')(ensure0x(addressToString(contract)), callData.data)
    const amountDecoded = this._contract.interface.decodeFunctionResult('balanceOf', amountEncoded)
    return amountDecoded[0].toNumber()
  }

  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: number[],
    values: number[],
    data = '0x00'
  ) {
    if (!isArray(tokenIDs)) {
      throw new StandardError(`'tokenIDs' input argument must be a numeric array`)
    }

    if (!isArray(values)) {
      throw new StandardError(`'values' input argument must be a numeric array`)
    }

    if (tokenIDs.length !== values.length) {
      throw new StandardError(`'tokenIDs' && 'values' must have a matching length`)
    }

    await super.supportsInterface(contract)
    const owner = ensure0x(addressToString((await this.client.getMethod('getAddresses')())[0]))

    if (tokenIDs.length === 1) {
      const txData = await this._contract.populateTransaction.safeTransferFrom(
        owner,
        ensure0x(addressToString(receiver)),
        tokenIDs[0],
        values[0],
        data
      )

      const tx = await this.client.chain.sendTransaction({
        to: ensure0x(addressToString(contract)),
        value: new BigNumber(0),
        data: txData.data
      })

      return tx
    }

    const txData = await this._contract.populateTransaction.safeBatchTransferFrom(
      owner,
      ensure0x(addressToString(receiver)),
      tokenIDs,
      values,
      data
    )

    const tx = await this.client.chain.sendTransaction({
      to: ensure0x(addressToString(contract)),
      value: new BigNumber(0),
      data: txData.data
    })

    return tx
  }

  async approveAll(contract: Address | string, receiver: Address | string, state = true) {
    await super.supportsInterface(contract)

    const txData = await this._contract.populateTransaction.setApprovalForAll(
      ensure0x(addressToString(receiver)),
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
