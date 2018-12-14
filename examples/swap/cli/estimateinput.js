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
    const btcToUSD = prices.USD
    console.log(btcToUSD)
    const tenDollarsBTC = (amountUSD / btcToUSD).toFixed(6)
    const tenDollarsSats = tenDollarsBTC * 1e8

    console.log(tenDollarsSats)

    const avgInitiateTxSize = 316
    const avgRedeemTxSize = 224

    chains.bitcoin.getFeePerByte().then(feePerByte => {
      const totalFees = feePerByte * (avgInitiateTxSize + avgRedeemTxSize)
      const totalFeesBTC = (totalFees / 1e8).toFixed(6)
      const inputAmount = tenDollarsSats + (totalFees) + 3000
      const inputAmountBTC = (inputAmount / 1e8).toFixed(6)
      console.log(`For ${amountUSD} dollar USD swap`)
      console.log(`Total Fees per swap: ${totalFees} SATS`)
      console.log(`Total Fees per swap: ${totalFeesBTC} BTC`)
      console.log(`${amountUSD} Dollar: ${tenDollarsSats} SATS`)
      console.log(`Input Amount: ${inputAmount} SATS`)
      console.log(`Input amount: ${inputAmountBTC} BTC`)
    })
  })
}


estimateInput()
