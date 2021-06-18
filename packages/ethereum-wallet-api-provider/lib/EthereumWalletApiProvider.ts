import { WalletProvider } from '@liquality/wallet-provider'
import { EthereumNetworks, EthereumNetwork } from '@liquality/ethereum-networks'
import { WalletError } from '@liquality/errors'
import { ensure0x, buildTransaction, normalizeTransactionObject, remove0x } from '@liquality/ethereum-utils'
import { addressToString } from '@liquality/utils'
import { Address, SendOptions, BigNumber, ethereum } from '@liquality/types'
import { Debug } from '@liquality/debug'

import { findKey } from 'lodash'

const debug = Debug('ethereum')

interface RequestArguments {
  method: string
  params?: any[] | any
}

interface EthereumProvider {
  request(req: RequestArguments): Promise<any>
  enable(): Promise<ethereum.Address[]>
}

// EIP1193
export default class EthereumWalletApiProvider extends WalletProvider {
  _ethereumProvider: EthereumProvider
  _network: EthereumNetwork

  constructor(ethereumProvider: EthereumProvider, network: EthereumNetwork) {
    super({ network })
    this._ethereumProvider = ethereumProvider
    this._network = network
  }

  async request(method: string, ...params: any) {
    await this._ethereumProvider.enable()

    try {
      const result = await this._ethereumProvider.request({ method, params })
      debug('got success', result)
      return result
    } catch (e) {
      debug('got error', e.message)
      throw new WalletError(e.toString(), e)
    }
  }

  async isWalletAvailable() {
    const addresses: string[] = await this.request('eth_accounts')
    return addresses.length > 0
  }

  async getAddresses() {
    const addresses: string[] = await this.request('eth_accounts')

    if (addresses.length === 0) {
      throw new WalletError('Wallet: No addresses available')
    }

    return addresses.map((address: string) => {
      return new Address({ address: remove0x(address) })
    })
  }

  async getUsedAddresses() {
    return this.getAddresses()
  }

  async getUnusedAddress() {
    const addresses = await this.getAddresses()
    return addresses[0]
  }

  async signMessage(message: string) {
    const hex = Buffer.from(message).toString('hex')

    const addresses = await this.getAddresses()
    const address = addresses[0]

    return this.request('personal_sign', ensure0x(hex), ensure0x(addressToString(address)))
  }

  async sendTransaction(options: SendOptions) {
    const networkId = await this.getWalletNetworkId()

    if (this._network) {
      if (networkId !== this._network.networkId) {
        throw new Error('Invalid Network')
      }
    }

    const addresses = await this.getAddresses()
    const from = addressToString(addresses[0])

    const txOptions: ethereum.UnsignedTransaction = {
      from,
      to: options.to ? addressToString(options.to) : (options.to as string),
      value: options.value,
      data: options.data
    }
    if (options.fee) txOptions.gasPrice = new BigNumber(options.fee)

    const txData = await buildTransaction(txOptions)

    const txHash: string = await this.request('eth_sendTransaction', txData)

    const txWithHash: ethereum.PartialTransaction = {
      ...txData,
      input: txData.data,
      hash: txHash
    }

    return normalizeTransactionObject(txWithHash)
  }

  canUpdateFee() {
    return false
  }

  async getWalletNetworkId() {
    const networkId: ethereum.Hex = await this.request('net_version')

    return parseInt(networkId)
  }

  async getConnectedNetwork() {
    const networkId = await this.getWalletNetworkId()
    const network = findKey(EthereumNetworks, (network) => network.networkId === networkId)

    if (networkId && !network) {
      return {
        name: 'unknown',
        networkId
      }
    }

    return (EthereumNetworks as { [key: string]: EthereumNetwork })[network]
  }
}
