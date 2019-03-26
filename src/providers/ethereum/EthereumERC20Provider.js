import Provider from '../../Provider'

export default class EthereumERC20Provider extends Provider {
  constructor (contractAddress) {
    super()
    this._contractAddress = contractAddress
  }

  erc20Transfer (to, amount) {
  }

  erc20Balance (address) {
  }
}
