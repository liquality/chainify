import _ from 'lodash'

export default class EthereumMetaMaskProvider {
  constructor (metamaskProvider) {
    if (!_.isFunction(metamaskProvider.sendAsync)) {
      throw new Error('Invalid MetaMask Provider')
    }

    this._metamaskProvider = metamaskProvider
  }

  _toMM (method, ...params) {
    return this
      ._metamaskProvider
      .sendAsync({
        method,
        params
      })
      .then(data => {
        if (!data) throw new Error('Something went wrong')

        const { error, result } = data

        if (error) throw new Error('Something went wrong')

        return result
      })
  }

  async getAddresses () {
    return this._toMM('eth_accounts')
  }

  async signMessage (message, from) {
    const hex = Buffer.from(message).toString('hex')

    return this._toMM('personal_sign', hex, from)
  }
}
