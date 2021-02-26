import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import {
  ensure0x,
  remove0x
} from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'
import {
  InsufficientBalanceError
} from '@liquality/errors'

import { isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import { version } from '../package.json'

const SOL_TRANSFER_FUNCTION = '0xa9059cbb' // transfer(address,uint256)
const SOL_BALACE_OF_FUNCTION = '0x70a08231' // balanceOf(address)

export default class EthereumErc20Provider extends Provider {
  constructor (contractAddress) {
    super()
    this._contractAddress = remove0x(contractAddress)
  }

  generateErc20Transfer (to, value) {
    value = BigNumber(value).toString(16)

    const encodedAddress = padHexStart(remove0x(addressToString(to)), 32)
    const encodedValue = padHexStart(value, 32)

    return [
      remove0x(SOL_TRANSFER_FUNCTION),
      encodedAddress,
      encodedValue
    ].join('').toLowerCase()
  }

  async sendTransaction (to, value, data, gasPrice) {
    if (!data) {
      // erc20 transfer
      await this.getMethod('assertContractExists')(this._contractAddress)

      // check for erc20 balance
      const addresses = await this.getMethod('getAddresses')()
      const balance = await this.getBalance(addresses)
      if (balance.isLessThan(value)) {
        throw new InsufficientBalanceError(`${addresses[0]} doesn't have enough balance (has: ${balance}, want: ${value})`)
      }

      data = this.generateErc20Transfer(to, value)
      value = 0
      to = ensure0x(this._contractAddress)
    }

    return this.getMethod('sendTransaction')(to, value, data, gasPrice)
  }

  async sendSweepTransaction (address, gasPrice) {
    const addresses = await this.getMethod('getAddresses')()

    const balance = await this.getBalance(addresses)

    return this.sendTransaction(address, balance, null, gasPrice)
  }

  getContractAddress () {
    return this._contractAddress
  }

  async getBalance (addresses) {
    await this.getMethod('assertContractExists')(this._contractAddress)

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
          data: [
            SOL_BALACE_OF_FUNCTION,
            padHexStart(remove0x(address), 32)
          ].join('').toLowerCase(),
          to: ensure0x(this._contractAddress).toLowerCase()
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
