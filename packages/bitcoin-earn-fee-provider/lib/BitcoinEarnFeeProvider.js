import NodeProvider from '@liquality/node-provider'

import { version } from '../package.json'

export default class BitcoinEarnFeeProvider extends NodeProvider {
  constructor (endpoint = 'https://bitcoinfees.earn.com/api/v1/fees/recommended') {
    super({
      baseURL: endpoint
    })
  }

  async getFees () {
    const data = await this.nodeGet('')

    return {
      slow: {
        fee: data.hourFee,
        wait: 60 * 60
      },
      average: {
        fee: data.halfHourFee,
        wait: 30 * 60
      },
      fast: {
        fee: data.fastestFee,
        wait: 10 * 60
      }
    }
  }
}

BitcoinEarnFeeProvider.version = version
