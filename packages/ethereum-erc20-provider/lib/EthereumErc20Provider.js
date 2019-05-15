import { isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import {
  toLowerCaseWithout0x,
  ensure0x
} from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'

import { version } from '../package.json'

const SOL_TRANSFER_FUNCTION = '0xa9059cbb' // transfer(address,uint256)
const SOL_BALACE_OF_FUNCTION = '0x70a08231' // balanceOf(address)

export default class EthereumErc20Provider extends Provider {
  constructor (contractAddress) {
    super()
    this._contractAddress = toLowerCaseWithout0x(contractAddress)
  }

  generateErc20Transfer (to, value) {
    to = toLowerCaseWithout0x(to)
    value = BigNumber(value).toString(16)

    const encodedAddress = padHexStart(to, 64)
    const encodedValue = padHexStart(value, 64)

    return SOL_TRANSFER_FUNCTION.substring(2) + encodedAddress + encodedValue
  }

  sendTransaction (to, value, data, from) {
    if (!data) {
      // erc20 transfer
      data = this.generateErc20Transfer(to, value)
      value = 0
      to = ensure0x(this._contractAddress)
    }

    return this.getMethod('sendTransaction')(to, value, data, from)
  }

  getContractAddress () {
    return this._contractAddress
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [ addresses ]
    }

    addresses = addresses
      .map(addressToString)
      .map(ensure0x)

    const promiseBalances = await Promise.all(
      addresses.map(address => this.getMethod('jsonrpc')(
        'eth_call',
        {
          data: SOL_BALACE_OF_FUNCTION + padHexStart(toLowerCaseWithout0x(address), 64),
          to: ensure0x(this._contractAddress)
        },
        'latest'
      ))
    )

    return promiseBalances
      .map(balance => BigNumber(balance, 16))
      .filter(balance => !balance.isNaN())
      .reduce((acc, balance) => acc.plus(balance), BigNumber(0))
  }
}

EthereumErc20Provider.version = version
