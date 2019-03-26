import Provider from '../../Provider'
import { padHexStart } from '../../crypto'

export default class EthereumERC20Provider extends Provider {
  constructor (contractAddress) {
    super()
    this._contractAddress = contractAddress
  }

  erc20Transfer (to, value) {
    const functionSignature = 'a9059cbb'
    const encodedAddress = padHexStart(to)
    const encodedValue = padHexStart(value.toString(16))
    const txBytecode = functionSignature + encodedAddress + encodedValue
    return this.getMethod('sendTransaction')(this._contractAddress, 0, txBytecode)
  }

  erc20Balance (address) {
  }
}
