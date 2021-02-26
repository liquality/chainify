import NodeProvider from '@liquality/node-provider'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

export default class EthereumGasStationFeeProvider extends NodeProvider {
  constructor (endpoint = 'https://ethgasstation.info/api/ethgasAPI.json') {
    super({
      baseURL: endpoint
    })
  }

  async getFees () {
    const data = await this.nodeGet('')

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
