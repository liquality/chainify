const { LedgerProvider } = require('../../packages/bundle')

;(async () => {
  console.log(await LedgerProvider.isSupported())
})()
