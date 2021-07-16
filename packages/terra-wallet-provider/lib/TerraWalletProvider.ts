import { WalletProvider } from '@liquality/wallet-provider'
import { Address } from '@liquality/types'
import { TerraNetwork } from '@liquality/terra-networks'
import { MnemonicKey } from '@terra-money/terra.js'

interface TerraWalletProviderOptions {
  network: TerraNetwork
  mnemonic: string
  derivationPath: string
}

export default class TerraWalletProvider extends WalletProvider {
  _network: TerraNetwork
  _derivationPath: string
  _addressCache: { [key: string]: Address }
  private _mnemonic: string
  private _signer: MnemonicKey

  constructor(options: TerraWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath
    this._addressCache = {}
  }

  isWalletAvailable(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  async getAddresses(): Promise<Address[]> {
    if (this._addressCache[this._mnemonic]) {
      return [this._addressCache[this._mnemonic]]
    }

    const wallet = new MnemonicKey({
      mnemonic: this._mnemonic
    })

    const result = new Address({
      address: wallet.accAddress,
      derivationPath: this._derivationPath,
      publicKey: wallet.accPubKey
    })

    this._addressCache[this._mnemonic] = result
    return [result]
  }

  async getUsedAddresses(): Promise<Address[]> {
    return await this.getAddresses()
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  signMessage(message: string, from: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getConnectedNetwork(): Promise<any> {
    throw new Error('Method not implemented.')
  }

  private getSigner(): MnemonicKey {
    if (!this._signer) {
      this._signer = new MnemonicKey({
        mnemonic: this._mnemonic
      })
    }

    return this._signer
  }
}
