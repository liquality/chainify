import { NodeProvider } from '@liquality/node-provider'
import { FeeProvider, FeeDetails } from '@liquality/types'

export default class BitcoinFeeApiProvider extends NodeProvider implements FeeProvider {
  constructor(endpoint = 'https://mempool.space/api/v1/fees/recommended') {
    super({
      baseURL: endpoint
    })
  }

  async getFees(): Promise<FeeDetails> {
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
