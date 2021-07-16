import { WalletProvider } from '@liquality/wallet-provider'
import { Address, SendOptions } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { TerraNetwork } from '@liquality/terra-networks'
import { MnemonicKey, MsgSend } from '@terra-money/terra.js'

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

  async isWalletAvailable(): Promise<boolean> {
    const addresses = await this.getAddresses()
    return addresses.length > 0
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

  async signMessage(message: string): Promise<string> {
    this.setSigner()

    const signed = await this._signer.sign(Buffer.from(message))

    return signed.toString('hex')
  }

  async getConnectedNetwork(): Promise<TerraNetwork> {
    return this._network
  }

  async sendTransaction(sendOptions: SendOptions) {
    const { to, value } = sendOptions
    this.setSigner()
    const wallet = this.getMethod('_createWallet')(this._signer)

    const send = new MsgSend(addressToString(this._signer.accAddress), addressToString(to), {
      [this._network.coin]: value.toNumber()
    })

    const tx = await wallet.createAndSignTx({
      msgs: [send]
    })

    const transaction = await this.getMethod('_broadcastTx')(tx)

    const parsed = await this.getMethod('getTransactionByHash')(transaction.txhash)

    return parsed
  }

  canUpdateFee(): boolean {
    return false
  }

  private setSigner(): MnemonicKey {
    if (!this._signer) {
      this._signer = new MnemonicKey({
        mnemonic: this._mnemonic
      })
    }

    return this._signer
  }
}
