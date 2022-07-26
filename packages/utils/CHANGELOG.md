# @chainify/utils

## 1.2.11

### Patch Changes

-   fix: moralis nfts return amount and type
-   Updated dependencies
    -   @chainify/errors@1.2.11
    -   @chainify/types@1.2.11

## 1.2.10

### Patch Changes

-   -   multicall improvements
        -   export multicall data type
        -   export method to build multicall data for fetching balances
-   Updated dependencies
    -   @chainify/errors@1.2.10
    -   @chainify/types@1.2.10

## 1.2.9

### Patch Changes

-   -   extend Network type with `helperUrl`
-   Updated dependencies
    -   @chainify/errors@1.2.9
    -   @chainify/types@1.2.9

## 1.2.8

### Patch Changes

-   -   fix for all evm chains when sending amounts >=1000
-   Updated dependencies
    -   @chainify/errors@1.2.8
    -   @chainify/types@1.2.8

## 1.2.7

### Patch Changes

-   -   specify `from` property to EVM transactions when missing
-   Updated dependencies
    -   @chainify/errors@1.2.7
    -   @chainify/types@1.2.7

## 1.2.6

### Patch Changes

-   -   use forked version of @rainbow-me/fee-suggestions
    -   support naming service for EVM chains
    -   ENS Provider
-   Updated dependencies
    -   @chainify/errors@1.2.6
    -   @chainify/types@1.2.6

## 1.2.5

### Patch Changes

-   -   new eip1559 provider
-   Updated dependencies
    -   @chainify/errors@1.2.5
    -   @chainify/types@1.2.5

## 1.2.4

### Patch Changes

-   -   do not add gas margin for sending native assets
-   Updated dependencies
    -   @chainify/errors@1.2.4
    -   @chainify/types@1.2.4

## 1.2.3

### Patch Changes

-   -   fix exponent error for EVM swaps
    -   proper error handling when fetching balances
    -   add 50% gas limit margin for all EVM transactions
    -   new EIP1559 Fee API provider
-   Updated dependencies
    -   @chainify/errors@1.2.3
    -   @chainify/types@1.2.3

## 1.2.2

### Patch Changes

-   Publish again - types not correctly published
-   Updated dependencies
    -   @chainify/errors@1.2.2
    -   @chainify/types@1.2.2

## 1.2.1

### Patch Changes

-   rebuild
-   Updated dependencies
    -   @chainify/errors@1.2.1
    -   @chainify/types@1.2.1

## 1.2.0

### Minor Changes

-   nft transfer takes decimal string for token id

### Patch Changes

-   Updated dependencies
    -   @chainify/errors@1.2.0
    -   @chainify/types@1.2.0

## 1.1.2

### Patch Changes

-   -   Chain providers now have a new interface - `getTokenDetails`
    -   Network object can now be passed during EVM Fee providers creation
    -   NFTAsset type moved to global level
-   Updated dependencies
    -   @chainify/errors@1.1.2
    -   @chainify/types@1.1.2

## 1.1.1

### Patch Changes

-   export base nft provider
-   Updated dependencies
    -   @chainify/errors@1.1.1
    -   @chainify/types@1.1.1

## 1.1.0

### Minor Changes

-   Add moralis nft provider
    Standardise nft fetch response

### Patch Changes

-   Updated dependencies
    -   @chainify/errors@1.1.0
    -   @chainify/types@1.1.0

## 1.0.12

### Patch Changes

-   -   terra fix for memo
    -   bump cryptoassets version
    -   bump terra-money.js version
-   Updated dependencies
    -   @chainify/errors@1.0.12
    -   @chainify/types@1.0.12

## 1.0.11

### Patch Changes

-   -   add block hash to tx response for Near
-   Updated dependencies
    -   @chainify/errors@1.0.11
    -   @chainify/types@1.0.11

## 1.0.10

### Patch Changes

-   -   fetch btc fees correctly
-   Updated dependencies
    -   @chainify/errors@1.0.10
    -   @chainify/types@1.0.10

## 1.0.9

### Patch Changes

-   -   add flexible swap options for EVM chains
        -   numberOfBlocksPerRequest - the amount of blocks to search for events in a single call (default = 2000)
        -   totalNumberOfBlocks - the total number of blocks to search for events (default = 100_000)
        -   gasLimitMargin - percentage gas margin for chains that does not estimate gas correctly (e.g. RSK) (default=10%)
    -   add address cache for EVM ledger
    -   use toLowerCase in EVM ledger to support RSK checksum
-   Updated dependencies
    -   @chainify/errors@1.0.9
    -   @chainify/types@1.0.9

## 1.0.8

### Patch Changes

-   -   target is now es6
-   Updated dependencies
    -   @chainify/errors@1.0.8
    -   @chainify/types@1.0.8

## 1.0.7

### Patch Changes

-   -   ignore case when comparing addresses
    -   scrambleKey is now optional
-   Updated dependencies
    -   @chainify/errors@1.0.7
    -   @chainify/types@1.0.7

## 1.0.6

### Patch Changes

-   -   solana balances fetching
    -   ledger fixes and improvements
-   Updated dependencies
    -   @chainify/errors@1.0.6
    -   @chainify/types@1.0.6

## 1.0.5

### Patch Changes

-   390c4f829: - nft logic is now part of client
    -   getWalletPublicKey is public (BitcoinLedgerProvider)
-   Updated dependencies [390c4f829]
    -   @chainify/errors@1.0.5
    -   @chainify/types@1.0.5

## 1.0.4

### Patch Changes

-   4a324c902: - add cryptoassets as dependency
    -   add sign typed data interface
    -   add optimism chain provider
-   Updated dependencies [4a324c902]
    -   @chainify/errors@1.0.4
    -   @chainify/types@1.0.4

## 1.0.3

### Patch Changes

-   719c01706: - Ensure that all hashes and addresses have 0x as prefix for the EVM packages
    -   Order of checks insideverifyInitiateSwapTransaction
    -   Fix for `withCachedUtxos`
    -   Proper creation of BitcoinEsploraApiProvider
-   Updated dependencies [719c01706]
    -   @chainify/errors@1.0.3
    -   @chainify/types@1.0.3

## 1.0.2

### Patch Changes

-   8383db002: - fee provider can be null
    -   export typechain from the evm package
    -   remove approval step from initiate swap for evm chains
    -   add gasLimit as optional parameter in the TransactionRequest type
    -   fee provider is now optional for BitcoinEsploraProvider
    -   new evm chain support - Optimism
    -   add wallet and chain update hooks
    -   fix evm fees handlin
-   Updated dependencies [8383db002]
    -   @chainify/errors@1.0.2
    -   @chainify/types@1.0.2

## 1.0.1

### Patch Changes

-   change namespace from @liquality to @chainify
-   Updated dependencies
    -   @chainify/errors@1.0.1
    -   @chainify/types@1.0.1
