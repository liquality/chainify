
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

  async getFeePerByte (targetBlocks) {
    return this.getMethod('getFeePerByte')(targetBlocks)
  }

  async getFees () {
    return _.zipObject(['slow', 'average', 'fast'], await Promise.all([
      this.getFeePerByte(this._slowTargetBlocks),
      this.getFeePerByte(this._averageTargetBlocks),
      this.getFeePerByte(this._fastTargetBlocks)
    ]))
  }
}

BitcoinRpcFeeProvider.version = version
