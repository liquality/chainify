import { NodeProvider } from '@liquality/node-provider'
import { FeeProvider, FeeDetails, BigNumber } from '@liquality/types'

export default class EthereumGasOracleProvider extends NodeProvider implements FeeProvider {
  constructor({ baseURL = 'https://api.etherscan.io', apikey = '' } = {}) {
    super({ baseURL, params: { apikey } })
  }

  async getFees(): Promise<FeeDetails> {
    const response = await this.nodeGet('/api', { module: 'gastracker', action: 'gasoracle' })
    const { result } = response.data

    const fees = {
      slow: {
        fee: new BigNumber(result.SafeGasPrice).toNumber()
      },
      average: {
        fee: new BigNumber(result.ProposeGasPrice).toNumber()
      },
      fast: {
        fee: new BigNumber(result.FastGasPrice).toNumber()
      }
    }

    if (Object.entries(fees).find(([, fee]) => fee.fee > 1000)) {
      // Guard against fees higher than 1000 GWEI
      throw new Error('Fee over 1000 Gwei detected.')
    }

    return fees
  }
}
