var ChainAbstractionLayer = require('../../../dist/index.cjs.js')
const { Client, providers, networks, crypto } = ChainAbstractionLayer

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRPCProvider('http://localhost:18332', 'bitcoin', 'local321'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinJsLibSwapProvider({ network: networks.bitcoin_testnet }))

function doSwap () {
  chains.bitcoin.generateSecret('test').then(secret => {
    chains.bitcoin.getUnusedAddress().then(address => {
      var secretHash = crypto.sha256(secret)
      var recipientAddress = address.toString()
      var refundAddress = address.toString()
      var expiration = 1468194353
      var value = 10000

      console.log('Secret Hash:', secretHash)
      console.log('Recipient Address:', recipientAddress)
      console.log('Refund Address:', refundAddress)
      console.log('Expirey:', expiration)
      console.log('Value:', value)
      chains.bitcoin.createSwapScript(recipientAddress, refundAddress, secretHash, expiration).then(result => {
        console.log('Create Swap:', result)
      })

      chains.bitcoin.initiateSwap(value, recipientAddress, refundAddress, secretHash, expiration).then(initTxId => { // init
        console.log('Initiate Swap', initTxId)
        console.log('Finding swap transaction')
        chains.bitcoin.getMethod('generateBlock')(1).then((txid) => { console.log('Mining Block', txid) })
        chains.bitcoin.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => {
          if (result._raw.txid === initTxId) {
            console.log('Block has TXID')
            chains.bitcoin.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => {
              if (isVerified) {
                console.log('Transaction Verified on chain!', initTxId)
                chains.bitcoin.getMethod('dumpPrivKey')(recipientAddress).then((WIF) => {
                  console.log('WIF', WIF)
                  chains.bitcoin.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration, WIF).then(claimSwapTxId => {
                    console.log('Verifying Swap!', claimSwapTxId)
                    chains.bitcoin.getMethod('generateBlock')(1).then((txid) => { console.log('Mining Block', txid) })
                    console.log('Racias', initTxId, secretHash)
                    chains.bitcoin.findClaimSwapTransaction(initTxId, recipientAddress, refundAddress, secretHash, expiration).then(result => {
                      console.log('Done Swap', result)
                      doSwap()
                    })
                  }).catch((error) => {
                    console.log('Error here', error)
                    doSwap()
                  })
                })
              }
            })
          }
        })
      })
    })
  })
}

doSwap()
