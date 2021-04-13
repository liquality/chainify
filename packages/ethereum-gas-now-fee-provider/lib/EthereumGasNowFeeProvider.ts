import NodeProvider from '@liquality/node-provider'
import { FeeProvider, FeeDetails, BigNumber } from '@liquality/types'

const GWEI = 1e9

export default class EthereumGasNowFeeProvider extends NodeProvider implements FeeProvider {
  constructor(endpoint = 'https://www.gasnow.org/api/v3/gas/price') {
    super({
      baseURL: endpoint
    })
  }

  async getFees(): Promise<FeeDetails> {
    const result = await this.nodeGet('')
    const data = result.data

    const fees = {
      slow: {
        fee: new BigNumber(data.slow).div(GWEI).dp(0).toNumber()
      },
      average: {
        fee: new BigNumber(data.standard).div(GWEI).dp(0).toNumber()
      },
      fast: {
        fee: new BigNumber(data.fast).div(GWEI).dp(0).toNumber()
      }
    }

    if (Object.entries(fees).find(([, fee]) => fee.fee > 1000)) {
      // Guard against fees higher than 1000 GWEI
      throw new Error('Fee over 1000 Gwei detected.')
    }

    return fees
  }
}
