import { WalletProvider } from '@liquality/wallet-provider'
import { Address, ChainProvider, Transaction, SendOptions } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient } from '@cosmjs/stargate'

interface CosmosWalletProviderOptions {
  network: CosmosNetwork
  mnemonic: string
  derivationPath: string
}

export default class CosmosWalletProvider extends WalletProvider implements Partial<ChainProvider> {
  _network: CosmosNetwork
  _mnemonic: string
  _derivationPath: string
  _wallet: DirectSecp256k1HdWallet
  _signingClient: SigningStargateClient
  _addressCache: { [key: string]: Address }

  constructor(options: CosmosWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath
    this._addressCache = {}
  }

  async getAddresses(): Promise<Address[]> {
    if (this._addressCache[this._mnemonic]) {
      return [this._addressCache[this._mnemonic]]
    }

    if (!this._wallet || !this._signingClient) {
      this._wallet = await DirectSecp256k1HdWallet.fromMnemonic(this._mnemonic)
      this._signingClient = await SigningStargateClient.connectWithSigner(this._network.rpcUrl, this._wallet)
    }

    const [account] = await this._wallet.getAccounts()
    const result = new Address({
      address: account.address,
      derivationPath: this._derivationPath,
      publicKey: account.pubkey.toString()
    })

    this._addressCache[this._mnemonic] = result
    return [result]
  }

  async isWalletAvailable(): Promise<boolean> {
    return !this._addressCache[this._mnemonic]
  }

  async getUsedAddresses(): Promise<Address[]> {
    return this.getAddresses()
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  // TODO: return only signature
  async signMessage(message: string, from: string, memo?: string): Promise<string> {
    // TODO: object to string -> pass as argument -> convert back to object

    console.log(message, from, memo)
    // const fee = {
    //   amount: [
    //     {
    //       denom: 'token',
    //       amount: '1'
    //     }
    //   ],
    //   gas: '180000' // 180k
    // }

    // const txRaw = await this._signingClient.sign((await this.getAddresses())[0], [msgAny], fee, memo)
    return
  }

  async getConnectedNetwork(): Promise<any> {
    if (this._addressCache[this._mnemonic]) {
      return this._network.network
    }

    return ''
  }

  sendTransaction(options: SendOptions): Promise<Transaction> {
    console.log(options)
    throw new Error('Method not implemented.')
  }
}
