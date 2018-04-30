const JsonRPC = require('../jsonrpc')

class Bitcoin extends JsonRPC {
  getInfo () {
    return this._call('getinfo')
  }

  getBalance (params) {
    return this._call('getbalance', params)
  }

  getBlockchainInfo (params) {
    return this._call('getblockchaininfo', params)
  }

  getAddressUtxos (params) {
    return this._call('getaddressutxos', params)
  }

  sendRawTransaction (params) {
    return this._call('sendrawtransaction', params)
  }

  getAddressBalance (params) {
    return this._call('getaddressbalance', params)
  }

  getTransaction (params) {
    return this._call('decoderawtransaction', params)
  }

  sendToAddress (address, amount) {
    return this._call('sendtoaddress', [address, amount])
  }

  generateBlock (params) {
    return this._call('generate', params)
  }
}

module.exports = Bitcoin
