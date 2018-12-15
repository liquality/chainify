var ChainAbstractionLayer = require('../../../dist/index.cjs.js')
const { Client, providers, networks, crypto } = ChainAbstractionLayer

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

/*
553003
Secret Hash: f4cbde0073e2f5fb88324187197593fd46363f7aba4d080fca816d649c5c9090
Recipient Address: 1MjBCfG58iAjYUuRRLgDu8XHs1YKM1f7Pv
Refund Address: 1MjBCfG58iAjYUuRRLgDu8XHs1YKM1f7Pv
Expirey: 1468194353
Value: 10000
Create Swap: 76a97263a820f4cbde0073e2f5fb88324187197593fd46363f7aba4d080fca816d649c5c90908814e35c805fb65fe29af3abcf91a32130dc3c4982e1670431de8257b16d14e35c805fb65fe29af3abcf91a32130dc3c4982e16888ac
Initiate Swap e03836eb9632d30f01eaf18b81b2634a05c9f90def14e781812fad4ff777692f
*/
chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRPCProvider('https://bitcoin.liquality.io:443', 'liquality', 'liquality123'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinJsLibSwapProvider({ network: networks.bitcoin }))
function doSwap () {
  var recipientAddress = '1MjBCfG58iAjYUuRRLgDu8XHs1YKM1f7Pv'
  var refundAddress = recipientAddress
  chains.bitcoin.generateSecret('test', recipientAddress).then(secret => {
    var secretHash = crypto.sha256(secret)
    console.log('Secret ', secret)
    console.log('Secret Hash', secretHash)
    // var secret = "b99c19e7d115c3950ebed5f65b44524349cb416d444bfc80c89f6dee865deef1"
    // var secretHash = "4ab1d9625034ed4457c1d9e6bb6cccffc10803dca08a3c781c03e1c3f353ba2e"
    var expiration = 1468194353
    var value = 10000
    var initTxId = 'e03836eb9632d30f01eaf18b81b2634a05c9f90def14e781812fad4ff777692f'
    console.log('Finding swap transaction', initTxId)

    chains.bitcoin.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => {
      console.log('continue')
      if (result._raw.txid === initTxId) { // TODO, check for more than one TX!
        console.log('Block has TXID') //
        chains.bitcoin.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => {
          if (isVerified) {
            console.log('Transaction Verified on chain!', initTxId)
            // chains.bitcoin.getMethod('dumpPrivKey')(recipientAddress).then((WIF) => {
            var WIF = null
            // console.log("WIF", WIF)
            chains.bitcoin.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration, WIF).then(claimSwapTxId => {
              console.log('Verifying Swap!', claimSwapTxId)
              // chains.bitcoin.getMethod('generateBlock')(1).then((txid) => {console.log("Mining Block", txid)})
              console.log('Racias', initTxId, secretHash)
              chains.bitcoin.findClaimSwapTransaction(initTxId, recipientAddress, refundAddress, secretHash, expiration).then(result => {
                console.log('Done Swap', result)
                doSwap()
              })
            }).catch((error) => {
              console.log('Error here', error)
              doSwap()
            })
            // })
          }
        })
      }
    })
  })
}

doSwap()
