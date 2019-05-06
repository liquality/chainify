process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0

const { Client, providers } = require('../../../packages/bundle')
const { BitcoinLedgerProvider, BitcoinBitcoreRpcProvider, networks } = providers.bitcoin

console.log(networks)

const bitcoin = new Client()
bitcoin.addProvider(new BitcoinBitcoreRpcProvider('https://btc-testnet.leep.it', 'bitcoin', 'local321'))
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
    console.log((await bitcoin.getMethod('getUnusedAddress')(false, 100)).address)
    time(x)
    x = time()
    console.log(await bitcoin.getMethod('getUtxosForAmount')(1e8 / 1000, 100))
    time(x)
    x = time()
    const usedAddresses = await bitcoin.getMethod('getUsedAddresses')(100)
    time(x)
    console.log(usedAddresses.map(x => x.address))
    x = time()
    console.log(await bitcoin.getMethod('getBalance')(usedAddresses.map(a => a.address)))
    time(x)
  } catch (e) {
    console.log(e)
  }
})()
