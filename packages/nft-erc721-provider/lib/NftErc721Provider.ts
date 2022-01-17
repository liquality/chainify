import { Provider } from '@liquality/provider'
import { addressToString } from '@liquality/utils'
import { ensure0x, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { NftProvider, Address } from '@liquality/types'
import { StandardError } from '@liquality/errors'

import { Contract } from '@ethersproject/contracts'
import { Signer } from '@ethersproject/abstract-signer'

import NftErc721_ABI from './NftErc721_ABI.json'

const erc721InterfaceID = '0x80ac58cd'

export default class NftErc721Provider extends Provider implements Partial<NftProvider> {
  _contract: Contract
  _signer: Signer
  _contractCache: { [address: string]: boolean }

  constructor(signer: Signer) {
    super()

    this._signer = signer
    this._contract = new Contract('0x0000000000000000000000000000000000000000', NftErc721_ABI, this._signer)
    this._contractCache = {}
  }

  async balance(contract: Address | string) {
    await this._attach(contract)

    const amount = await this._contract.functions.balanceOf(await this._signer.getAddress())
    return amount[0].toNumber()
  }

  async transfer(contract: Address | string, receiver: Address | string, tokenID: number) {
    await this._attach(contract)

    const txWithHash = await this._contract['safeTransferFrom(address,address,uint256)'](
      await this._signer.getAddress(),
      ensure0x(addressToString(receiver)),
      tokenID.toString()
    )
    return normalizeTransactionObject(txWithHash)
  }

  async approve(contract: Address | string, operator: Address | string, tokenID: number) {
    await this._attach(contract)

    const txWithHash = await this._contract.functions.approve(ensure0x(addressToString(operator)), tokenID.toString())
    return normalizeTransactionObject(txWithHash)
  }

  async isApproved(contract: Address | string, tokenID: number) {
    await this._attach(contract)

    const operator = await this._contract.functions.getApproved(tokenID.toString())
    return operator[0]
  }

  async approveAll(contract: Address | string, operator: Address | string, state = true) {
    await this._attach(contract)

    const txWithHash = await this._contract.functions.setApprovalForAll(ensure0x(addressToString(operator)), state)
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

    const state = await contractInstance.functions.supportsInterface(erc721InterfaceID)
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
          `Contract on address: ${_contractAddress} does not support EIP721 interface (id: ${erc721InterfaceID})`
        )
      }
    }
  }
}
