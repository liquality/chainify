# Chainify <img align="right" src="https://raw.githubusercontent.com/liquality/chainabstractionlayer/master/liquality-logo.png" height="80px" />

<pre>
   ________          _       _ ____     
  / ____/ /_  ____ _(_)___  (_) __/_  __
 / /   / __ \/ __ `/ / __ \/ / /_/ / / /
/ /___/ / / / /_/ / / / / / / __/ /_/ / 
\____/_/ /_/\__,_/_/_/ /_/_/_/  \__, /  
                               /____/   
</pre>
                               
Chainify is a flexible, modular library for developing disintermediated solutions across different blockchains.

The repository uses [yarn workspaces](https://yarnpkg.com/features/workspaces) for fast, reliable, and secure dependency management.

The build system is using [Turborepo](https://turborepo.org/)

### Packages
| Package                                               |                                                                    Version                                                                   |
| :---------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------: |
| [@chainify/bitcoin](./packages/bitcoin)               |        [![Chainify](https://img.shields.io/npm/v/@chainify/bitcoin?style=for-the-badge)](https://npmjs.com/package/@chainify/bitcoin)        |
| [@chainify/bitcoin-ledger](./packages/bitcoin-ledger) | [![Chainify](https://img.shields.io/npm/v/@chainify/bitcoin-ledger?style=for-the-badge)](https://npmjs.com/package/@chainify/bitcoin-ledger) |
| [@chainify/client](./packages/client)                 |         [![Chainify](https://img.shields.io/npm/v/@chainify/client?style=for-the-badge)](https://npmjs.com/package/@chainify/client)         |
| [@chainify/errors](./packages/errors)                 |         [![Chainify](https://img.shields.io/npm/v/@chainify/errors?style=for-the-badge)](https://npmjs.com/package/@chainify/errors)         |
| [@chainify/evm](./packages/evm)                       |            [![Chainify](https://img.shields.io/npm/v/@chainify/evm?style=for-the-badge)](https://npmjs.com/package/@chainify/evm)            |
| [@chainify/evm-contracts](./packages/evm-contracts)   |  [![Chainify](https://img.shields.io/npm/v/@chainify/evm-contracts?style=for-the-badge)](https://npmjs.com/package/@chainify/evm-contracts)  |
| [@chainify/evm-ledger](./packages/evm-ledger)         |     [![Chainify](https://img.shields.io/npm/v/@chainify/evm-ledger?style=for-the-badge)](https://npmjs.com/package/@chainify/evm-ledger)     |
| [@chainify/hw-ledger](./packages/hw-ledger)           |      [![Chainify](https://img.shields.io/npm/v/@chainify/hw-ledger?style=for-the-badge)](https://npmjs.com/package/@chainify/hw-ledger)      |
| [@chainify/logger](./packages/logger)                 |         [![Chainify](https://img.shields.io/npm/v/@chainify/logger?style=for-the-badge)](https://npmjs.com/package/@chainify/logger)         |
| [@chainify/near](./packages/near)                     |           [![Chainify](https://img.shields.io/npm/v/@chainify/near?style=for-the-badge)](https://npmjs.com/package/@chainify/near)           |
| [@chainify/solana](./packages/solana)                 |         [![Chainify](https://img.shields.io/npm/v/@chainify/solana?style=for-the-badge)](https://npmjs.com/package/@chainify/solana)         |
| [@chainify/terra](./packages/terra)                   |          [![Chainify](https://img.shields.io/npm/v/@chainify/terra?style=for-the-badge)](https://npmjs.com/package/@chainify/terra)          |
| [@chainify/types](./packages/types)                   |          [![Chainify](https://img.shields.io/npm/v/@chainify/types?style=for-the-badge)](https://npmjs.com/package/@chainify/types)          |
| [@chainify/utils](./packages/utils)                   |          [![Chainify](https://img.shields.io/npm/v/@chainify/utils?style=for-the-badge)](https://npmjs.com/package/@chainify/utils)          |

### Install dependencies
```bash
yarn install
```

### Build all packages
```bash
yarn build
```

### Run all tests
```bash 
yarn test
```

### Release a new version
```bash
yarn changeset
   # choose the version bump - major, minor or patch
   # add change summary

yarn version
   # review changes
   # yarn build —force

yarn release
yarn tag
```

### License
[MIT](./LICENSE.md)
