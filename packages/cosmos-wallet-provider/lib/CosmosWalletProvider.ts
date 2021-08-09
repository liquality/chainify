import { MsgFactory } from './MsgFactory'
import { WalletProvider } from '@liquality/wallet-provider'
import { BigNumber, Address, ChainProvider, Transaction, Network, cosmos } from '@liquality/types'
import { CosmosNetwork } from '@liquality/cosmos-networks'
import { addressToString } from '@liquality/utils'
import { DirectSecp256k1HdWallet, EncodeObject } from '@cosmjs/proto-signing'
import { StdSignDoc, Secp256k1HdWallet, AminoSignResponse, StdFee } from '@cosmjs/amino'
import { SigningStargateClient, BroadcastTxResponse } from '@cosmjs/stargate'
import { Secp256k1, Slip10, Slip10Curve, stringToPath } from '@cosmjs/crypto'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx'
import { mnemonicToSeed } from 'bip39'
import { StdTx } from '@cosmjs/launchpad'

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
  private _aminoSigner: Secp256k1HdWallet
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
    this._aminoSigner = await Secp256k1HdWallet.fromMnemonic(this._mnemonic, {
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

  async signAmino(signerAddr: string, signDoc: StdSignDoc): Promise<AminoSignResponse> {
    return await this._aminoSigner.signAmino(signerAddr, signDoc)
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

    return this.sendTransaction({ type: cosmos.MsgType.MsgSend, to: address, value: new BigNumber(coin.amount) })
  }

  async sendTransaction(options: cosmos.CosmosSendOptions): Promise<Transaction<cosmos.Tx>> {
    const [address] = await this.getAddresses()

    const { msgs, fee } = this._msgFactory.buildMsg({ ...options, from: address })

    const txResponse = await this._broadcastTx(address, msgs, fee)

    return this.getMethod('getTransactionByHash')(txResponse.transactionHash)
  }

  async sendInjectionTx(tx: StdTx): Promise<Buffer> {
    const [address] = await this.getAddresses()

    const msgs = tx.msg.map((msg) => {
      const { type, value } = msg

      const msgType = type.split('/')[1]

      const { delegator_address, validator_address, amount } = value

      return this._msgFactory.buildMsg({
        type: msgType,
        to: validator_address,
        from: delegator_address,
        value: new BigNumber(amount.amount || 0)
      }).msgs[0]
    })

    const txResponse = await this._broadcastTx(address, msgs, tx.fee)

    return Buffer.from(txResponse.transactionHash, 'hex')
  }

  canUpdateFee(): boolean {
    return false
  }

  private async _broadcastTx(address: Address, msgs: EncodeObject[], fee: StdFee): Promise<BroadcastTxResponse> {
    const txRaw = await this._signingClient.sign(addressToString(address), msgs, fee, '')
    const txRawBytes = TxRaw.encode(txRaw).finish()

    return await this._signingClient.broadcastTx(txRawBytes)
  }
}
