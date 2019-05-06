import { BigNumber } from 'bignumber.js'

import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import {
  ensureAddressStandardFormat,
  ensureHexEthFormat
} from '@liquality/ethereum-utils'

const SOL_TRANSFER_FUNCTION = '0xa9059cbb' // transfer(address,uint256)
const SOL_BALACE_OF_FUNCTION = '0x70a08231' // balanceOf(address)

export default class EthereumErc20Provider extends Provider {
  constructor (contractAddress) {
    super()
    this._contractAddress = ensureAddressStandardFormat(contractAddress)
  }

  generateErc20Transfer (to, value) {
    const encodedAddress = padHexStart(ensureAddressStandardFormat(to), 64)
    const encodedValue = padHexStart(value.toString(16), 64)
    return SOL_TRANSFER_FUNCTION.substring(2) + encodedAddress + encodedValue
  }

  erc20Transfer (to, value) {
    const txBytecode = this.generateErc20Transfer(to, value)
    return this.getMethod('sendTransaction')(ensureHexEthFormat(this._contractAddress), 0, txBytecode)
  }

  getContractAddress () {
    return this._contractAddress
  }

  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))
    const addrs = addresses.map(ensureHexEthFormat)
    const promiseBalances = await Promise.all(addrs.map(address => this.getMethod('jsonrpc')('eth_call', {
      data: SOL_BALACE_OF_FUNCTION + padHexStart(ensureAddressStandardFormat(address), 64),
      to: ensureHexEthFormat(this._contractAddress)
    }, 'latest')))
    return promiseBalances.map(balance => new BigNumber(balance, 16))
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }
}
