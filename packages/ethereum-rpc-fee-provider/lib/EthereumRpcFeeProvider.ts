import { Provider } from '@liquality/provider'
import { FeeProvider } from '@liquality/types'

import BigNumber from 'bignumber.js'

type FeeOptions = {
  slowMultiplier?: number
  averageMultiplier?: number
  fastMultiplier?: number
}

export default class EthereumRpcFeeProvider extends Provider implements FeeProvider {
  _slowMultiplier: number
  _averageMultiplier: number
  _fastMultiplier: number

  constructor(opts: FeeOptions = {}) {
    super()
    const { slowMultiplier = 1, averageMultiplier = 1.5, fastMultiplier = 2 } = opts
    this._slowMultiplier = slowMultiplier
    this._averageMultiplier = averageMultiplier
    this._fastMultiplier = fastMultiplier
  }

  calculateFee(base: number, multiplier: number) {
    return new BigNumber(base).times(new BigNumber(multiplier)).toNumber()
  }

  async getFees() {
    const baseGasPrice = await this.getMethod('getGasPrice')()
    return {
      slow: {
        fee: this.calculateFee(baseGasPrice, this._slowMultiplier)
      },
      average: {
        fee: this.calculateFee(baseGasPrice, this._averageMultiplier)
      },
      fast: {
        fee: this.calculateFee(baseGasPrice, this._fastMultiplier)
      }
    }
  }
}
