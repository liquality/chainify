import { WalletProvider } from '@liquality/wallet-provider'
import { Address, BigNumber, SwapParams, Transaction, terra } from '@liquality/types'
import { addressToString } from '@liquality/utils'
import { TerraNetwork } from '@liquality/terra-networks'
import { MnemonicKey, MsgExecuteContract, MsgInstantiateContract, MsgSend } from '@terra-money/terra.js'

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
    this._setSigner()
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
    const signed = await this._signer.sign(Buffer.from(message))

    return signed.toString('hex')
  }

  async getConnectedNetwork(): Promise<TerraNetwork> {
    return this._network
  }

  async sendTransaction(sendOptions: terra.TerraSendOptions): Promise<Transaction<terra.InputTransaction>> {
    const { to, value, messages } = sendOptions
    const wallet = this.getMethod('_createWallet')(this._signer)

    const msgs = []

    if (messages) {
      msgs.push(...messages)
    } else {
      msgs.push(this._sendMessage(to, value))
    }

    const tx = await wallet.createAndSignTx({
      msgs
    })

    const transaction = await this.getMethod('_broadcastTx')(tx)

    console.log(transaction.txhash)

    const parsed = await this.getMethod('getTransactionByHash')(transaction.txhash)

    return parsed
  }

  async sendSweepTransaction(address: string | Address): Promise<Transaction<terra.InputTransaction>> {
    const addresses = await this.getAddresses()

    const balance = await this.getMethod('getBalance')(addresses)

    const message = this._sendMessage(address, balance)

    const fee = await this.getMethod('_estimateFee')(this._signer.accAddress, [message])

    return await this.sendTransaction({ to: address, value: balance.minus(fee * 2) })
  }

  canUpdateFee(): boolean {
    return false
  }

  _instantiateContractMessage(swapParams: SwapParams): MsgInstantiateContract {
    const wallet = this.getMethod('_createWallet')(this._signer)
    const { asset, codeId } = this._network

    return new MsgInstantiateContract(
      wallet.key.accAddress,
      codeId,
      {
        buyer: swapParams.recipientAddress,
        seller: swapParams.refundAddress,
        expiration: swapParams.expiration,
        value: Number(swapParams.value),
        secret_hash: swapParams.secretHash
      },
      { [asset]: Number(swapParams.value) },
      false
    )
  }

  _executeContractMessage(contractAddress: string, method: any): MsgExecuteContract {
    const wallet = this.getMethod('_createWallet')(this._signer)

    return new MsgExecuteContract(wallet.key.accAddress, contractAddress, method)
  }

  _sendMessage(to: Address | string, value: BigNumber): MsgSend {
    return new MsgSend(addressToString(this._signer.accAddress), addressToString(to), {
      [this._network.asset]: value.toNumber()
    })
  }

  private _setSigner(): MnemonicKey {
    if (!this._signer) {
      this._signer = new MnemonicKey({
        mnemonic: this._mnemonic
      })
    }

    return this._signer
  }
}
