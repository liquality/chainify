import NodeProvider from '@liquality/node-provider'
import BigNumber from 'bignumber.js'
import { FeeProvider } from '@liquality/types'

export default class EthereumGasStationFeeProvider extends NodeProvider implements FeeProvider {
  constructor (endpoint = 'https://ethgasstation.info/api/ethgasAPI.json') {
    super({
      baseURL: endpoint
    })
  }

  async getFees () {
    const data = await this.nodeGet('')

    return {
      slow: {
        fee: new BigNumber(data.safeLow).div(10).toNumber(),
        wait: data.safeLowWait * 60
      },
      average: {
        fee: new BigNumber(data.average).div(10).toNumber(),
        wait: data.avgWait * 60
      },
      fast: {
        fee: new BigNumber(data.fast).div(10).toNumber(),
        wait: data.fastWait * 60
      }
    }
  }
}
