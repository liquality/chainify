import { get, isArray } from 'lodash'
import { BigNumber } from 'bignumber.js'

import JsonRpcProvider from '@liquality/jsonrpc-provider'

import { version } from '../package.json'

export default class NearRpcProvider extends JsonRpcProvider {
  constructor (uri) {
    super(uri)
    this._usedAddressCache = {}
  }

  async rpc (method, params) {
    const id = Date.now()
    const req = { id, method, params, jsonrpc: '2.0' }
    const data = await this.nodePost('', req)
    return this._parseResponse(data)
  }

  async sendRawTransaction (hash) {
    return this.rpc('broadcast_tx_commit', [hash])
  }

  async getBlockByHash (blockHash, includeTx) {}

  async getBlockByNumber (blockNumber, includeTx) {}

  async getBlockHeight () {
    const result = await this.rpc('block', { finality: 'final' })
    return get(result, 'header.height')
  }

  async getTransactionByHash (txHash) {}

  async getTransactionReceipt (txHash) {}

  async getGasPrice () {
    const result = await this.rpc('gas_price', [null])
    return get(result, 'gas_price')
  }

  async getBalance (addresses) {
    if (!isArray(addresses)) {
      addresses = [addresses]
    }

    const promiseBalances = await Promise.all(
      addresses.map((address) =>
        this.rpc('query', {
          request_type: 'view_account',
          finality: 'final',
          account_id: address
        })
      )
    )

    return promiseBalances
      .map((balance) => {
        const costPerByte = new BigNumber(1)
        const stateStaked = new BigNumber(balance.storage_usage).multipliedBy(
          costPerByte
        )
        const staked = new BigNumber(balance.locked)
        const totalBalance = new BigNumber(balance.amount).plus(staked)
        const availableBalance = totalBalance.minus(
          BigNumber.max(staked, stateStaked)
        )
        return new BigNumber(availableBalance)
      })
      .reduce((acc, balance) => acc.plus(balance), new BigNumber(0))
  }

  async isAddressUsed (address) {
    const activity = await this.getMethod('getAccountActivity')(address)
    return activity.length > 0
  }

  async assertContractExists (address) {}
}

NearRpcProvider.version = version
