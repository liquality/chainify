import { Provider } from '@liquality/provider'
import { addressToString } from '@liquality/utils'
import { ensure0x, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { NftProvider, Address } from '@liquality/types'

import { Contract } from '@ethersproject/contracts'
import { StaticJsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

import NftErc1155_ABI from './NftErc1155_ABI.json'

export default class NftErc1155Provider extends Provider implements Partial<NftProvider> {
  _contract: Contract
  _wallet: Wallet
  _jsonRpcProvider: StaticJsonRpcProvider

  constructor(options: { uri: string; mnemonic: string; derivationPath: string }) {
    super()

    this._wallet = Wallet.fromMnemonic(options.mnemonic, options.derivationPath)
    this._wallet = this._wallet.connect(new StaticJsonRpcProvider(options.uri))
    this._contract = new Contract('0x0000000000000000000000000000000000000000', NftErc1155_ABI, this._wallet)
  }

  private _attach(contract: Address | string) {
    if (this._contract.address !== contract) {
      this._contract = this._contract.attach(ensure0x(addressToString(contract)))
    }
  }

  async balance(contract: Address | string, tokenIDs: number | number[]) {
    this._attach(contract)

    if (!tokenIDs) return 0

    if (tokenIDs.constructor === Array) {
      const addresses = Array.from({ length: tokenIDs.length }).fill(await this._wallet.getAddress())
      const amounts = await this._contract.functions.balanceOfBatch(addresses, tokenIDs)
      return amounts[0].map((amount: any) => amount.toNumber())
    }

    const amount = await this._contract.functions.balanceOf(await this._wallet.getAddress(), tokenIDs)
    return amount[0].toNumber()
  }

  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: number | number[],
    values: number[],
    data = '0x00'
  ) {
    this._attach(contract)

    if (
      tokenIDs &&
      tokenIDs.constructor === Array &&
      values &&
      values.constructor === Array &&
      tokenIDs.length === values.length
    ) {
      let txWithHash
      if (tokenIDs.length === 1) {
        txWithHash = await this._contract.functions.safeTransferFrom(
          await this._wallet.getAddress(),
          ensure0x(addressToString(receiver)),
          tokenIDs[0],
          values[0],
          data
        )
      } else {
        txWithHash = await this._contract.functions.safeBatchTransferFrom(
          await this._wallet.getAddress(),
          ensure0x(addressToString(receiver)),
          tokenIDs,
          values,
          data
        )
      }
      return normalizeTransactionObject(txWithHash)
    }

    // TODO: return error
  }

  async approveAll(contract: Address | string, receiver: Address | string, state = true) {
    this._attach(contract)

    const txWithHash = await this._contract.functions.setApprovalForAll(ensure0x(addressToString(receiver)), state)
    return normalizeTransactionObject(txWithHash)
  }

  async isApprovedForAll(contract: Address | string, operator: Address | string) {
    this._attach(contract)

    const state = await this._contract.functions.isApprovedForAll(
      await this._wallet.getAddress(),
      ensure0x(addressToString(operator))
    )
    return state[0]
  }
}
