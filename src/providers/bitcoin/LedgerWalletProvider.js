import BitcoinProvider from './BitcoinProvider'

const Transport = require('@ledgerhq/hw-transport-node-hid').default
const LedgerBtc = require('@ledgerhq/hw-app-btc').default

export default class LedgerWalletProvider extends BitcoinProvider {
  methods () {
    let ledgerBtc = false

    async function connectToLedger () {
      if (!ledgerBtc) {
        const transport = await Transport.create()
        ledgerBtc = new LedgerBtc(transport)
      }
    }

    return {
      getAddress: {
        handle: async () => {
          await connectToLedger()

          return ledgerBtc.getWalletPublicKey(`44'/0'/0'/0`).bitcoinAddress
        }
      },
      signMessage: {
        handle: async (...args) => {
          await connectToLedger()

          const [ message ] = args

          return ledgerBtc.signMessageNew(`44'/0'/0'/0`, Buffer.from(message).toString('hex'))
        }
      }
    }
  }
}
