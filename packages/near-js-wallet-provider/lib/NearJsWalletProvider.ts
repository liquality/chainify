import { WalletProvider } from '@liquality/wallet-provider'
import { addressToString } from '@liquality/utils'
import { NearNetwork } from '@liquality/near-networks'
import { Address, Network, ChainProvider, near } from '@liquality/types'
import { normalizeTransactionObject, keyStores, KeyPair, InMemorySigner, transactions, BN } from '@liquality/near-utils'
import { parseSeedPhrase } from 'near-seed-phrase'

interface NearJsWalletProviderOptions {
  network: NearNetwork
  mnemonic: string
  derivationPath: string
}

export default class NearJsWalletProvider extends WalletProvider implements Partial<ChainProvider> {
  _network: NearNetwork
  _mnemonic: string
  _derivationPath: string
  _keyStore: keyStores.InMemoryKeyStore
  _addressCache: { [key: string]: Address }

  constructor(options: NearJsWalletProviderOptions) {
    const { network, mnemonic, derivationPath } = options
    super({ network })
    this._network = network
    this._mnemonic = mnemonic
    this._derivationPath = derivationPath
    this._keyStore = new keyStores.InMemoryKeyStore()
    this._addressCache = {}
  }

  async getAddresses(): Promise<Address[]> {
    if (this._addressCache[this._mnemonic]) {
      return [this._addressCache[this._mnemonic]]
    }

    const { publicKey, secretKey } = parseSeedPhrase(this._mnemonic, this._derivationPath)
    const keyPair = KeyPair.fromString(secretKey)
    const address = Buffer.from(keyPair.getPublicKey().data).toString('hex')
    await this._keyStore.setKey(this._network.networkId, address, keyPair)

    const result = new Address({
      address,
      derivationPath: this._derivationPath,
      publicKey
    })

    this._addressCache[this._mnemonic] = result
    return [result]
  }

  async getUnusedAddress(): Promise<Address> {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async getUsedAddresses(): Promise<Address[]> {
    return this.getAddresses()
  }

  getSigner(): InMemorySigner {
    return new InMemorySigner(this._keyStore)
  }

  async signMessage(message: string): Promise<string> {
    const addresses = await this.getAddresses()

    const signed = await this.getSigner().signMessage(
      Buffer.from(message),
      addressToString(addresses[0]),
      this._network.networkId
    )

    return Buffer.from(signed.signature).toString('hex')
  }

  async sendTransaction(options: near.NearSendOptions) {
    const addresses = await this.getAddresses()
    const from = await this.getMethod('getAccount')(addressToString(addresses[0]), this.getSigner())

    if (!options.actions) {
      options.actions = [transactions.transfer(new BN(options.value.toFixed()))]
    }

    const tx = await from.signAndSendTransaction(addressToString(options.to), options.actions)
    return normalizeTransactionObject({ ...tx, blockHash: tx.transaction_outcome.block_hash })
  }

  async sendSweepTransaction(address: string) {
    const addresses = await this.getAddresses()
    const from = await this.getMethod('getAccount')(addressToString(addresses[0]), this.getSigner())

    const tx = await from.deleteAccount(addressToString(address))
    return normalizeTransactionObject({ ...tx, blockHash: tx.transaction_outcome.block_hash })
  }

  async isWalletAvailable(): Promise<boolean> {
    const addresses = await this.getAddresses()
    return addresses.length > 0
  }

  async getWalletNetworkId(): Promise<string> {
    return this._network.networkId
  }

  async getConnectedNetwork(): Promise<Network> {
    return this._network
  }

  canUpdateFee(): boolean {
    return false
  }
}
