import { WalletProvider } from '@liquality/wallet-provider'
import { Address, ChainProvider, Transaction, SendOptions, Network, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { addressToString } from '@liquality/utils'
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing'
import { SigningStargateClient, MsgSendEncodeObject, BroadcastTxResponse } from '@cosmjs/stargate'
import { MsgSend } from '@cosmjs/stargate/build/codec/cosmos/bank/v1beta1/tx'
import { TxRaw } from '@cosmjs/stargate/build/codec/cosmos/tx/v1beta1/tx'

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

  // TODO: return only signature
  async signMessage(message: string, from: string): Promise<string> {
    // TODO: object to string -> pass as argument -> convert back to object

    const memo = ''
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

  async getConnectedNetwork(): Promise<Network> {
    return this._network
  }

  async sendTransaction(options: SendOptions): Promise<Transaction<cosmos.Tx>> {
    const [address] = await this.getAddresses()

    const msg = MsgSend.fromJSON({
      fromAddress: addressToString(address),
      toAddress: addressToString(options.to),
      amount: [{ denom: this._network.token, amount: options.value.toString() }]
    })

    const msgObject: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: msg
    }

    const txRaw = await this._signingClient.sign(
      addressToString(address),
      [msgObject],
      this._signingClient.fees.send,
      ''
    )

    const txRawBytes = TxRaw.encode(TxRaw.fromJSON(txRaw)).finish()
    const txResponse: BroadcastTxResponse = await this._signingClient.broadcastTx(txRawBytes)

    return this.getMethod('getTransactionByHash')(txResponse.transactionHash)
  }
}
