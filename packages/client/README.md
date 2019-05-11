# `@liquality/client` <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />


[![Build Status](https://travis-ci.com/liquality/chainabstractionlayer.svg?branch=master)](https://travis-ci.com/liquality/chainabstractionlayer)
[![Coverage Status](https://coveralls.io/repos/github/liquality/chainabstractionlayer/badge.svg?branch=master)](https://coveralls.io/github/liquality/chainabstractionlayer?branch=master)
[![Standard Code Style](https://img.shields.io/badge/codestyle-standard-brightgreen.svg)](https://github.com/standard/standard)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](../../LICENSE.md)
[![@liquality/client](https://img.shields.io/npm/dt/@liquality/client.svg)](https://npmjs.com/package/@liquality/client)
[![Gitter](https://img.shields.io/gitter/room/liquality/Lobby.svg)](https://gitter.im/liquality/Lobby?source=orgpage)
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/Liquality) [![Greenkeeper badge](https://badges.greenkeeper.io/liquality/chainabstractionlayer.svg)](https://greenkeeper.io/)

> :warning: This project is under heavy development. Expect bugs & breaking changes.

### :pencil: [Introductory Blog Post: The Missing Tool to Cross-Chain Development](https://medium.com/liquality/the-missing-tool-to-cross-chain-development-2ebfe898efa1)


Query different blockchains with account management using a single and simple interface.


## Installation

```bash
npm i @liquality/client
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/@liquality/client@0.2.3/dist/client.min.js"></script>
<!-- sourceMap at https://cdn.jsdelivr.net/npm/@liquality/client@0.2.3/dist/client.min.js.map -->
<!-- available as window.Client -->
```


## Usage

```js
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
  'The Times 3 January 2009 Chancellor on brink of second bailout for banks', bitcoinAddress.address
)
const signedMessageEthereum = await ethereum.wallet.signMessage(
  'The Times 3 January 2009 Chancellor on brink of second bailout for banks', ethereumAddress.address
)

// Send a transaction
await bitcoin.chain.sendTransaction(<to>, 1000)
await ethereum.chain.sendTransaction(<to>, 1000)
```


## License

[MIT](../../LICENSE.md)
