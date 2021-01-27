import Provider from '@liquality/provider'

import {version} from '../package.json'

class NearJsWalletProvider extends Provider {
  constructor(network, mnemonic) {
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = `m/44'/${network.coinType}'/0'`
  }

  async getAddresses() {}

  async getUnusedAddress() {}

  async getUsedAddresses() {}

  async signMessage(message) {}

  async sendTransaction(to, value, data, _gasPrice) {}

  async sendSweepTransaction(address, _gasPrice) {}

  async updateTransactionFee(tx, newGasPrice) {}
}

NearJsWalletProvider.version = version
