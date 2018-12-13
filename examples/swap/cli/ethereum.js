var ChainAbstractionLayer = require('../../../dist/index.cjs.js')
const { Client, providers, crypto } = ChainAbstractionLayer

var chains = {}

chains.ethereum = new Client()
chains.ethereum.addProvider(new providers.ethereum.EthereumRPCProvider('https://eth.leep.it:443/'))
chains.ethereum.addProvider(new providers.ethereum.EthereumSwapProvider())
chains.ethereum.generateSecret('test').then(secret => {
  chains.ethereum.getUnusedAddress().then(address => {
    var secretHash = crypto.sha256(secret)
    var recipientAddress = address.toString()
    var refundAddress = address.toString()
    var expiration = 1568194353
    var value = 100000000

    console.log('Secret Hash:', secretHash)
    console.log('Recipient Address:', recipientAddress)
    console.log('Refund Address:', refundAddress)
    console.log('Expirey:', expiration)
    console.log('Value:', value)
    chains.ethereum.createSwapScript(recipientAddress, refundAddress, secretHash, expiration).then(result => {
      console.log('Create Swap:', result)
    })

    chains.ethereum.initiateSwap(value, recipientAddress, refundAddress, secretHash, expiration).then(initTxId => {
      console.log('Initiate Swap', initTxId)
      console.log('Finding swap transaction')
      chains.ethereum.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => {
        console.log(result)
        chains.ethereum.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => {
          if (isVerified) {
            console.log('Transaction Verified on chain!', initTxId)
            chains.ethereum.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration).then(claimSwapTxId => {
              console.log('Verifying Swap!', claimSwapTxId)
              chains.ethereum.findClaimSwapTransaction(initTxId, secretHash).then(result => {
                console.log('Done Swap', result)
              })
            })
          }
        })
      })
    })
  })
})
