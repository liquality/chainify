import { WalletProvider } from '@liquality/wallet-provider'
import { Address, BigNumber, Transaction, terra, SendOptions } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { TerraNetwork } from '@liquality/terra-networks'
import {
  BlockTxBroadcastResult,
  Coins,
  LCDClient,
  MnemonicKey,
  Msg,
  MsgSend,
  StdTx,
  Wallet,
  CreateTxOptions,
  StdFee
} from '@terra-money/terra.js'

interface TerraWalletProviderOptions {
  network: TerraNetwork
  mnemonic: string
  baseDerivationPath: string
}

export default class TerraWalletProvider extends WalletProvider {
  _network: TerraNetwork
  _baseDerivationPath: string
  _addressCache: { [key: string]: Address }
  private _mnemonic: string
  private _signer: MnemonicKey
  private _lcdClient: LCDClient
  private _wallet: Wallet
  _accAddressKey: string

  constructor(options: TerraWalletProviderOptions) {
    const { network, mnemonic, baseDerivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._baseDerivationPath = baseDerivationPath
    this._addressCache = {}

    this._lcdClient = new LCDClient({
      URL: network.nodeUrl,
      chainID: network.chainID
    })

    this._setSigner()
    this._createWallet(this._signer)
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
      derivationPath: this._baseDerivationPath + `/0/0`,
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
    const signed = await this._signer.sign(Buffer.from(message))

    return signed.toString('hex')
  }

  async getConnectedNetwork(): Promise<TerraNetwork> {
    return this._network
  }

  async sendTransaction(sendOptions: SendOptions): Promise<Transaction<terra.InputTransaction>> {
    const { to, value, fee } = sendOptions

    const data: CreateTxOptions = sendOptions.data as any
    let txData: any

    if (typeof data?.fee === 'string') {
      txData = {
        fee: StdFee.fromData(JSON.parse(data.fee as any))
      }
    } else if (data?.msgs) {
      txData = {
        ...(fee && {
          gasPrices: new Coins({
            [this._network.asset]: fee
          })
        })
      }
    } else {
      txData = {
        msgs: [this._sendMessage(to, value)],
        gasPrices: new Coins({
          [this._network.asset]: fee
        })
      }
    }

    if (!txData.msgs) {
      txData = {
        ...txData,
        msgs: data.msgs.map((msg) => (typeof msg === 'string' ? Msg.fromData(JSON.parse(msg)) : msg))
      }
    }

    console.log(1)

    const tx = await this._wallet.createAndSignTx(txData)

    console.log(2)

    const transaction = await this._broadcastTx(tx)

    console.log(3)

    return {
      hash: transaction.txhash,
      value: sendOptions.value?.toNumber() || 0,
      _raw: {}
    }
  }

  async sendSweepTransaction(address: string | Address): Promise<Transaction<terra.InputTransaction>> {
    const addresses = await this.getAddresses()

    const balance = await this.getMethod('getBalance')(addresses)

    const message = this._sendMessage(address, balance)

    const fee = await this._estimateFee(this._signer.accAddress, [message])

    return await this.sendTransaction({ to: address, value: balance.minus(fee * 2) })
  }

  canUpdateFee(): boolean {
    return false
  }

  _sendMessage(to: Address | string, value: BigNumber): MsgSend {
    return new MsgSend(addressToString(this._signer.accAddress), addressToString(to), {
      [this._network.asset]: value.toNumber()
    })
  }

  _getAccAddressKey(): string {
    return this._accAddressKey
  }

  private _setSigner(): void {
    this._signer = new MnemonicKey({
      mnemonic: this._mnemonic
    })
  }

  private _createWallet(mnemonicKey: MnemonicKey): void {
    this._wallet = this._lcdClient.wallet(mnemonicKey)

    this._accAddressKey = this._wallet.key.accAddress
  }

  private async _broadcastTx(tx: StdTx): Promise<BlockTxBroadcastResult> {
    return await this._lcdClient.tx.broadcast(tx)
  }

  private async _estimateFee(payer: string, msgs: Msg[]): Promise<number> {
    const fee = await this._lcdClient.tx.estimateFee(payer, msgs)

    return Number(fee.amount.get(this._network.asset).amount)
  }
}
