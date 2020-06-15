
import Provider from '@liquality/provider'
import BigNumber from 'bignumber.js'
import axios from 'axios'

import { version } from '../package.json'

export default class EthereumGasStationFeeProvider extends Provider {
  constructor (endpoint = 'https://ethgasstation.info/api/ethgasAPI.json') {
    super()
    this._endpoint = endpoint
  }

  async getFees () {
    const result = await axios.get(this._endpoint)
    const data = result.data

    return {
      slow: {
        fee: BigNumber(data.safeLow).div(10).toNumber(),
        wait: data.safeLowWait * 60
      },
      average: {
        fee: BigNumber(data.average).div(10).toNumber(),
        wait: data.avgWait * 60
      },
      fast: {
        fee: BigNumber(data.fast).div(10).toNumber(),
        wait: data.fastWait * 60
      }
    }
  }
}

EthereumGasStationFeeProvider.version = version
