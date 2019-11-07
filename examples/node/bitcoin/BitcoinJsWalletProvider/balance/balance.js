const { getProvider } = require('../api')

const provider = getProvider()

const balance = async () => {
  const usedAddresses = await provider.wallet.getUsedAddresses()
  const balance = await provider.chain.getBalance(usedAddresses)
  console.log(balance.toString())
}

balance()
