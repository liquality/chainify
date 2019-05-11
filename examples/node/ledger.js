const { LedgerProvider } = require('../../packages/bundle')

;(async () => {
  console.log(await LedgerProvider.getTransport().isSupported())
})()
