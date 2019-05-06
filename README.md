# Chain Abstraction Layer <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />


[![Build Status](https://travis-ci.com/liquality/chainabstractionlayer.svg?branch=master)](https://travis-ci.com/liquality/chainabstractionlayer)
[![Coverage Status](https://coveralls.io/repos/github/liquality/chainabstractionlayer/badge.svg?branch=master)](https://coveralls.io/github/liquality/chainabstractionlayer?branch=master)
[![Standard Code Style](https://img.shields.io/badge/codestyle-standard-brightgreen.svg)](https://github.com/standard/standard)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](./LICENSE.md)
[![Gitter](https://img.shields.io/gitter/room/liquality/Lobby.svg)](https://gitter.im/liquality/Lobby?source=orgpage)
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/Liquality) [![Greenkeeper badge](https://badges.greenkeeper.io/liquality/chainabstractionlayer.svg)](https://greenkeeper.io/)

> :warning: This project is under heavy development. Expect bugs & breaking changes.

### :pencil: [Introductory Blog Post: The Missing Tool to Cross-Chain Development](https://medium.com/liquality/the-missing-tool-to-cross-chain-development-2ebfe898efa1)

Query different blockchains with account management using a single and simple interface.

## Packages

|Package|Version|
|---|---|
|[@liquality/bitcoin-bitcoinjs-lib-swap-provider](./packages/bitcoin-bitcoinjs-lib-swap-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-bitcoinjs-lib-swap-provider.svg)](https://npmjs.com/package/@liquality/bitcoin-bitcoinjs-lib-swap-provider)|
|[@liquality/bitcoin-bitcore-rpc-provider](./packages/bitcoin-bitcore-rpc-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-bitcore-rpc-provider.svg)](https://npmjs.com/package/@liquality/bitcoin-bitcore-rpc-provider)|
|[@liquality/bitcoin-collateral-provider](./packages/bitcoin-collateral-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-collateral-provider.svg)](https://npmjs.com/package/@liquality/bitcoin-collateral-provider)|
|[@liquality/bitcoin-ledger-provider](./packages/bitcoin-ledger-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-ledger-provider.svg)](https://npmjs.com/package/@liquality/bitcoin-ledger-provider)|
|[@liquality/bitcoin-networks](./packages/bitcoin-networks)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-networks.svg)](https://npmjs.com/package/@liquality/bitcoin-networks)|
|[@liquality/bitcoin-rpc-provider](./packages/bitcoin-rpc-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-rpc-provider.svg)](https://npmjs.com/package/@liquality/bitcoin-rpc-provider)|
|[@liquality/bitcoin-swap-provider](./packages/bitcoin-swap-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-swap-provider.svg)](https://npmjs.com/package/@liquality/bitcoin-swap-provider)|
|[@liquality/bitcoin-utils](./packages/bitcoin-utils)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bitcoin-utils.svg)](https://npmjs.com/package/@liquality/bitcoin-utils)|
|[@liquality/bundle](./packages/bundle)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/bundle.svg)](https://npmjs.com/package/@liquality/bundle)|
|[@liquality/client](./packages/client)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/client.svg)](https://npmjs.com/package/@liquality/client)|
|[@liquality/crypto](./packages/crypto)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/crypto.svg)](https://npmjs.com/package/@liquality/crypto)|
|[@liquality/debug](./packages/debug)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/debug.svg)](https://npmjs.com/package/@liquality/debug)|
|[@liquality/errors](./packages/errors)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/errors.svg)](https://npmjs.com/package/@liquality/errors)|
|[@liquality/ethereum-erc20-provider](./packages/ethereum-erc20-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-erc20-provider.svg)](https://npmjs.com/package/@liquality/ethereum-erc20-provider)|
|[@liquality/ethereum-erc20-swap-provider](./packages/ethereum-erc20-swap-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-erc20-swap-provider.svg)](https://npmjs.com/package/@liquality/ethereum-erc20-swap-provider)|
|[@liquality/ethereum-ledger-provider](./packages/ethereum-ledger-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-ledger-provider.svg)](https://npmjs.com/package/@liquality/ethereum-ledger-provider)|
|[@liquality/ethereum-metamask-provider](./packages/ethereum-metamask-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-metamask-provider.svg)](https://npmjs.com/package/@liquality/ethereum-metamask-provider)|
|[@liquality/ethereum-networks](./packages/ethereum-networks)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-networks.svg)](https://npmjs.com/package/@liquality/ethereum-networks)|
|[@liquality/ethereum-rpc-provider](./packages/ethereum-rpc-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-rpc-provider.svg)](https://npmjs.com/package/@liquality/ethereum-rpc-provider)|
|[@liquality/ethereum-swap-provider](./packages/ethereum-swap-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-swap-provider.svg)](https://npmjs.com/package/@liquality/ethereum-swap-provider)|
|[@liquality/ethereum-utils](./packages/ethereum-utils)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ethereum-utils.svg)](https://npmjs.com/package/@liquality/ethereum-utils)|
|[@liquality/jsonrpc-provider](./packages/jsonrpc-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/jsonrpc-provider.svg)](https://npmjs.com/package/@liquality/jsonrpc-provider)|
|[@liquality/ledger-provider](./packages/ledger-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/ledger-provider.svg)](https://npmjs.com/package/@liquality/ledger-provider)|
|[@liquality/metamask-provider](./packages/metamask-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/metamask-provider.svg)](https://npmjs.com/package/@liquality/metamask-provider)|
|[@liquality/provider](./packages/provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/provider.svg)](https://npmjs.com/package/@liquality/provider)|
|[@liquality/schema](./packages/schema)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/schema.svg)](https://npmjs.com/package/@liquality/schema)|
|[@liquality/utils](./packages/utils)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/utils.svg)](https://npmjs.com/package/@liquality/utils)|
|[@liquality/wallet-provider](./packages/wallet-provider)|[![ChainAbstractionLayer](https://img.shields.io/npm/v/@liquality/wallet-provider.svg)](https://npmjs.com/package/@liquality/wallet-provider)|


## Usage

```javascript
import Client from '@liquality/client'
import BitcoinRpcProvider from '@liquality/bitcoin-rpc-provider'
import EthereumRpcProvider from '@liquality/ethereum-rpc-provider'

import BitcoinLedgerProvider from '@liquality/bitcoin-ledger-provider'
import EthereumLedgerProvider from '@liquality/ethereum-ledger-provider'

import BitcoinNetworks from '@liquality/bitcoin-networks'
import EthereumNetworks from '@liquality/ethereum-networks'

const bitcoin = new Client()
const ethereum = new Client()

bitcoin.addProvider(new BitcoinRpcProvider(
  'https://liquality.io/bitcointestnetrpc/', 'bitcoin', 'local321'
))
ethereum.addProvider(new EthereumRpcProvider(
  'https://rinkeby.infura.io/v3/xxx'
))

bitcoin.addProvider(new BitcoinLedgerProvider(
  { network: BitcoinNetworks.bitcoin_testnet }
))
ethereum.addProvider(new EthereumLedgerProvider(
  { network: EthereumNetworks.rinkeby }
))

// Fetch addresses from Ledger wallet using a single-unified API
const [ bitcoinAddress ] = await bitcoin.wallet.getAddresses(0, 1)
const [ ethereumAddress ] = await ethereum.wallet.getAddresses(0, 1)

// Sign a message
const signedMessageBitcoin = await bitcoin.wallet.signMessage(
  'The Times 3 January 2009 Chancellor on brink of second bailout for banks', bitcoinAddress
)
const signedMessageEthereum = await ethereum.wallet.signMessage(
  'The Times 3 January 2009 Chancellor on brink of second bailout for banks', ethereumAddress
)

// Send a transaction
await bitcoin.chain.sendTransaction(<to>, 1000)
await ethereum.chain.sendTransaction(<to>, 1000)
```


## Development

```bash
npm install
npm run bootstrap
npm run watch
```


## Production

```bash
npm run build
```


## License

[MIT](./LICENSE.md)
