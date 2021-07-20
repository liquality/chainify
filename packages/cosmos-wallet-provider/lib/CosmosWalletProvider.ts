import { WalletProvider } from '@liquality/wallet-provider'
import { BigNumber, Address, ChainProvider, Transaction, SendOptions, Network, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { addressToString } from '@liquality/utils'
import { DirectSecp256k1HdWallet, makeCosmoshubPath } from '@cosmjs/proto-signing'
import { SigningStargateClient, MsgSendEncodeObject, BroadcastTxResponse } from '@cosmjs/stargate'
import { Secp256k1, Slip10, Slip10Curve } from '@cosmjs/crypto'
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx'
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

  constructor(options: CosmosWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath
    this._addressCache = {}
    this._privateKey = null
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
    this._privateKey = Slip10.derivePath(Slip10Curve.Secp256k1, seed, makeCosmoshubPath(0)).privkey

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

    return this.sendTransaction({ to: address, value: new BigNumber(coin.amount) })
  }

  async sendTransaction(options: SendOptions): Promise<Transaction<cosmos.Tx>> {
    const [address] = await this.getAddresses()

    const msg = MsgSend.fromJSON({
      fromAddress: addressToString(address),
      toAddress: addressToString(options.to),
      amount: [{ denom: this._network.defaultCurrency.coinMinimalDenom, amount: options.value.toString() }]
    })

    const msgObject: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: msg
    }

    const gas = this._signingClient.fees.send.gas // default gas for send is 80k
    const amount = new BigNumber(gas).multipliedBy(new BigNumber(this._network.minimalGasPrice))
    const fee = {
      amount: [
        {
          denom: this._network.defaultCurrency.coinMinimalDenom,
          amount: amount.toString()
        }
      ],
      gas: gas
    }

    const txRaw = await this._signingClient.sign(addressToString(address), [msgObject], fee, '')

    const txRawBytes = TxRaw.encode(TxRaw.fromJSON(txRaw)).finish()
    const txResponse: BroadcastTxResponse = await this._signingClient.broadcastTx(txRawBytes)

    return this.getMethod('getTransactionByHash')('0x' + txResponse.transactionHash)
  }
}
