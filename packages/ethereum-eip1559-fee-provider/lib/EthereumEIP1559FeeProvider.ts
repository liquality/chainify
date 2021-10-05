import { Provider } from '@liquality/provider'
import { estimateFees } from '@mycrypto/gas-estimation'
import { FeeProvider, FeeDetails, BigNumber } from '@liquality/types'

type FeeOptions = {
  slowMultiplier?: number
  averageMultiplier?: number
  fastMultiplier?: number
}

const GWEI = 1e9

export default class EthereumEIP1559FeeProvider extends Provider implements FeeProvider {
  _uri: string
  _slowMultiplier: number
  _averageMultiplier: number
  _fastMultiplier: number

  constructor(uri: string, opts: FeeOptions = {}) {
    super()

    this._uri = uri

    const { slowMultiplier = 1, averageMultiplier = 1.25, fastMultiplier = 1.4 } = opts
    this._slowMultiplier = slowMultiplier
    this._averageMultiplier = averageMultiplier
    this._fastMultiplier = fastMultiplier
  }

  async getFees(): Promise<FeeDetails> {
    const { maxPriorityFeePerGas, maxFeePerGas } = await estimateFees(this._uri)
    const gmaxPriorityFeePerGas = new BigNumber(maxPriorityFeePerGas.toString()).div(GWEI)
    const gmaxFeePerGas = new BigNumber(maxFeePerGas.toString()).div(GWEI)

    if (gmaxFeePerGas.gte(1000)) {
      throw new Error('maxFeePerGas over 1000 Gwei detected.')
    }

    const fees = {
      slow: {
        fee: {
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._slowMultiplier).dp(0).toNumber()
        }
      },
      average: {
        fee: {
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._averageMultiplier).dp(0).toNumber()
        }
      },
      fast: {
        fee: {
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._fastMultiplier).dp(0).toNumber()
        }
      }
    }

    return fees
  }
}
