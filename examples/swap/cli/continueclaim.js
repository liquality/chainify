var ChainAbstractionLayer = require('../../../packages/bundle')
const { Client, providers } = ChainAbstractionLayer
const networks = providers.bitcoin.networks

var chains = {}
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRpcProvider('http://localhost:18443', 'bitcoin', 'local321'))
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
  chains.bitcoin.swap.findInitiateSwapTransaction(value, recipientAddress, refundAddress, secretHash, expiration).then(result => {
    console.log('continue')
    if (result._raw.txid === initTxId) {
      console.log('Block has TXID')
      chains.bitcoin.swap.verifyInitiateSwapTransaction(initTxId, value, recipientAddress, refundAddress, secretHash, expiration).then(isVerified => {
        if (isVerified) {
          console.log('Transaction Verified on chain!', initTxId)
          var WIF = null
          chains.bitcoin.swap.claimSwap(initTxId, recipientAddress, refundAddress, secret, expiration, WIF).then(claimSwapTxId => {
            console.log('Verifying Swap!', claimSwapTxId)
            console.log('Racias', initTxId, secretHash)
            chains.bitcoin.swap.findClaimSwapTransaction(initTxId, recipientAddress, refundAddress, secretHash, expiration).then(result => {
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
