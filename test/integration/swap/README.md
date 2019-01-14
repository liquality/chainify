# Swap tests

The swap tests are intended to be run so that the swap functionality of the Chain Abstraction Layer can be validated. This will ensure that the swap protocol interface is conformed to as well as guard against any regressions. 

There are 2 categories of tests:

- `singleChain`. This tests the HTLC flow for a single chain.
- `chainToChain`. This performs an interactive swap between 2 chains.

## Pre-requisites

### Node only
To run the node based swap tests, a node of each chain (Bitcoin and Ethereum) is needed. The following nodes were used to develop and run these tests:

- *Bitcoin:* Regtest bitcore node.
- *Ethereum:* Geth client in dev mode (5s blocktime).

Ensure that the wallets are unlocked on these nodes.

If the nodes are not running on the default host and port, modifications to `config.js` will be required to point the tests to the correct locations.

### Wallet (Ledger)
Running the bitcoin swaps through a ledger requires a ledger device. The ledger device must have addresses that have a bitcoin balance on the given network. Watch the prompts on the ledger to make approvals as required by the tests.

### Wallet (MetaMask)
Swaps happening using MetaMask will require an unlocked MetaMask wallet with balances on the given network (usually local Geth node). 

The MetaMask portion of the swap uses the MetaMaskConnector to run an app that can interface with your MetaMask wallet in your browser. Watch the console prompts for the URL to navigate to. The connector port can be configured in `config.js`.

## Running the tests

To start the tests, simply run:

`npm run test:swap`

If you are not able to run certain tests within the suite due to non availability of node/wallet, you can restrict the tests by commenting out the affected tests or using mocha runner more selectively.  