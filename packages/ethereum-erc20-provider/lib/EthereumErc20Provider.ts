import { Provider } from '@liquality/provider'
import { padHexStart } from '@liquality/crypto'
import { addressToString } from '@liquality/utils'
import { ensure0x, hexToNumber, remove0x, numberToHex } from '@liquality/ethereum-utils'
import { ChainProvider, SendOptions, BigNumber, Address } from '@liquality/types'
import { InsufficientBalanceError } from '@liquality/errors'

const SOL_TRANSFER_FUNCTION = '0xa9059cbb' // transfer(address,uint256)
const SOL_BALACE_OF_FUNCTION = '0x70a08231' // balanceOf(address)

export default class EthereumErc20Provider extends Provider implements Partial<ChainProvider> {
  _contractAddress: string

  constructor(contractAddress: string) {
    super()
    this._contractAddress = remove0x(contractAddress)
  }

  generateErc20Transfer(to: string, value: BigNumber) {
    const encodedAddress = padHexStart(remove0x(to), 32)
    const encodedValue = padHexStart(remove0x(numberToHex(value)), 32)

    return [remove0x(SOL_TRANSFER_FUNCTION), encodedAddress, encodedValue].join('').toLowerCase()
  }

  async sendTransaction(options: SendOptions) {
    if (!options.data) {
      // erc20 transfer
      await this.getMethod('assertContractExists')(this._contractAddress)

      // check for erc20 balance
      const addresses: Address[] = await this.getMethod('getAddresses')()
      const balance = await this.getBalance(addresses.map((address) => address.address))
      if (balance.isLessThan(options.value)) {
        throw new InsufficientBalanceError(
          `${addresses[0]} doesn't have enough balance (has: ${balance}, want: ${options.value})`
        )
      }

      options.data = this.generateErc20Transfer(addressToString(options.to), options.value)
      options.value = new BigNumber(0)
      options.to = ensure0x(this._contractAddress)
    }

    return this.getMethod('sendTransaction')(options)
  }

  async sendSweepTransaction(address: Address | string, gasPrice: number) {
    const addresses: Address[] = await this.getMethod('getAddresses')()

    const balance = await this.getBalance(addresses.map((address) => address.address))

    const sendOptions: SendOptions = {
      to: address,
      value: balance,
      data: null,
      fee: gasPrice
    }

    return this.sendTransaction(sendOptions)
  }

  getContractAddress() {
    return this._contractAddress
  }

  async getBalance(_addresses: (Address | string)[]) {
    await this.getMethod('assertContractExists')(this._contractAddress)

    const addresses = _addresses.map(addressToString).map(ensure0x)

    const promiseBalances = await Promise.all(
      addresses.map((address) =>
        this.getMethod('jsonrpc')(
          'eth_call',
          {
            data: [SOL_BALACE_OF_FUNCTION, padHexStart(remove0x(address), 32)].join('').toLowerCase(),
            to: ensure0x(this._contractAddress).toLowerCase()
          },
          'latest'
        )
      )
    )

    return promiseBalances
      .map((balance) => new BigNumber(hexToNumber(balance)))
      .filter((balance) => !balance.isNaN())
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }
}
