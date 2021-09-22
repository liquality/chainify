import { NodeProvider } from '@liquality/node-provider'
import { BigNumber, Address } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { BitcoinEsploraApiProvider, EsploraApiProviderOptions, esplora } from '@liquality/bitcoin-esplora-api-provider'
import { flatten, uniq } from 'lodash'

type BatchUTXOs = { address: string; utxo: esplora.UTXO[] }[]

interface EsploraBatchApiProviderOptions extends EsploraApiProviderOptions {
  batchUrl: string
}

export default class BitcoinEsploraBatchApiProvider extends BitcoinEsploraApiProvider {
  _batchAxios: NodeProvider

  constructor(options: EsploraBatchApiProviderOptions) {
    super(options)

    this._batchAxios = new NodeProvider({
      baseURL: options.batchUrl,
      responseType: 'text',
      transformResponse: undefined // https://github.com/axios/axios/issues/907,
    })
  }

  async getUnspentTransactions(_addresses: (Address | string)[]) {
    const addresses = _addresses.map(addressToString)
    const data: BatchUTXOs = await this._batchAxios.nodePost('/addresses/utxo', {
      addresses: uniq(addresses)
    })

    const utxos = data.map(({ address, utxo }) => {
      return utxo.map((obj) => ({
        ...obj,
        address,
        satoshis: obj.value,
        amount: new BigNumber(obj.value).dividedBy(1e8).toNumber(),
        blockHeight: obj.status.block_height
      }))
    })

    return flatten(utxos)
  }

  async getAddressTransactionCounts(_addresses: (Address | string)[]) {
    const addresses = _addresses.map(addressToString)
    const data: esplora.Address[] = await this._batchAxios.nodePost('/addresses', {
      addresses: uniq(addresses)
    })

    return data.reduce((acc: { [index: string]: number }, obj) => {
      acc[obj.address] = obj.chain_stats.tx_count + obj.mempool_stats.tx_count
      return acc
    }, {})
  }
}
