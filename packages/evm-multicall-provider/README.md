# `@liquality/evm-multicall-provider` <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

[![Build Status](https://travis-ci.com/liquality/chainabstractionlayer.svg?branch=master)](https://travis-ci.com/liquality/chainabstractionlayer)
[![Coverage Status](https://coveralls.io/repos/github/liquality/chainabstractionlayer/badge.svg?branch=master)](https://coveralls.io/github/liquality/chainabstractionlayer?branch=master)
[![Standard Code Style](https://img.shields.io/badge/codestyle-standard-brightgreen.svg)](https://github.com/standard/standard)
[![MIT License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](../../LICENSE.md)
[![@liquality/evm-multicall-provider](https://img.shields.io/npm/dt/@liquality/@liquality/evm-multicall-provider.svg)](https://npmjs.com/package/@liquality/evm-multicall-provider)
[![Gitter](https://img.shields.io/gitter/room/liquality/Lobby.svg)](https://gitter.im/liquality/Lobby?source=orgpage)
[![Telegram](https://img.shields.io/badge/chat-on%20telegram-blue.svg)](https://t.me/Liquality) [![Greenkeeper badge](https://badges.greenkeeper.io/liquality/chainabstractionlayer.svg)](https://greenkeeper.io/)

> :warning: This project is under heavy development. Expect bugs & breaking changes.

### :pencil: [Introductory Blog Post: The Missing Tool to Cross-Chain Development](https://medium.com/liquality/the-missing-tool-to-cross-chain-development-2ebfe898efa1)

Query different blockchains with account management using a single and simple interface.

## Installation

```bash
npm i @liquality/evm-multicall-provider
```


## Usage
```js
const provider = new EvmMulticallProvider(
      new StaticJsonRpcProvider('rpc_url', 'ropsten'),
      3 /* ropsten chain id */
    )

const ERC20BalanceABI = [
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
]

const result = await provider.multicall([
{
    target: '0xc8b23857d66ae204d195968714840a75d28dc217',
    abi: ERC20BalanceABI,
    name: 'balanceOf',
    params: ['0xF180525Ef03D5e5bFd09156823e0eA49da561c5F']
},
{
    target: '0x1371597fc11aedbd2446f5390fa1dbf22491752a',
    abi: ERC20BalanceABI,
    name: 'balanceOf',
    params: ['0xF180525Ef03D5e5bFd09156823e0eA49da561c5F']
}
])

console.log(result)

```
## License

[MIT](../../LICENSE.md)
