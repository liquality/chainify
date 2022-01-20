import { Provider } from '@liquality/provider'
import { addressToString } from '@liquality/utils'
import { ensure0x } from '@liquality/ethereum-utils'
import { Address } from '@liquality/types'
import { StandardError } from '@liquality/errors'

import { Contract } from '@ethersproject/contracts'
import { Signer } from '@ethersproject/abstract-signer'

export default abstract class NftBaseProvider extends Provider {
  _contract: Contract
  _signer: Signer
  _contractCache: { [address: string]: boolean }
  _interfaceID: string

  constructor(signer: Signer, contractABI: string, interfaceID: string) {
    super()

    this._signer = signer
    this._contract = new Contract('0x0000000000000000000000000000000000000000', contractABI, this._signer)
    this._contractCache = {}
    this._interfaceID = interfaceID
  }

  private async _supportsInterface(contractInstance: Contract) {
    const contractAddress = contractInstance.address.toLowerCase()

    if (this._contractCache[contractAddress] !== undefined) {
      return this._contractCache[contractAddress]
    }

    const state = await contractInstance.functions.supportsInterface(this._interfaceID)
    this._contractCache[contractAddress] = state[0] // store in cache
    return state[0]
  }

  protected async setContract(contract: Address | string) {
    const _contractAddress = ensure0x(addressToString(contract))

    if (this._contract.address !== _contractAddress) {
      const contractInstance = this._contract.attach(_contractAddress)
      // contract validation
      if (await this._supportsInterface(contractInstance)) {
        this._contract = contractInstance
      } else {
        throw new StandardError(
          `Contract on address: ${_contractAddress} does not support EIP721 interface (id: ${this._interfaceID})`
        )
      }
    }
  }
}
