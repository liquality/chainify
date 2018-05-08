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

const bitcoin = new ChainAbstractionLayer('bitcoin://bitcoin:local321@localhost:18332/?timeout=200&version=0.12.0')
const ethereum = new ChainAbstractionLayer('ethereum://a:b@127.0.0.1:7545/')

bitcoin
  .getBalance('0x0') // returns Promise
  .then(console.log) // in sat

// or use await

console.log(await ethereum.getBalance('0x0')) // in wei
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
