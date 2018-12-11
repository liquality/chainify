var ChainAbstractionLayer = require("../../../dist/index.cjs.js")
var Web3 = require("web3")
const { Client, providers, networks, crypto } = ChainAbstractionLayer

var chains = {}

chains.ethereum = new Client()
//chains.ethereum.addProvider(new providers.ethereum.EthereumRPCProvider('http://localhost:8545'))
chains.ethereum.addProvider(new providers.ethereum.EthereumRPCProvider('https://eth.leep.it:443/'))
//chains.ethereum.addProvider(new Web3.providers.HttpProvider("http://localhost:8545"))
chains.ethereum.addProvider(new providers.ethereum.EthereumSwapProvider())
chains.ethereum.generateSecret('test').then(secret => {
  chains.ethereum.getUnusedAddress().then(address =>{
    var secretHash = crypto.sha256(secret)
    var recipientAddress = address.toString()
    var refundAddress = address.toString()
    var expiration = 1568194353 
    var value = 100000000

    console.log("Secret Hash:", secretHash)
    console.log("Recipient Address:", recipientAddress)
    console.log("Refund Address:", refundAddress)
    console.log("Expirey:", expiration)
    console.log("Value:", value)
    chains.ethereum.createSwapScript(recipientAddress, refundAddress, secretHash, expiration).then(result => {
      console.log("Create Swap:", result)
    })

    chains.ethereum.initiateSwap(value, recipientAddress, refundAddress, secretHash, expiration).then(initTxId => { // init
      console.log("Initiate Swap", initTxId)
      console.log("Finding swap transaction")
      chains.ethereum.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => { //find
        console.log(result)
        //if (result._raw.data.txid == initTxId) { //TODO, check for more than one TX!
          console.log("Block has TXID") //
          chains.ethereum.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => { //verify
            if (isVerified) {
              console.log("Transaction Verified on chain!", initTxId)
              chains.ethereum.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration).then(claimSwapTxId => {
                  console.log("Verifying Swap!", claimSwapTxId)
                  chains.ethereum.findClaimSwapTransaction(initTxId, secretHash).then(result => {
                      console.log("Done Swap", result)
                  })
                  
              })
            }
          })
        //}
      })
    })
  })
  
})
/*
chains.ethereum = new cal.Client("ethereum://bitcoin:local321@localhost:8545/")

chains.ethereum.generateSecret('test').then(result => {
  console.log("Ethereum Secret",cal.crypto.sha256(result))
})
*/
/*
chains.ethereum = new Client()
chains.ethereum.addProvider(new providers.ethereum.EthereumRPCProvider('http://localhost:8545', 'bitcoin', 'local321'))
chains.ethereum.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: networks.bitcoin_testnet }))
chains.ethereum.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: networks.bitcoin_testnet }))
chains.bitcoin.generateSecret('test').then(secret => {
  chains.bitcoin.getUnusedAddress().then(address =>{
    var secretHash = crypto.sha256(secret)
    var recipientAddress = address.toString()
    var refundAddress = address.toString()
    var expiration = 1568194353 
    var value = 10000

    console.log("Secret Hash:", secretHash)
    console.log("Recipient Address:", recipientAddress)
    console.log("Refund Address:", refundAddress)
    console.log("Expirey:", expiration)
    console.log("Value:", value)
    chains.bitcoin.createSwapScript(recipientAddress, refundAddress, secretHash, expiration).then(result => {
      console.log("Create Swap:", result)
    })

    chains.bitcoin.initiateSwap(value, recipientAddress, refundAddress, secretHash, expiration).then(initTxId => { // init
      console.log("Initiate Swap", initTxId)
      console.log("Finding swap transaction")
      chains.bitcoin.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => { //find
        if (result._raw.data.txid == initTxId) { //TODO, check for more than one TX!
          console.log("Block has TXID") //
          chains.bitcoin.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => { //verify
            if (isVerified) {
              console.log("Transaction Verified on chain!", initTxId)
              chains.bitcoin.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration).then(claimSwapTxId => {
                  console.log("Verifying Swap!", claimSwapTxId)
                  chains.bitcoin.findClaimSwapTransaction(claimSwapTxId, secretHash).then(result => {
                      console.log("Done Swap", result)
                  })
                  
              })
            }
          })
        }
      })
    })
  })
  
})
*/
/*
chains.ethereum = new cal.Client("ethereum://bitcoin:local321@localhost:8545/")

chains.ethereum.generateSecret('test').then(result => {
  console.log("Ethereum Secret",cal.crypto.sha256(result))
})
*/




