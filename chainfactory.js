const request = require("request")
const crypto = require("crypto")
const DSNParser = require("dsn-parser")

class JsonRPC {
  constructor (opts) {
    this.configure(opts)
  }

  configure (opts) {
    this.protocol = (opts.params.secure)? "https": "http";
    this.host = this.protocol + "://" + opts.host + ":" + opts.port
    this.username = opts.user || false
    this.password = opts.password || false
    this.auth = Buffer.from(this.username + ":" + this.password).toString('base64')
  }


  _call (method, params = []) {
      if (!Array.isArray(params)) {
        var newarr = []
        newarr.push(params)
        params = newarr
      }
      return new Promise(( resolve, reject ) => {
        request({
          uri: this.host,
          method:'POST',
          json: true,
          headers: {
            'Authorization': 'Basic ' + this.auth
          },
          body: {
            "id": crypto.randomBytes(32).toString('hex'),
            "jsonrpc": "2.0",
            "method": method,
            "params": params 
          }
        }, (e, res, data) => {
          if (e) {
            reject(e) 
          } else {
            resolve(data.result) 
          }
        })
      })
  }
}


class Bitcoin extends JsonRPC {
  getInfo() {
    return this._call('getinfo', [])
  }

  getBalance(params) {
    return this._call('getbalance', params)
  }

  getBlockchainInfo(params) {
    return this._call('getblockchaininfo', params)
  }

  getAddressUtxos(params) {
    return this._call('getaddressutxos', params)
  }

  sendRawTransaction(params) {
    return this._call('sendrawtransaction', params)
  }

  getAddressBalance(params) {
    return this._call('getaddressbalance', params)
  }

  sendToAddress(address, amount) {
    return this._call('sendtoaddress', [address, amount])
  }

  generate(params) {
    return this._call('generate', params)
  }

}

class  Litecoin extends Bitcoin {
}

class Ethereum extends JsonRPC {
  getNetVersion() {
    return this._call('net_version', [])
  }

  getBlockchainInfo(params) {
    return this._call('web3_clientVersion', params)
  }

  getBalance(params) {
    return this._call('eth_getBalance', params)
  }

  getAddressBalance(params) {
    return this._call('eth_getBalance', params)
  }
}


var ChainFactory = (uri) => {
  var dsn = new DSNParser(uri)
  var opts = dsn.getParts()
  switch (opts.driver) {
    case "bitcoin":
      return new Bitcoin(opts);
      break;
    case "litecoin":
      return new Litecoin(opts);
      break;
    case "ethereum":
      return new Ethereum(opts);
      break;
  }
}

module.exports = ChainFactory
