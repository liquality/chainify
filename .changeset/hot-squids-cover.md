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

-   fee provider can be null
-   export typechain from the evm package
-   remove approval step from initiate swap for evm chains
-   add gasLimit as optional parameter in the TransactionRequest type
-   fee provider is now optional for BitcoinEsploraProvider
-   new evm chain support - Optimism
-   add wallet and chain update hooks
-   fix evm fees handlin
