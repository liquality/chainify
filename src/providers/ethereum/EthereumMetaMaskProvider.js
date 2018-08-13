import Provider from '../../Provider'

import { isFunction } from 'lodash'
import { formatEthResponse, ensureEthFormat } from './EthereumUtil'
import { BigNumber } from 'bignumber.js'

export default class EthereumMetaMaskProvider extends Provider {
  constructor (metamaskProvider) {
    super()
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

          const formattedResult = formatEthResponse(data.result)

          resolve(formattedResult)
        })
    })
  }

  async getAddresses () {
    return this._toMM('eth_accounts')
  }

  async signMessage (message, from) {
    const hex = Buffer.from(message).toString('hex')

    return this._toMM('personal_sign', `0x${hex}`, `0x${from}`)
  }

  async sendTransaction (from, to, value, data) {
    value = BigNumber(value).toString(16)

    const tx = {
      from, to, value, data
    }

    return this._toMM('eth_sendTransaction', tx)
  }

  async getBlockByNumber (blockNumber, includeTx) {
    return this._toMM('eth_getBlockByNumber', '0x' + blockNumber.toString(16), includeTx)
  }

  async getTransactionByHash (txHash) {
    txHash = ensureEthFormat(txHash)
    return this._toMM('eth_getTransactionByHash', txHash)
  }

  generateSwap (recipientAddress, refundAddress, secretHash, expiration) {
    const dataSizeBase = 112
    const redeemDestinationBase = 66
    const refundDestinationBase = 89
    const expirationHex = expiration.toString(16)
    const expirationEncoded = expirationHex.length % 2 ? '0' + expirationHex : expirationHex // Pad with 0
    const expirationSize = expirationEncoded.length / 2
    const redeemDestinationEncoded = (redeemDestinationBase + expirationSize).toString(16)
    const refundDestinationEncoded = (refundDestinationBase + expirationSize).toString(16)
    const expirationPushOpcode = (0x5f + expirationSize).toString(16)
    const dataSizeEncoded = (dataSizeBase + expirationSize).toString(16)
    const recipientAddressEncoded = recipientAddress.replace('0x', '') // Remove 0x if exists
    const refundAddressEncoded = refundAddress.replace('0x', '') // Remove 0x if exists
    const secretHashEncoded = secretHash.replace('0x', '') // Remove 0x if exists
    return `60${dataSizeEncoded}80600b6000396000f36020806000803760218160008060026048f17f\
${secretHashEncoded}602151141660${redeemDestinationEncoded}57\
${expirationPushOpcode}${expirationEncoded}421160${refundDestinationEncoded}\
57005b73${recipientAddressEncoded}ff5b73${refundAddressEncoded}ff`
  }
}
