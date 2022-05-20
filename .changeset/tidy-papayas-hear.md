---
'@chainify/bitcoin': patch
'@chainify/bitcoin-ledger': patch
'@chainify/client': patch
'@chainify/errors': patch
'@chainify/evm': patch
'@chainify/evm-contracts': patch
'@chainify/evm-ledger': patch
'@chainify/hw-ledger': patch
'@chainify/logger': patch
'@chainify/near': patch
'@chainify/solana': patch
'@chainify/terra': patch
'@chainify/types': patch
'@chainify/utils': patch
---

- Ensure that all hashes and addresses have 0x as prefix for the EVM packages
- Order of checks insideverifyInitiateSwapTransaction
- Fix for `withCachedUtxos`
- Proper creation of BitcoinEsploraApiProvider