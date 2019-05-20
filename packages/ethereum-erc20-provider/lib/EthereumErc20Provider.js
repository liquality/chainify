import { isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import Provider from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import {
  ensure0x,
  remove0x,
  removeAddress0x
} from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'

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

    const encodedAddress = padHexStart(remove0x(to), 64)
    const encodedValue = padHexStart(value, 64)

    return [
      remove0x(SOL_TRANSFER_FUNCTION),
      encodedAddress,
      encodedValue
    ].join('').toLowerCase()
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

  generateErc20Approve (spender, value) {
    // function approve(address spender, uint256 value) public returns (bool success)
    const functionSignature = '095ea7b3'
    const encodedAddress = padHexStart(removeAddress0x(spender), 64)
    const encodedValue = padHexStart(new BigNumber(value).toString(16), 64)
    return functionSignature + encodedAddress + encodedValue
  }

  erc20Approve (spender, value) {
    const txBytecode = this.generateErc20Approve(spender, value)
    return this.getMethod('sendTransaction')(ensure0x(this._contractAddress), 0, txBytecode)
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
          data: [
            SOL_BALACE_OF_FUNCTION,
            padHexStart(remove0x(address), 64)
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

  async getMempoolBalance (addresses) {
    // function balanceOf(address tokenOwner)
    const functionSignature = '0x70a08231'
    addresses = addresses
      .map(address => String(address))
    const addrs = addresses.map(ensure0x)
    const balances = (await Promise.all(addrs.map(address => this.getMethod('jsonrpc')('eth_call', { data: functionSignature + padHexStart(removeAddress0x(address), 64), to: ensure0x(this._contractAddress) }, 'pending'))))
      .map(balance => parseInt(balance, 16))
      .reduce((acc, balance) => acc + balance, 0)
    return isNaN(balances) ? 0 : balances
  }

  async getErc20Name () {
    const functionSignature = '0x06fdde03'
    const hexName = await this.getMethod('jsonrpc')('eth_call', { data: functionSignature, to: ensure0x(this._contractAddress) }, 'latest')
    return hexToAscii(hexName.slice(128, 128 + parseInt(hexName.slice(126, 128), 16) * 2))
  }

  async getErc20Symbol () {
    const functionSignature = '0x95d89b41'
    const hexSymbol = await this.getMethod('jsonrpc')('eth_call', { data: functionSignature, to: ensure0x(this._contractAddress) }, 'latest')
    return hexToAscii(hexSymbol.slice(128, 128 + parseInt(hexSymbol.slice(126, 128), 16) * 2))
  }

  async getErc20Decimals () {
    const functionSignature = '0x313ce567'
    const decimals = await this.getMethod('jsonrpc')('eth_call', { data: functionSignature, to: ensure0x(this._contractAddress) }, 'latest')
    return parseInt(decimals, 16)
  }
}

EthereumErc20Provider.version = version
