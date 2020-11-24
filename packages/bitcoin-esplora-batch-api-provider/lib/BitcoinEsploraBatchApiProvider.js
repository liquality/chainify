import NodeProvider from '@liquality/node-provider'
import BitcoinEsploraApiProvider from '@liquality/bitcoin-esplora-api-provider'
import { addressToString } from '@liquality/utils'
import { flatten, uniq } from 'lodash'
import BigNumber from 'bignumber.js'

import { version } from '../package.json'

export default class BitcoinEsploraBatchApiProvider extends BitcoinEsploraApiProvider {
  constructor (batchUrl, url, network, numberOfBlockConfirmation = 1, defaultFeePerByte = 3) {
    super(url, network, numberOfBlockConfirmation, defaultFeePerByte)

    this._batchAxios = new NodeProvider({
      baseURL: batchUrl,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  async getUnspentTransactions (addresses) {
    const data = await this._batchAxios.nodePost('/addresses/utxo', {
      addresses: uniq(addresses.map(addressToString))
    })

    const utxos = data.map(({ address, utxo }) => {
      return utxo.map(obj => ({
        ...obj,
        address,
        satoshis: obj.value,
        amount: BigNumber(obj.value).dividedBy(1e8).toNumber(),
        blockHeight: obj.status.block_height
      }))
    })

    return flatten(utxos)
  }

  async getAddressTransactionCounts (addresses) {
    const data = await this._batchAxios.nodePost('/addresses', {
      addresses: uniq(addresses.map(addressToString))
    })

    return data.reduce((acc, obj) => {
      acc[obj.address] = obj.chain_stats.tx_count + obj.mempool_stats.tx_count
      return acc
    }, {})
  }
}

BitcoinEsploraBatchApiProvider.version = version
