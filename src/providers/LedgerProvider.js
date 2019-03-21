import Transport from '@ledgerhq/hw-transport-node-hid'
import WalletProvider from './WalletProvider'
import LedgerAppProxy from './LedgerAppProxy'

export default class LedgerProvider extends WalletProvider {
  static isSupported () {
    return Transport.isSupported()
  }

  constructor (App, baseDerivationPath, network, ledgerScrambleKey) {
    super(network)

    this.app = new LedgerAppProxy(App)
    this._baseDerivationPath = baseDerivationPath
    this._network = network
    // The ledger scramble key is required to be set on the ledger transport
    // if communicating with the device using `transport.send` for the first time
    this._ledgerScrambleKey = ledgerScrambleKey
    this._addressCache = {}
  }

  async isWalletAvailable () {
    if (!this.app.transport.scrambleKey) { // scramble key required before calls
      this.app.transport.setScrambleKey(this._ledgerScrambleKey)
    }
    const exchangeTimeout = this.app.transport.exchangeTimeout
    this.app.transport.setExchangeTimeout(2000)
    try {
      // https://ledgerhq.github.io/btchip-doc/bitcoin-technical-beta.html#_get_random
      await LedgerProvider.transport.send(0xe0, 0xc0, 0x00, 0x00)
    } catch (e) {
      return false
    } finally {
      this.app.transport.setExchangeTimeout(exchangeTimeout)
    }
    return true
  }

  async getConnectedNetwork () {
    // Ledger apps do not provide connected network. It is separated in firmware.
    return this._network
  }

  async getWalletAddress (address) {
    let index = 0
    let change = false

    // A maximum number of addresses to lookup after which it is deemed
    // that the wallet does not contain this address
    const maxAddresses = 1000
    const addressesPerCall = 50

    while (index < maxAddresses) {
      const addrs = await this.getAddresses(index, addressesPerCall)
      const addr = addrs.find(addr => addr.address === address)
      if (addr) {
        return addr
      }
      index += addressesPerCall
      if (index === maxAddresses && change === false) {
        index = 0
        change = true
      }
    }

    throw new Error('Ledger: Wallet does not contain address')
  }

  async getAddresses (startingIndex = 0, numAddresses = 1, change = false) {
    return this.getAddresses(startingIndex, numAddresses, change)
  }
}
