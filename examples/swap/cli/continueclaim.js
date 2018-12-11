var ChainAbstractionLayer = require("../../../dist/index.cjs.js")
const { Client, providers, networks, crypto } = ChainAbstractionLayer

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRPCProvider('https://bitcoin.liquality.io:443', 'liquality', 'liquality123'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: networks.bitcoin, segwit: false }))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: networks.bitcoin }))
//chains.bitcoin.addProvider(new providers.bitcoin.BitcoinJsLibSwapProvider({ network: networks.bitcoin }))
function doSwap() {
    console.log("Finding swap transaction")
    var secret = ""
    var secretHash = ""
    var recipientAddress = ""
    var refundAddress = ""
    var expiration = 1468194353
    var value = 10000
    var initTxId = ""
      chains.bitcoin.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => { //find
        console.log("continue")
        if (result._raw.txid == initTxId) { //TODO, check for more than one TX!
          console.log("Block has TXID") //
          chains.bitcoin.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => { //verify
            if (isVerified) {
              console.log("Transaction Verified on chain!", initTxId)
              //chains.bitcoin.getMethod('dumpPrivKey')(recipientAddress).then((WIF) => {
              var WIF = null
              //  console.log("WIF", WIF)
                chains.bitcoin.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration, WIF).then(claimSwapTxId => {
                  console.log("Verifying Swap!", claimSwapTxId)
                  //chains.bitcoin.getMethod('generateBlock')(1).then((txid) => {console.log("Mining Block", txid)}) 
                  console.log("Racias",initTxId, secretHash)
                  chains.bitcoin.findClaimSwapTransaction(initTxId, recipientAddress, refundAddress, secretHash, expiration).then(result => {
                      console.log("Done Swap", result)
                      doSwap()
                  })
                }).catch((error) => {
                    console.log("Error here", error)
                      doSwap()
                })
              //})
            }
          })
        }
      })
}

doSwap()
