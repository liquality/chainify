import { Provider } from '@liquality/provider'
import { addressToString } from '@liquality/utils'
import { ensure0x } from '@liquality/ethereum-utils'
import { Address } from '@liquality/types'
import { StandardError } from '@liquality/errors'

import { Contract } from '@ethersproject/contracts'

export default abstract class NftBaseProvider extends Provider {
  _contract: Contract
  _contractCache: { [address: string]: boolean }
  _interfaceID: string
  _protocolName: string

  constructor(contractABI: string, interfaceID: string, protocolName: string) {
    super()

    this._contract = new Contract('0x0000000000000000000000000000000000000000', contractABI)
    this._contractCache = {}
    this._interfaceID = interfaceID
    this._protocolName = protocolName
  }

  async supportsInterface(contract: Address | string) {
    const contractAddress = ensure0x(addressToString(contract))

    // in case contract is not stored in cache
    if (this._contractCache[contractAddress] === undefined) {
      const txData = await this._contract.populateTransaction.supportsInterface(this._interfaceID)
      const stateEncoded = await this.getMethod('call')(contractAddress, txData.data)
      const stateDecoded = this._contract.interface.decodeFunctionResult('supportsInterface', stateEncoded)

      this._contractCache[contractAddress] = stateDecoded[0] // store in cache
    }

    // throw when contract doesn't support correct interface
    if (!this._contractCache[contractAddress]) {
      throw new StandardError(
        `Contract on address: ${contractAddress} does not support ${this._protocolName} interface (id: ${this._interfaceID})`
      )
    }
  }
}
