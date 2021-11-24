import { JsonRpcProvider } from '@liquality/jsonrpc-provider'
import { FeeProvider, FeeDetails, BigNumber, FeeHistory } from '@liquality/types'
import { GWEI, gwei, hexToNumber, numberToHex } from '@liquality/ethereum-utils'

type FeeOptions = {
  slowMultiplier?: number
  averageMultiplier?: number
  fastMultiplier?: number
}

interface FeeEstimationResult {
  maxFeePerGas: BigNumber
  maxPriorityFeePerGas: BigNumber
  baseFee: BigNumber | undefined
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
  baseFee: undefined
}
const PRIORITY_FEE_INCREASE_BOUNDARY = 200 // %

export default class EthereumEIP1559FeeProvider extends JsonRpcProvider implements FeeProvider {
  _slowMultiplier: number
  _averageMultiplier: number
  _fastMultiplier: number

  constructor(options: { uri: string; username?: string; password?: string }, opts: FeeOptions = {}) {
    super(options.uri, options.username, options.password)

    const { slowMultiplier = 1, averageMultiplier = 1.25, fastMultiplier = 1.4 } = opts
    this._slowMultiplier = slowMultiplier
    this._averageMultiplier = averageMultiplier
    this._fastMultiplier = fastMultiplier
  }

  getBaseFeeMultiplier(baseFee: BigNumber) {
    if (baseFee.lte(gwei(40))) {
      return 200
    } else if (baseFee.lte(gwei(100))) {
      return 160
    } else if (baseFee.lte(gwei(200))) {
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

  calculateFees(baseFee: BigNumber, feeHistory?: FeeHistory): FeeEstimationResult {
    try {
      const estimatedPriorityFee = this.calculatePriorityFeeEstimate(feeHistory)
      const maxPriorityFeePerGas = BigNumber.max(estimatedPriorityFee ?? 0, DEFAULT_PRIORITY_FEE)
      const multiplier = this.getBaseFeeMultiplier(baseFee)
      const potentialMaxFee = baseFee.times(multiplier).div(100)
      const maxFeePerGas = maxPriorityFeePerGas.gt(potentialMaxFee)
        ? potentialMaxFee.plus(maxPriorityFeePerGas)
        : potentialMaxFee

      if (maxFeePerGas.gte(MAX_GAS_FAST) || maxPriorityFeePerGas.gte(MAX_GAS_FAST)) {
        throw new Error('Estimated gas fee was much higher than expected, erroring')
      }

      return {
        maxFeePerGas: maxFeePerGas,
        maxPriorityFeePerGas: maxPriorityFeePerGas,
        baseFee
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
      const baseFee = new BigNumber(hexToNumber(latestBlock.baseFeePerGas))
      const blockNumber = latestBlock.number

      const feeHistory =
        baseFee >= PRIORITY_FEE_ESTIMATION_TRIGGER
          ? await this.getMethod('getFeeHistory')(numberToHex(FEE_HISTORY_BLOCKS), blockNumber, [
              FEE_HISTORY_PERCENTILE
            ])
          : undefined

      return this.calculateFees(baseFee, feeHistory)
    } catch (err) {
      console.log('error', err)
      return FALLBACK_ESTIMATE
    }
  }

  async getFees(): Promise<FeeDetails> {
    const { maxPriorityFeePerGas, maxFeePerGas, baseFee } = await this.estimateFees()
    const gmaxBaseFee = new BigNumber(baseFee.toString()).div(GWEI)
    const gmaxPriorityFeePerGas = new BigNumber(maxPriorityFeePerGas.toString()).div(GWEI)
    const gmaxFeePerGas = new BigNumber(maxFeePerGas.toString()).div(GWEI)

    if (gmaxFeePerGas.gte(1000)) {
      throw new Error('maxFeePerGas over 1000 Gwei detected.')
    }

    const fees = {
      slow: {
        fee: {
          baseFee: gmaxBaseFee.dp(0).toNumber(),
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._slowMultiplier).dp(0).toNumber()
        }
      },
      average: {
        fee: {
          baseFee: gmaxBaseFee.dp(0).toNumber(),
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._averageMultiplier).dp(0).toNumber()
        }
      },
      fast: {
        fee: {
          baseFee: gmaxBaseFee.dp(0).toNumber(),
          maxFeePerGas: gmaxFeePerGas.dp(0).toNumber(),
          maxPriorityFeePerGas: gmaxPriorityFeePerGas.times(this._fastMultiplier).dp(0).toNumber()
        }
      }
    }

    return fees
  }
}
