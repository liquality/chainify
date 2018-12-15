process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

const { Client, providers, networks, crypto } = require('../../../dist/index.cjs.js')
const chains = {}

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.walletconnect.WalletConnectProvider({ network: networks.bitcoin_testnet }))
