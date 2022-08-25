# @chainify/errors

## 1.2.26

### Patch Changes

-   57ccdb47a: export asL2Provider for optimism

## 1.2.25

### Patch Changes

-   44d79eb55: use asset.type instead of asset.isNative

## 1.2.24

### Patch Changes

-   74ba33141: Remove async from setters and getters in Chains class.

## 1.2.23

### Patch Changes

-   21cf21727: - fix github actions

## 1.2.22

### Patch Changes

-   23c964d0b: fee estimation for NFTs

## 1.2.21

### Patch Changes

-   2a17648d2: - fix script

## 1.2.20

### Patch Changes

-   4ba964b5b: - add npm auth token inside .yarnrc.yml

## 1.2.19

### Patch Changes

-   7e81ee996: - add npm auth token inside .yarnrc.yml

## 1.2.18

### Patch Changes

-   651760802: - fix github actions

## 1.2.17

### Patch Changes

-   3adef6d91: - fix github actions

## 1.2.16

### Patch Changes

-   83ea62866: - github actions

## 1.2.15

### Patch Changes

-   -   use `@solana/spl-token-registry`

## 1.2.14

### Patch Changes

-   -   solana nfts

## 1.2.13

### Patch Changes

-   -   fix fetching token details for Terra
    -   implement fetching token details for Solana

## 1.2.12

### Patch Changes

-   fix: nfts-on-arbitrum

## 1.2.11

### Patch Changes

-   fix: moralis nfts return amount and type

## 1.2.10

### Patch Changes

-   -   multicall improvements
        -   export multicall data type
        -   export method to build multicall data for fetching balances

## 1.2.9

### Patch Changes

-   -   extend Network type with `helperUrl`

## 1.2.8

### Patch Changes

-   -   fix for all evm chains when sending amounts >=1000

## 1.2.7

### Patch Changes

-   -   specify `from` property to EVM transactions when missing

## 1.2.6

### Patch Changes

-   -   use forked version of @rainbow-me/fee-suggestions
    -   support naming service for EVM chains
    -   ENS Provider

## 1.2.5

### Patch Changes

-   -   new eip1559 provider

## 1.2.4

### Patch Changes

-   -   do not add gas margin for sending native assets

## 1.2.3

### Patch Changes

-   -   fix exponent error for EVM swaps
    -   proper error handling when fetching balances
    -   add 50% gas limit margin for all EVM transactions
    -   new EIP1559 Fee API provider

## 1.2.2

### Patch Changes

-   Publish again - types not correctly published

## 1.2.1

### Patch Changes

-   rebuild

## 1.2.0

### Minor Changes

-   nft transfer takes decimal string for token id

## 1.1.2

### Patch Changes

-   -   Chain providers now have a new interface - `getTokenDetails`
    -   Network object can now be passed during EVM Fee providers creation
    -   NFTAsset type moved to global level

## 1.1.1

### Patch Changes

-   export base nft provider

## 1.1.0

### Minor Changes

-   Add moralis nft provider
    Standardise nft fetch response

## 1.0.12

### Patch Changes

-   -   terra fix for memo
    -   bump cryptoassets version
    -   bump terra-money.js version

## 1.0.11

### Patch Changes

-   -   add block hash to tx response for Near

## 1.0.10

### Patch Changes

-   -   fetch btc fees correctly

## 1.0.9

### Patch Changes

-   -   add flexible swap options for EVM chains
        -   numberOfBlocksPerRequest - the amount of blocks to search for events in a single call (default = 2000)
        -   totalNumberOfBlocks - the total number of blocks to search for events (default = 100_000)
        -   gasLimitMargin - percentage gas margin for chains that does not estimate gas correctly (e.g. RSK) (default=10%)
    -   add address cache for EVM ledger
    -   use toLowerCase in EVM ledger to support RSK checksum

## 1.0.8

### Patch Changes

-   -   target is now es6

## 1.0.7

### Patch Changes

-   -   ignore case when comparing addresses
    -   scrambleKey is now optional

## 1.0.6

### Patch Changes

-   -   solana balances fetching
    -   ledger fixes and improvements

## 1.0.5

### Patch Changes

-   390c4f829: - nft logic is now part of client
    -   getWalletPublicKey is public (BitcoinLedgerProvider)

## 1.0.4

### Patch Changes

-   4a324c902: - add cryptoassets as dependency
    -   add sign typed data interface
    -   add optimism chain provider

## 1.0.3

### Patch Changes

-   719c01706: - Ensure that all hashes and addresses have 0x as prefix for the EVM packages
    -   Order of checks insideverifyInitiateSwapTransaction
    -   Fix for `withCachedUtxos`
    -   Proper creation of BitcoinEsploraApiProvider

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

## 1.0.1

### Patch Changes

-   change namespace from @liquality to @chainify
