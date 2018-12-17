process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const { Client, providers, networks } = require('../../../')
const { BitcoinLedgerProvider, BitcoreRPCProvider } = providers.bitcoin

const bitcoin = new Client()
bitcoin.addProvider(new BitcoreRPCProvider('https://btc-testnet.leep.it', 'bitcoin', 'local321'))
bitcoin.addProvider(new BitcoinLedgerProvider({ network: networks.bitcoin_testnet, segwit: false }))

function time (ref = false) {
  if (ref) {
    const s = (Date.now() - ref) / 1000
    console.log(`Time: ${s}s`)
    return
  }

  return Date.now()
}

let x

;(async () => {
  try {
    x = time()
    console.log(await bitcoin.getMethod('getUnusedAddress')(true, 100))
    time(x)
    x = time()
    console.log(await bitcoin.getMethod('getUnusedAddress')(false, 100))
    time(x)
    x = time()
    console.log(await bitcoin.getMethod('getUtxosForAmount')(1e8 / 1000, 100))
    time(x)
    x = time()
    const usedAddresses = await bitcoin.getMethod('getUsedAddresses')(100)
    console.log(await bitcoin.getMethod('getBalance')(usedAddresses))
    time(x)
  } catch (e) {
    console.log(e)
  }
})()
