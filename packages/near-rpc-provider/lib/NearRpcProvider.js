import JsonRpcProvider from '@liquality/jsonrpc-provider'

import {version} from '../package.json'

export default class NearRpcProvider extends JsonRpcProvider {
  constructor(uri) {
    super(uri, username, password)
    this._usedAddressCache = {}
  }

  async rpc(method, ...params) {}

  async sendRawTransaction(hash) {}

  async getBlockByHash(blockHash, includeTx) {}

  async getBlockByNumber(blockNumber, includeTx) {}

  async getBlockHeight() {}

  async getTransactionByHash(txHash) {}

  async getTransactionReceipt(txHash) {}

  async getGasPrice() {}

  async getBalance(addresses) {}

  async estimateGas(transaction) {}

  async isAddressUsed(address) {}

  async assertContractExists(address) {}
}

EthereumRpcProvider.version = version
