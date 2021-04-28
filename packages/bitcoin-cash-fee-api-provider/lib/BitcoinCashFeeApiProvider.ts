import NodeProvider from '@liquality/node-provider'
import { FeeProvider, FeeDetails } from '@liquality/types'

export default class BitcoinCashFeeApiProvider extends NodeProvider implements FeeProvider {
  constructor(endpoint = '') {
    super({
      baseURL: endpoint
    })
  }

  async getFees(): Promise<FeeDetails> {
    return {
      slow: {
        fee: 1,
        wait: 60 * 60
      },
      average: {
        fee: 1,
        wait: 30 * 60
      },
      fast: {
        fee: 2,
        wait: 10 * 60
      }
    }
  }
}
