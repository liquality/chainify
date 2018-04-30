const JsonRPC = require('../jsonrpc')

class Ethereum extends JsonRPC {
  getNetVersion () {
    return this._call('net_version', [])
  }

  getBlockchainInfo (params) {
    return this._call('web3_clientVersion', params)
  }

  getBalance (params) {
    return this._call('eth_getBalance', params)
  }

  getAddressBalance (params) {
    return this._call('eth_getBalance', params)
  }
}

module.exports = Ethereum
