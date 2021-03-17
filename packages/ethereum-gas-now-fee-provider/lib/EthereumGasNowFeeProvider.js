import NodeProvider from '@liquality/node-provider'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

const GWEI = 1e9

export default class EthereumGasNowFeeProvider extends NodeProvider {
  constructor (endpoint = 'https://www.gasnow.org/api/v3/gas/price') {
    super({
      baseURL: endpoint
    })
  }

  async getFees () {
    const result = await this.nodeGet('')
    const data = result.data

    const fees = {
      slow: {
        fee: BigNumber(data.slow).div(GWEI).toNumber()
      },
      average: {
        fee: BigNumber(data.standard).div(GWEI).toNumber()
      },
      fast: {
        fee: BigNumber(data.fast).div(GWEI).toNumber()
      }
    }

    if (Object.entries(fees).find(([, fee]) => fee.fee > 1000)) { // Guard against fees higher than 1000 GWEI
      throw new Error('Fee over 1000 Gwei detected.')
    }

    return fees
  }
}

EthereumGasNowFeeProvider.version = version
