import LiquidWalletProvider from '../../liquid-wallet-provider/lib/index'
import WalletProvider from '../../wallet-provider/lib/index'

import * as liquid from 'liquidjs-lib'
import * as slip77 from 'slip77'
import * as bip32 from 'bip32'
import { mnemonicToSeed } from 'bip39'

export default class LiquidJsWalletProvider extends LiquidWalletProvider(WalletProvider) {
  constructor (network, mnemonic, addressType = 'blech32') {
    super(network, addressType, [network])

    if (!mnemonic) throw new Error('Mnemonic should not be empty')

    this._mnemonic = mnemonic
  }

  async seedNode () {
    if (this._seedNode) return this._seedNode

    const seed = await mnemonicToSeed(this._mnemonic)
    this._seedNode = bip32.fromSeed(seed, this._network)

    return this._seedNode
  }

  async blindingNode () {
    if (this._blindingNode) return this._blindingNode

    const seed = await mnemonicToSeed(this._mnemonic)
    this._blindingNode = slip77.fromSeed(seed)

    return this._blindingNode
  }

  async baseDerivationNode () {
    if (this._baseDerivationNode) return this._baseDerivationNode

    const baseNode = await this.seedNode()
    this._baseDerivationNode = baseNode.derivePath(this._baseDerivationPath)

    return this._baseDerivationNode
  }

  async keyPair (derivationPath) {
    const node = await this.seedNode()
    const wif = node.derivePath(derivationPath).toWIF()
    return liquid.ECPair.fromWIF(wif, this._network)
  }

  async blindingKeyPair (scriptPubKey) {
    const node = await this.blindingNode()
    const { publicKey, privateKey } = node.derive(scriptPubKey)
    return { publicKey, privateKey }
  }

  async getConnectedNetwork () {
    return this._network
  }

  async isWalletAvailable () {
    return true
  }
}
