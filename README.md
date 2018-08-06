# Chain Abstraction Layer
[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

Query different blockchains with a single and simple interface.


## Usage

```javascript
import ChainAbstractionLayer from 'chainabstractionlayer'

const { BitcoinRPCProvider } = ChainAbstractionLayer.providers.bitcoin

const bitcoin = new ChainAbstractionLayer()
bitcoin.addProvider(new BitcoinRPCProvider('http://localhost:8080', 'bitcoin', 'local321'))

bitcoin
  .generateBlock(1) // returns Promise
  .then(console.log) // Array<BlockHash>
```


## Development

### 1. Clone the project and link it locally

```bash
git clone git@github.com:ConsenSys/chainabstractionlayer.git
cd chainabstractionlayer
npm link
```

### 2. Use it in other projects

```bash
cd mycrosschain
npm link chainabstractionlayer
```

## Build documentation

```bash
npm run build:docs
```

## Publish documentation

```bash
npm run publish:docs
```
