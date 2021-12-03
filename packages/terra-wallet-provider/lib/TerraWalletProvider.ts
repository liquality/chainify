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
  Wallet,
  CreateTxOptions,
  Fee,
  Tx,
  MsgExecuteContract,
  isTxError
} from '@terra-money/terra.js'
import { ceil } from 'lodash'

interface TerraWalletProviderOptions {
  network: TerraNetwork
  mnemonic: string
  baseDerivationPath: string
  asset: string
  feeAsset: string
  tokenAddress?: string
  stableFee?: boolean
}

export default class TerraWalletProvider extends WalletProvider {
  _network: TerraNetwork
  _baseDerivationPath: string
  _addressCache: { [key: string]: Address }
  private _mnemonic: string
  private _signer: MnemonicKey
  private _lcdClient: LCDClient
  private _wallet: Wallet
  private _asset: string
  private _feeAsset: string
  private _tokenAddress: string
  private _stableFee: boolean
  _accAddressKey: string

  constructor(options: TerraWalletProviderOptions) {
    const { network, mnemonic, baseDerivationPath, asset, feeAsset, tokenAddress, stableFee } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._baseDerivationPath = baseDerivationPath
    this._addressCache = {}
    this._asset = asset
    this._feeAsset = feeAsset
    this._tokenAddress = tokenAddress
    this._stableFee = stableFee
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
      publicKey: wallet.publicKey.pubkeyAddress()
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
    const txData = await this.composeTransaction(sendOptions)

    const tx = await this._wallet.createAndSignTx(txData)

    const transaction = await this._broadcastTx(tx)

    if (isTxError(transaction)) {
      throw new Error(
        `Encountered an error while running the transaction: ${transaction.code} ${transaction.codespace} ${transaction.raw_log}`
      )
    }

    return {
      hash: transaction.txhash,
      value: sendOptions.value?.toNumber() || 0,
      _raw: {}
    }
  }

  async sendSweepTransaction(address: string | Address): Promise<Transaction<terra.InputTransaction>> {
    const addresses = await this.getAddresses()

    const balance = await this.getMethod('getBalance')(addresses)

    return await this.sendTransaction({ to: address, value: balance })
  }

  async getTaxFees(amount: number, denom: string, max: boolean): Promise<any> {
    const taxRate = await this._lcdClient.treasury.taxRate()
    const taxCap = await this._lcdClient.treasury.taxCap(denom)

    const _taxRate = taxRate.toNumber()
    const _taxCap = taxCap.amount.toNumber()

    const addresses = await this.getAddresses()
    const balance = await this.getMethod('getBalance')(addresses)

    return Math.min((max ? balance : amount || 0) * _taxRate, _taxCap / 1_000_000)
  }

  canUpdateFee(): boolean {
    return false
  }

  _sendMessage(to: Address | string, value: BigNumber): MsgSend | MsgExecuteContract {
    const sender = addressToString(this._signer.accAddress)
    const recipient = addressToString(to)

    if (this._tokenAddress) {
      return new MsgExecuteContract(sender, this._tokenAddress, {
        transfer: {
          recipient,
          amount: value.toString()
        }
      })
    }

    return new MsgSend(addressToString(this._signer.accAddress), addressToString(recipient), {
      [this._asset]: value.toNumber()
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

  private async _broadcastTx(tx: Tx): Promise<BlockTxBroadcastResult> {
    return await this._lcdClient.tx.broadcast(tx)
  }

  private async composeTransaction(sendOptions: SendOptions) {
    const { to, value, fee } = sendOptions

    const data: CreateTxOptions = sendOptions.data as any
    let txData: any

    const isProto = typeof data?.msgs[0] === 'string' && '@type' in JSON.parse(data?.msgs[0] as any)

    if (typeof data?.fee === 'string') {
      txData = {
        fee: isProto ? Fee.fromData(JSON.parse(data.fee as any)) : Fee.fromAmino(JSON.parse(data.fee as any))
      }
    } else if (data?.msgs) {
      const gasPrice = data.fee as any
      const gasLimit = 800000

      let taxFee
      if (this._stableFee) {
        taxFee = new BigNumber((await this.getTaxFees(value.toNumber() / 1_000_000, this._feeAsset, false)) * 1_000_000)
      }

      const fee = ceil(
        new BigNumber(gasLimit)
          .times(gasPrice)
          .plus(taxFee || 0)
          .toNumber()
      )
      const coins = new Coins({ [this._feeAsset]: fee })

      txData = {
        ...(data.fee && {
          fee: new Fee(gasLimit, coins)
        })
      }
    } else {
      txData = {
        msgs: [this._sendMessage(to, value)],
        ...(fee && {
          gasPrices: new Coins({
            [this._feeAsset]: fee
          })
        })
      }
    }

    if (data?.memo) {
      txData = {
        ...txData,
        memo: data.memo
      }
    }

    if (!txData.msgs) {
      txData = {
        ...txData,
        msgs: data.msgs.map((msg) =>
          typeof msg !== 'string' ? msg : isProto ? Msg.fromData(JSON.parse(msg)) : Msg.fromAmino(JSON.parse(msg))
        )
      }
    }

    return txData
  }
}
