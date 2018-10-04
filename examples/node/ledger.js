const { LedgerProvider } = require('../../')

;(async () => {
  console.log(await LedgerProvider.isSupported())
})()
