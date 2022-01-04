import { Provider } from '@liquality/provider'
import { FeeProvider, FeeDetails, BigNumber } from '@liquality/types'
import { toGwei } from '@liquality/ethereum-utils'
import { JsonRpcProvider } from '@ethersproject/providers'
import { suggestFees } from '@rainbow-me/fee-suggestions'

export default class EthereumEIP1559FeeProvider extends Provider implements FeeProvider {
  _jsonRpcProvider: JsonRpcProvider

  constructor(options: { uri: string }) {
    super()
    this._jsonRpcProvider = new JsonRpcProvider(options.uri)
  }

  getBaseFeeMultiplier(baseFeeTrend: number) {
    switch (baseFeeTrend) {
      case 2:
        return 1.6
      case 1:
        return 1.4
      case 0:
        return 1.2
      default:
        return 1.1
    }
  }

  calculateMaxFeePerGas(maxPriorityFeePerGas: BigNumber, potentialMaxFee: BigNumber) {
    return maxPriorityFeePerGas.gt(potentialMaxFee) ? potentialMaxFee.plus(maxPriorityFeePerGas) : potentialMaxFee
  }

  async getFees(): Promise<FeeDetails> {
    const {
      maxPriorityFeeSuggestions,
      baseFeeSuggestion,
      currentBaseFee,
      baseFeeTrend,
      confirmationTimeByPriorityFee
    } = await suggestFees(this._jsonRpcProvider)

    const bigCurrentBaseFee = toGwei(currentBaseFee)
    const bigBaseFeeSuggestion = toGwei(baseFeeSuggestion)
    const slowMaxPriorityFeePerGas = toGwei(confirmationTimeByPriorityFee[45])
    const averageMaxPriorityFeePerGas = toGwei(confirmationTimeByPriorityFee[30])
    const fastMaxPriorityFeePerGas = toGwei(
      baseFeeTrend === 2 ? maxPriorityFeeSuggestions.urgent : confirmationTimeByPriorityFee[15]
    )

    const multiplier = this.getBaseFeeMultiplier(baseFeeTrend)
    const potentialMaxFee = bigBaseFeeSuggestion.times(multiplier)

    const extra = {
      currentBaseFeePerGas: bigCurrentBaseFee.toNumber(),
      suggestedBaseFeePerGas: bigBaseFeeSuggestion.toNumber(),
      baseFeeTrend
    }

    const fees = {
      slow: {
        fee: {
          ...extra,
          maxFeePerGas: this.calculateMaxFeePerGas(slowMaxPriorityFeePerGas, potentialMaxFee).toNumber(),
          maxPriorityFeePerGas: slowMaxPriorityFeePerGas.toNumber()
        }
      },
      average: {
        fee: {
          ...extra,
          maxFeePerGas: this.calculateMaxFeePerGas(averageMaxPriorityFeePerGas, potentialMaxFee).toNumber(),
          maxPriorityFeePerGas: averageMaxPriorityFeePerGas.toNumber()
        }
      },
      fast: {
        fee: {
          ...extra,
          maxFeePerGas: this.calculateMaxFeePerGas(fastMaxPriorityFeePerGas, potentialMaxFee).toNumber(),
          maxPriorityFeePerGas: fastMaxPriorityFeePerGas.toNumber()
        }
      }
    }

    return fees
  }
}
