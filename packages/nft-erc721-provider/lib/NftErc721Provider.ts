import { Provider } from '@liquality/provider'
import { addressToString } from '@liquality/utils'
import { ensure0x, normalizeTransactionObject } from '@liquality/ethereum-utils'
import { NftProvider, Address, BigNumber } from '@liquality/types'

import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Wallet } from '@ethersproject/wallet'

import NftErc721_ABI from './NftErc721_ABI.json'

export default class NftErc721Provider extends Provider implements Partial<NftProvider> {
  _contract: Contract
  _wallet: Wallet
  _jsonRpcProvider: JsonRpcProvider

  constructor(options: { uri: string; mnemonic: string; derivationPath: string }) {
    super()

    this._wallet = Wallet.fromMnemonic(options.mnemonic, options.derivationPath)
    this._wallet = this._wallet.connect(new JsonRpcProvider(options.uri))
    this._contract = new Contract('0x0000000000000000000000000000000000000000', NftErc721_ABI, this._wallet)
  }

  private _attach(contract: Address | string) {
    if (this._contract.address != contract) this._contract = this._contract.attach(ensure0x(addressToString(contract)))
  }

  async balance(contract: Address | string) {
    this._attach(contract)

    const amount = await this._contract.functions.balanceOf(this._wallet.getAddress())
    return amount
  }

  async transfer(contract: Address | string, receiver: Address | string, tokenId: BigNumber) {
    this._attach(contract)
    console.log(this._contract)

    const txWithHash = await this._contract['safeTransferFrom(address,address,uint256)'](
      this._wallet.getAddress(),
      ensure0x(addressToString(receiver)),
      tokenId.toString()
    )
    return normalizeTransactionObject(txWithHash)
  }

  async approve(contract: Address | string, receiver: Address | string, tokenId: BigNumber) {
    this._attach(contract)

    const txWithHash = await this._contract.functions.approve(ensure0x(addressToString(receiver)), tokenId.toString())
    return normalizeTransactionObject(txWithHash)
  }

  async approveAll(contract: Address | string, receiver: Address | string, state = true) {
    this._attach(contract)

    const txWithHash = await this._contract.functions.setApprovalForAll(ensure0x(addressToString(receiver)), state)
    return normalizeTransactionObject(txWithHash)
  }
}
