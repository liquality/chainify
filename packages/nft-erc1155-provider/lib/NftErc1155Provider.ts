import { Provider } from '@liquality/provider'
import { addressToString } from '@liquality/utils'
import { ensure0x, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { NftProvider, Address } from '@liquality/types'
import { StandardError } from '@liquality/errors'

import { isArray } from 'lodash'
import { Contract } from '@ethersproject/contracts'
import { Signer } from '@ethersproject/abstract-signer'

import NftErc1155_ABI from './NftErc1155_ABI.json'

const erc1155InterfaceID = '0xd9b67a26'

export default class NftErc1155Provider extends Provider implements Partial<NftProvider> {
  _contract: Contract
  _signer: Signer
  _contractCache: { [address: string]: boolean }

  constructor(signer: Signer) {
    super()

    this._signer = signer
    this._contract = new Contract('0x0000000000000000000000000000000000000000', NftErc1155_ABI, this._signer)
    this._contractCache = {}
  }

  async balance(contract: Address | string, tokenIDs: number | number[]) {
    if (!tokenIDs) {
      return 0
    }

    await this._attach(contract)
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
    await this._attach(contract)

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
    await this._attach(contract)

    const txWithHash = await this._contract.functions.setApprovalForAll(ensure0x(addressToString(receiver)), state)
    return normalizeTransactionObject(txWithHash)
  }

  async isApprovedForAll(contract: Address | string, operator: Address | string) {
    await this._attach(contract)

    const state = await this._contract.functions.isApprovedForAll(
      await this._signer.getAddress(),
      ensure0x(addressToString(operator))
    )
    return state[0]
  }

  private async _supportsInterface(contractInstance: Contract) {
    const contractAddress = contractInstance.address.toLowerCase()

    if (this._contractCache[contractAddress] !== undefined) {
      return this._contractCache[contractAddress]
    }

    const state = await contractInstance.functions.supportsInterface(erc1155InterfaceID)
    this._contractCache[contractAddress] = state[0] // store in cache
    return state[0]
  }

  private async _attach(contract: Address | string) {
    const _contractAddress = ensure0x(addressToString(contract))

    if (this._contract.address !== _contractAddress) {
      const contractInstance = this._contract.attach(_contractAddress)
      // contract validation
      if (await this._supportsInterface(contractInstance)) {
        this._contract = contractInstance
      } else {
        throw new StandardError(
          `Contract on address: ${_contractAddress} does not support EIP1155 interface (id: ${erc1155InterfaceID})`
        )
      }
    }
  }
}
