import { JsonRpcProvider } from '@liquality/jsonrpc-provider'
import { FeeProvider, FeeDetails, BigNumber, FeeHistory } from '@liquality/types'
import { GWEI, gwei, hexToNumber, numberToHex } from '@liquality/ethereum-utils'

type FeeOptions = {
  slowMultiplier?: number
  averageMultiplier?: number
  fastMultiplier?: number
  maxFeePerGasThreshold?: number
}

interface FeeEstimationResult {
  maxFeePerGas: BigNumber
  maxPriorityFeePerGas: BigNumber
  baseFeePerGas?: BigNumber
}

const MAX_GAS_FAST = gwei(1500)
// How many blocks to consider for priority fee estimation
const FEE_HISTORY_BLOCKS = 10
// Which percentile of effective priority fees to include
const FEE_HISTORY_PERCENTILE = 5
// Which base fee to trigger priority fee estimation at
const PRIORITY_FEE_ESTIMATION_TRIGGER = gwei(100)
// Returned if above trigger is not met
const DEFAULT_PRIORITY_FEE = gwei(3)
// In case something goes wrong fall back to this estimate
export const FALLBACK_ESTIMATE: FeeEstimationResult = {
  maxFeePerGas: gwei(20),
  maxPriorityFeePerGas: DEFAULT_PRIORITY_FEE,
  baseFeePerGas: undefined
}
const PRIORITY_FEE_INCREASE_BOUNDARY = 200 // %

export default class EthereumEIP1559FeeProvider extends JsonRpcProvider implements FeeProvider {
  _slowMultiplier: number
  _averageMultiplier: number
  _fastMultiplier: number
  _maxFeePerGasThreshold: number

  constructor(options: { uri: string; username?: string; password?: string }, opts: FeeOptions = {}) {
    super(options.uri, options.username, options.password)

    const { slowMultiplier = 1, averageMultiplier = 1.25, fastMultiplier = 1.4, maxFeePerGasThreshold = 1000 } = opts
    this._slowMultiplier = slowMultiplier
    this._averageMultiplier = averageMultiplier
    this._fastMultiplier = fastMultiplier
    this._maxFeePerGasThreshold = maxFeePerGasThreshold
  }

  getBaseFeeMultiplier(baseFeePerGas: BigNumber) {
    if (baseFeePerGas.lte(gwei(40))) {
      return 200
    } else if (baseFeePerGas.lte(gwei(100))) {
      return 160
    } else if (baseFeePerGas.lte(gwei(200))) {
      return 140
    } else {
      return 120
    }
  }

  calculatePriorityFeeEstimate(feeHistory?: FeeHistory) {
    if (!feeHistory) {
      return null
    }

    const rewards = feeHistory.reward
      ?.map((r: string[]) => hexToNumber(r[0]))
      .filter((r: number) => r > 0)
      .sort()

    if (!rewards) {
      return null
    }

    // Calculate percentage increases from between ordered list of fees
    const percentageIncreases = rewards.reduce<number[]>((acc: number[], cur: number, i: number, arr: number[]) => {
      if (i === arr.length - 1) {
        return acc
      }
      const next = arr[i + 1]
      const p = ((next - cur) / cur) * 100
      return [...acc, p]
    }, [])
    const highestIncrease = Math.max(...percentageIncreases)
    const highestIncreaseIndex = percentageIncreases.findIndex((p: number) => p === highestIncrease)

    // If we have big increase in value, we could be considering "outliers" in our estimate
    // Skip the low elements and take a new median
    const values =
      highestIncrease >= PRIORITY_FEE_INCREASE_BOUNDARY && highestIncreaseIndex >= Math.floor(rewards.length / 2)
        ? rewards.slice(highestIncreaseIndex)
        : rewards

    return values[Math.floor(values.length / 2)]
  }

  calculateFees(baseFeePerGas: BigNumber, feeHistory?: FeeHistory): FeeEstimationResult {
    try {
      const estimatedPriorityFee = this.calculatePriorityFeeEstimate(feeHistory)
      const maxPriorityFeePerGas = BigNumber.max(estimatedPriorityFee ?? 0, DEFAULT_PRIORITY_FEE)
      const multiplier = this.getBaseFeeMultiplier(baseFeePerGas)

      const potentialMaxFee = baseFeePerGas.times(multiplier).div(100)
      const maxFeePerGas = maxPriorityFeePerGas.gt(potentialMaxFee)
        ? potentialMaxFee.plus(maxPriorityFeePerGas)
        : potentialMaxFee

      if (maxFeePerGas.gte(MAX_GAS_FAST) || maxPriorityFeePerGas.gte(MAX_GAS_FAST)) {
        throw new Error('Estimated gas fee was much higher than expected, erroring')
      }

      return {
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        baseFeePerGas
      }
    } catch (err) {
      console.error(err)
      return FALLBACK_ESTIMATE
    }
  }

  async estimateFees(): Promise<FeeEstimationResult> {
    try {
      const latestBlock = await this.jsonrpc('eth_getBlockByNumber', 'latest', false)

      if (!latestBlock.baseFeePerGas) {
        throw new Error('An error occurred while fetching current base fee, falling back')
      }

      const baseFeePerGas = new BigNumber(hexToNumber(latestBlock.baseFeePerGas))
      const blockNumber = latestBlock.number

      const feeHistory =
        baseFeePerGas >= PRIORITY_FEE_ESTIMATION_TRIGGER
          ? await this.getMethod('getFeeHistory')(numberToHex(FEE_HISTORY_BLOCKS), blockNumber, [
              FEE_HISTORY_PERCENTILE
            ])
          : undefined

      return this.calculateFees(baseFeePerGas, feeHistory)
    } catch (err) {
      return FALLBACK_ESTIMATE
    }
  }

  async getFees(): Promise<FeeDetails> {
    const { maxPriorityFeePerGas, maxFeePerGas, baseFeePerGas } = await this.estimateFees()
    const gmaxPriorityFeePerGas = new BigNumber(maxPriorityFeePerGas.toString()).div(GWEI)
    const gmaxFeePerGas = new BigNumber(maxFeePerGas.toString()).div(GWEI)

    if (gmaxFeePerGas.gte(this._maxFeePerGasThreshold)) {
      throw new Error(`maxFeePerGas over ${this._maxFeePerGasThreshold} Gwei detected.`)
    }

    const extra = baseFeePerGas ? { baseFeePerGas: baseFeePerGas.dp(0).toNumber() } : {}

    const fees = {
      slow: {
        fee: {
          ...extra,
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._slowMultiplier).dp(0).toNumber()
        }
      },
      average: {
        fee: {
          ...extra,
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._averageMultiplier).dp(0).toNumber()
        }
      },
      fast: {
        fee: {
          ...extra,
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._fastMultiplier).dp(0).toNumber()
        }
      }
    }

    return fees
  }
}
