const { getProvider } = require('../api')

const provider = getProvider()

const getAddress = async () => {
  const startingIndex = 0
  const numAddresses = 20

  const addresses = await provider.wallet.client.getMethod('getAddresses')(
    startingIndex,
    numAddresses,
    true
  ) // start, stop, true --> change address
  console.log(addresses)
}

const getUsedAddresses = async () => {
  const usedAddresses = await provider.wallet.getUsedAddresses()
  console.log(usedAddresses)
}

getAddress()
getUsedAddresses()
