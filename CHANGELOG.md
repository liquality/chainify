# CHANGELOG.md

## 0.7.1 (2020-10-08)

Changes:

- Remove bundle
- Remove kiba providers
- Remove experimental litecoin providers

Fixes:

- Fix `decodeRawTransaction` for testnet #359 @matthewjablack

## 0.7.0 (2020-10-07)

Features:

- Remove `MetamaskProvider` and `EthereumMetaMaskProvider` in favour of EIP1193 compatible `EthereumWalletApiProvider` #360 @monokh
- `sendSweepTransaction` allows sweeping wallets (implemented on JS wallet providers) #358 @matthewjablack