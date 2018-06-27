const Client = require('./')

const prettyPrintJson = (val) => console.log(JSON.stringify(val, null, 2))

const bitcoin = new Client('bitcoin://bitcoin:local321@localhost:18332/?timeout=200&version=0.12.0')

bitcoin.getBlock('47b3699efea4c12f80721c06c39b21731dd9da2bca40bf5ea6bc52d36e270b52').then(prettyPrintJson)
bitcoin.getBlockByNumber(3).then(prettyPrintJson)
