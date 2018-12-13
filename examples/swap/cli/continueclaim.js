var ChainAbstractionLayer = require('../../../dist/index.cjs.js')
const { Client, providers, networks } = ChainAbstractionLayer

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRPCProvider('http://localhost:18332', 'bitcoin', 'local321'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: networks.bitcoin, segwit: false }))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: networks.bitcoin }))
function doSwap () {
  console.log('Finding swap transaction')
  var secret = ''
  var secretHash = ''
  var recipientAddress = ''
  var refundAddress = ''
  var expiration = 1468194353
  var value = 10000
  var initTxId = ''
  chains.bitcoin.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => {
    console.log('continue')
    if (result._raw.txid === initTxId) {
      console.log('Block has TXID')
      chains.bitcoin.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => {
        if (isVerified) {
          console.log('Transaction Verified on chain!', initTxId)
          var WIF = null
          chains.bitcoin.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration, WIF).then(claimSwapTxId => {
            console.log('Verifying Swap!', claimSwapTxId)
            console.log('Racias', initTxId, secretHash)
            chains.bitcoin.findClaimSwapTransaction(initTxId, recipientAddress, refundAddress, secretHash, expiration).then(result => {
              console.log('Done Swap', result)
              doSwap()
            })
          }).catch((error) => {
            console.log('Error here', error)
            doSwap()
          })
        }
      })
    }
  })
}

doSwap()
