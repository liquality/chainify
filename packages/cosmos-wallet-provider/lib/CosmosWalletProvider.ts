import { MsgFactory } from './MsgFactory'
import { WalletProvider } from '@liquality/wallet-provider'
import { BigNumber, Address, ChainProvider, Transaction, Network, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { addressToString } from '@liquality/utils'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient, BroadcastTxResponse } from '@cosmjs/stargate'
import { Secp256k1, Slip10, Slip10Curve, stringToPath } from '@cosmjs/crypto'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { mnemonicToSeed } from 'bip39'

interface CosmosWalletProviderOptions {
  network: CosmosNetwork
  mnemonic: string
  derivationPath: string
}

export default class CosmosWalletProvider extends WalletProvider implements Partial<ChainProvider> {
  _network: CosmosNetwork
  private _mnemonic: string
  private _derivationPath: string
  private _signingClient: SigningStargateClient
  private _addressCache: { [key: string]: Address }
  private _privateKey: any
  private _msgFactory: MsgFactory

  constructor(options: CosmosWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath
    this._addressCache = {}
    this._privateKey = null
    this._msgFactory = new MsgFactory(this._network)
  }

  async getAddresses(): Promise<Address[]> {
    if (this._addressCache[this._mnemonic]) {
      return [this._addressCache[this._mnemonic]]
    }

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(this._mnemonic, {
      prefix: this._network.addressPrefix
    })

    this._signingClient = await SigningStargateClient.connectWithSigner(this._network.rpcUrl, wallet)
    const seed = await mnemonicToSeed(this._mnemonic)
    this._privateKey = Slip10.derivePath(Slip10Curve.Secp256k1, seed, stringToPath(this._derivationPath)).privkey

    const [account] = await wallet.getAccounts()
    const result = new Address({
      address: account.address,
      derivationPath: this._derivationPath,
      publicKey: account.pubkey.toString()
    })

    this._addressCache[this._mnemonic] = result
    return [result]
  }

  async isWalletAvailable(): Promise<boolean> {
    const addresses = await this.getAddresses()
    return addresses.length > 0
  }

  async getUsedAddresses(): Promise<Address[]> {
    return this.getAddresses()
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async signMessage(message: string): Promise<string> {
    await this.getAddresses()

    const buffer = Buffer.from(message)
    const signature = await Secp256k1.createSignature(buffer, this._privateKey)
    return (
      Buffer.from(signature.r(32)).toString('hex') +
      Buffer.from(signature.s(32)).toString('hex') +
      signature.recovery.toString()
    )
  }

  async getConnectedNetwork(): Promise<Network> {
    return this._network
  }

  async sendSweepTransaction(address: Address | string): Promise<Transaction<cosmos.Tx>> {
    const [senderAddress] = await this.getAddresses()
    const coin = await this._signingClient.getBalance(
      addressToString(senderAddress),
      this._network.defaultCurrency.coinMinimalDenom
    )

    if (coin === undefined) {
      throw new Error('Empty Balance!')
    }

    return this.sendTransaction({ type: cosmos.MsgType.SendMsg, to: address, value: new BigNumber(coin.amount) })
  }

  async sendTransaction(options: cosmos.CosmosSendOptions): Promise<Transaction<cosmos.Tx>> {
    const [address] = await this.getAddresses()

    const { msgs, fee } = this._msgFactory.buildMsg({ ...options, from: address })

    const txRaw = await this._signingClient.sign(addressToString(address), msgs, fee, '')

    const txRawBytes = TxRaw.encode(txRaw).finish()
    const txResponse: BroadcastTxResponse = await this._signingClient.broadcastTx(txRawBytes)

    return this.getMethod('getTransactionByHash')(txResponse.transactionHash)
  }

  canUpdateFee(): boolean {
    return false
  }
}
