# Chain Abstraction Layer
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Query different blockchains with a single and simple interface.

## CSN - Chain Source Name

```
<chain>s?://<user>:<pass>@<host>:<port>
```

## Client

```javascript
const ChainAbstractionLayer = require('chainabstractionlayer')

const bitcoin = ChainAbstractionLayer('bitcoin+s://bitcoin:local321@btc.leep.it:443')
const litecoin = ChainAbstractionLayer('litecoin+s://litecoin:local321@ltc.leep.it:443')

bitcoin
  .getBlockchainInfo() // returns Promise
  .then(console.log)

const result = await litecoin.getBlockchainInfo()
console.log(result)
```

## Currently Supported Chains

* [Bitcoin](./chains/Bitcoin.js)
* [Litecoin](./chains/Litecoin.js)
* [Ethereum](./chains/Ethereum.js)


## Development

### 1. Clone the project and link it locally

```bash
git clone git@github.com:ConsenSys/chainabstractionlayer.git
cd chainabstractionlayer
npm link
```

### 2. Use it in other projects

```bash
cd myblockchainproject
npm link chainabstractionlayer
```
