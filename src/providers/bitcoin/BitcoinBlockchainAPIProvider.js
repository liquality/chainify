import { forIn } from 'lodash'

import ApiProvider from '../ApiProvider'
import networks from '../../networks'

export default class BitcoinBlockchainAPIProvider extends ApiProvider {
  constructor (chain = { network: networks.bitcoin }) {
    super(chain.network.explorerUrl)
  }

  async isAddressUsed (address) {
    address = String(address)
    let txCount = 0

    const obj = (await this.apiGet('/balance', { active: address, cors: true }))[address]

    if (obj) txCount = obj.n_tx

    return txCount !== 0
  }

  async getBalance (addresses) {
    addresses = addresses
      .map(address => String(address))
      .join('|')

    let balance = 0
    const obj = (await this.apiGet('/balance', { active: addresses, cors: true }))

    forIn(obj, (value, key) => {
      balance += value.final_balance
    })

    return balance
  }

  async getUnspentTransactions (address) {
    return (await this.apiGet('/unspent', { active: address, cors: true })).unspent_outputs || []
  }

  async getTransactionHex (transactionHash) {
    return this.apiGet(`/rawtx/${transactionHash}`, { format: 'hex', cors: true })
  }
}
