process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0

global.fetch = require('node-fetch')

const cc = require('cryptocompare')
cc.setApiKey('89b7710d-b56d-430f-a7bf-6ce6a9130016')

const { Client, providers, networks, crypto } = require('../../../dist/index.cjs.js')
const chains = {}

chains.bitcoin = new Client()
chains.bitcoin.addProvider(new providers.bitcoin.BitcoreRPCProvider('https://bitcoin.liquality.io', 'liquality', 'liquality123'))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinLedgerProvider({ network: networks.bitcoin, segwit: false }))
chains.bitcoin.addProvider(new providers.bitcoin.BitcoinSwapProvider({ network: networks.bitcoin }))


async function estimateInput() {
  cc.price('BTC', ['USD']).then(prices => {
    const amountUSD = 5
    const avgInitiateTxSize = 316
    const avgRedeemTxSize = 224
    const btcToUSD = prices.USD
    const amountDollarsBTC = (amountUSD / btcToUSD).toFixed(6)
    const amountDollarsSats = amountDollarsBTC * 1e8

    chains.bitcoin.getFeePerByte().then(feePerByte => {
      const totalFees = feePerByte * (avgInitiateTxSize + avgRedeemTxSize)
      const totalFeesBTC = (totalFees / 1e8).toFixed(6)
      const inputAmount = amountDollarsSats + (totalFees) + 3000
      const inputAmountBTC = (inputAmount / 1e8).toFixed(6)
      console.log(`For ${amountUSD} Dollar USD swap`)
      console.log(`Total Fees per swap: ${totalFees} SATS`)
      console.log(`Total Fees per swap: ${totalFeesBTC} BTC`)
      console.log(`${amountUSD} Dollars USD: ${amountDollarsSats} SATS`)
      console.log(`${amountUSD} Dollars USD: ${amountDollarsBTC} BTC`)
      console.log(`Input Amount: ${inputAmount} SATS`)
      console.log(`Input Amount: ${inputAmountBTC} BTC`)
    })
  })
}


estimateInput()
