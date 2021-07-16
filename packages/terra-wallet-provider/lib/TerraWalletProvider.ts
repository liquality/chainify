import { WalletProvider } from '@liquality/wallet-provider'
import { Address } from '@liquality/types'
import { TerraNetwork } from '@liquality/terra-networks'

interface TerraWalletProviderOptions {
  network: TerraNetwork
  mnemonic: string
  derivationPath: string
}

export default class TerraWalletProvider extends WalletProvider {
  _network: TerraNetwork
  _mnemonic: string
  _derivationPath: string
  _addressCache: { [key: string]: Address }

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
  getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<Address[]> {
    throw new Error('Method not implemented.')
  }
  getUsedAddresses(numAddressPerCall?: number): Promise<Address[]> {
    throw new Error('Method not implemented.')
  }
  getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address> {
    throw new Error('Method not implemented.')
  }
  signMessage(message: string, from: string): Promise<string> {
    throw new Error('Method not implemented.')
  }
  getConnectedNetwork(): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
