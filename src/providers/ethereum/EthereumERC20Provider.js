import Provider from '../../Provider'
import { padHexStart } from '../../crypto'
import { ensureAddressStandardFormat, ensureHexEthFormat } from './EthereumUtil'

export default class EthereumERC20Provider extends Provider {
  constructor (contractAddress) {
    super()
    this._contractAddress = contractAddress
  }

  erc20Transfer (to, value) {
    const functionSignature = '0xa9059cbb'
    const encodedAddress = padHexStart(ensureAddressStandardFormat(to), 64)
    const encodedValue = padHexStart(value.toString(16), 64)
    const txBytecode = functionSignature + encodedAddress + encodedValue
    return this.getMethod('sendTransaction')(this._contractAddress, 0, txBytecode)
  }

  // TODO Should check for BigNumber
  // TODO What out for metamask provider
  async erc20Balance (addresses) {
    const functionSignature = '0x70a08231'
    addresses = addresses
      .map(address => String(address))
    const addrs = addresses.map(ensureHexEthFormat)
    const promiseBalances = await Promise.all(addrs.map(address => this.getMethod('jsonrpc')('eth_call', { data: functionSignature + padHexStart(ensureAddressStandardFormat(address), 64), to: this._contractAddress }, 'latest')))
    return promiseBalances.map(balance => parseInt(balance, 16))
      .reduce((acc, balance) => acc + balance, 0)
  }
}
