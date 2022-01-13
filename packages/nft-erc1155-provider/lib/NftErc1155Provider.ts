import { Provider } from '@liquality/provider'
import { addressToString } from '@liquality/utils'
import { ensure0x, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { NftProvider, Address, BigNumber } from '@liquality/types'

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
    if (this._contract.address != contract) {
      this._contract = this._contract.attach(ensure0x(addressToString(contract)))
    }
  }

  async balance(contract: Address | string, tokenIDs?: BigNumber | BigNumber[]) {
    this._attach(contract)

    let amount = [new BigNumber(0)]
    if (tokenIDs && tokenIDs.constructor === Array) {
      amount = await this._contract.functions.balanceOfBatch([this._wallet.getAddress()], tokenIDs)
    }

    return amount
  }

  async transfer(
    contract: Address | string,
    receiver: Address | string,
    tokenIDs: BigNumber | BigNumber[],
    values?: BigNumber[]
  ) {
    this._attach(contract)

    if (tokenIDs && tokenIDs.constructor === Array) {
      const txWithHash = await this._contract.functions.safeBatchTransferFrom(
        this._wallet.getAddress(),
        ensure0x(addressToString(receiver)),
        tokenIDs,
        values
      )
      return normalizeTransactionObject(txWithHash)
    }

    // TODO: maybe return error
  }

  async approveAll(contract: Address | string, receiver: Address | string, state = true) {
    this._attach(contract)

    const txWithHash = await this._contract.functions.setApprovalForAll(ensure0x(addressToString(receiver)), state)
    return normalizeTransactionObject(txWithHash)
  }

  async isApprovedForAll(contract: Address | string, owner: Address | string, operator: Address | string) {
    this._attach(contract)

    const state = await this._contract.functions.isApprovedForAll(
      ensure0x(addressToString(owner)),
      ensure0x(addressToString(operator))
    )
    return state
  }
}
