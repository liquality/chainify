import ApiProvider from '../ApiProvider'
import networks from '../../networks'

export default class BitcoinLedgerProvider extends ApiProvider {
  constructor (chain = { network: networks.bitcoin }) {
    super(chain.network.explorerUrl)
  }

  async getAddressTransactionCount (address) {
    const obj = (await this.apiGet('/balance', { active: address, cors: true }))[address]

    if (obj) return obj.final_balance

    return 0
  }

  async getBalance (address) {
    const obj = (await this.apiGet('/balance', { active: address, cors: true }))[address]

    if (obj) return obj.final_balance

    return 0
  }

  async getAddressDetails (address) {
    return (await this.apiGet('/balance', { active: address, cors: true }))[address]
  }

  async getUnspentTransactions (address) {
    return (await this.apiGet('/unspent', { active: address, cors: true })).unspent_outputs || []
  }

  async getTransactionHex (transactionHash) {
    return this.apiGet(`/rawtx/${transactionHash}`, { format: 'hex', cors: true })
  }
}
