
import Provider from '@liquality/provider'
import axios from 'axios'

import { version } from '../package.json'

export default class BitcoinEarnFeeProvider extends Provider {
  constructor (endpoint = 'https://bitcoinfees.earn.com/api/v1/fees/recommended') {
    super()
    this._endpoint = endpoint
  }

  async getFees () {
    const result = await axios.get(this._endpoint)
    const data = result.data

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
