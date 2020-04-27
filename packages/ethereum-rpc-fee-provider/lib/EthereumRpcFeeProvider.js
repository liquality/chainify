
import Provider from '@liquality/provider'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

export default class EthereumRpcFeeProvider extends Provider {
  constructor (slowMultiplier = 1, averageMultiplier = 1.5, fastMultiplier = 2) {
    super()
    this._slowMultiplier = slowMultiplier
    this._averageMultiplier = averageMultiplier
    this._fastMultiplier = fastMultiplier
  }

  calculateFee (base, multiplier) {
    return parseInt(BigNumber(base).times(BigNumber(multiplier)).toFixed(0))
  }

  async getFees () {
    const baseGasPrice = await this.getMethod('getGasPrice')()
    return {
      slow: this.calculateFee(baseGasPrice, this._slowMultiplier),
      average: this.calculateFee(baseGasPrice, this._averageMultiplier),
      fast: this.calculateFee(baseGasPrice, this._fastMultiplier)
    }
  }
}

EthereumRpcFeeProvider.version = version
