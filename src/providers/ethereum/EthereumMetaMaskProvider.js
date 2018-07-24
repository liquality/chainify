import { isFunction } from 'lodash'

export default class EthereumMetaMaskProvider {
  constructor (metamaskProvider) {
    if (!isFunction(metamaskProvider.sendAsync)) {
      throw new Error('Invalid MetaMask Provider')
    }

    this._metamaskProvider = metamaskProvider
  }

  _toMM (method, ...params) {
    return new Promise((resolve, reject) => {
      this
        ._metamaskProvider
        .sendAsync({ method, params }, (err, data) => {
          if (err) {
            reject(err)
            return
          }

          if (!data) {
            reject(new Error('Something went wrong'))
            return
          }

          if (!data.result) {
            reject(new Error('Something went wrong'))
            return
          }

          resolve(data.result)
        })
    })
  }

  async getAddresses () {
    return this._toMM('eth_accounts')
  }

  async signMessage (message, from) {
    const hex = Buffer.from(message).toString('hex')

    return this._toMM('personal_sign', `0x${hex}`, from)
  }

  async sendTransaction (from, to, value, data) { 
    const tx = {
      from, to, value, data,
    }

    return this._toMM('eth_sendTransaction', tx);
  }
}
