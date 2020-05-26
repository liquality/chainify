
import Provider from '@liquality/provider'
import _ from 'lodash'

import { version } from '../package.json'

export default class BitcoinRpcFeeProvider extends Provider {
  constructor (slowTargetBlocks = 6, averageTargetBlocks = 3, fastTargetBlocks = 1) {
    super()
    this._slowTargetBlocks = slowTargetBlocks
    this._averageTargetBlocks = averageTargetBlocks
    this._fastTargetBlocks = fastTargetBlocks
  }

  getWaitTime (numBlocks) {
    return numBlocks * 10 // Minutes per block* 60 // Seconds per minute
  }

  async getFee (targetBlocks) {
    const value = await this.getMethod('getFeePerByte')(targetBlocks)
    const wait = targetBlocks * 10 * 60 // 10 minute blocks in seconds

    return { fee: value, wait }
  }

  async getFees () {
    return _.zipObject(['slow', 'average', 'fast'], await Promise.all([
      this.getFee(this._slowTargetBlocks),
      this.getFee(this._averageTargetBlocks),
      this.getFee(this._fastTargetBlocks)
    ]))
  }
}

BitcoinRpcFeeProvider.version = version
