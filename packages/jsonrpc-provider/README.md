# `@liquality/jsonrpc-provider` <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

[![Build Status](https://travis-ci.com/liquality/chainabstractionlayer.svg?branch=master)](https://travis-ci.com/liquality/chainabstractionlayer)
[![Coverage Status](https://coveralls.io/repos/github/liquality/chainabstractionlayer/badge.svg?branch=master)](https://coveralls.io/github/liquality/chainabstractionlayer?branch=master)
[![Standard Code Style](https://img.shields.io/badge/codestyle-standard-brightgreen.svg)](https://github.com/standard/standard)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](../../LICENSE.md)
[![@liquality/jsonrpc-provider](https://img.shields.io/npm/dt/@liquality/jsonrpc-provider.svg)](https://npmjs.com/package/@liquality/jsonrpc-provider)
[![Gitter](https://img.shields.io/gitter/room/liquality/Lobby.svg)](https://gitter.im/liquality/Lobby?source=orgpage)
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/Liquality) [![Greenkeeper badge](https://badges.greenkeeper.io/liquality/chainabstractionlayer.svg)](https://greenkeeper.io/)

> :warning: This project is under heavy development. Expect bugs & breaking changes.

### :pencil: [Introductory Blog Post: The Missing Tool to Cross-Chain Development](https://medium.com/liquality/the-missing-tool-to-cross-chain-development-2ebfe898efa1)

Query different blockchains with account management using a single and simple interface.

## Installation

```bash
npm i @liquality/jsonrpc-provider
```

or

```html
<script src="https://cdn.jsdelivr.net/npm/@liquality/jsonrpc-provider@0.2.3/dist/jsonrpc-provider.min.js"></script>
<!-- sourceMap at https://cdn.jsdelivr.net/npm/@liquality/jsonrpc-provider@0.2.3/dist/jsonrpc-provider.min.js.map -->
<!-- available as window.JsonRpcProvider -->
```

## Usage

```js
import { JsonRpcProvider } from '@liquality/jsonrpc-provider'

const jsonrpc = new JsonRpcProvider('https://jsonrpc.com', 'username', 'password')

await jsonrpc.jsonrpc('sendtoaddress', 'xxx')
```

## License

[MIT](../../LICENSE.md)
