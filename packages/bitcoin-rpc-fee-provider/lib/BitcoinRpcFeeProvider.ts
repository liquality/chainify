import { Provider } from '@liquality/provider'
import { FeeProvider, FeeDetail } from '@liquality/types'

type FeeOptions = {
  slowTargetBlocks?: number
  averageTargetBlocks?: number
  fastTargetBlocks?: number
}

export default class BitcoinRpcFeeProvider extends Provider implements FeeProvider {
  _slowTargetBlocks: number
  _averageTargetBlocks: number
  _fastTargetBlocks: number

  constructor(opts: FeeOptions = {}) {
    super()
    const { slowTargetBlocks = 6, averageTargetBlocks = 3, fastTargetBlocks = 1 } = opts
    this._slowTargetBlocks = slowTargetBlocks
    this._averageTargetBlocks = averageTargetBlocks
    this._fastTargetBlocks = fastTargetBlocks
  }

  getWaitTime(numBlocks: number) {
    return numBlocks * 10 // Minutes per block* 60 // Seconds per minute
  }

  async getFee(targetBlocks: number): Promise<FeeDetail> {
    const value = await this.getMethod('getFeePerByte')(targetBlocks)
    const wait = targetBlocks * 10 * 60 // 10 minute blocks in seconds

    return { fee: value, wait }
  }

  async getFees() {
    const [slow, average, fast] = await Promise.all([
      this.getFee(this._slowTargetBlocks),
      this.getFee(this._averageTargetBlocks),
      this.getFee(this._fastTargetBlocks)
    ])

    return {
      slow,
      average,
      fast
    }
  }
}
