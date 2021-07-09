import { WalletProvider } from '@liquality/wallet-provider'
import { Address, ChainProvider, Transaction, SendOptions } from '@liquality/types'

export default class CosmosWalletProvider extends WalletProvider implements Partial<ChainProvider> {
  isWalletAvailable(): Promise<boolean> {
    throw new Error('Method not implemented.')
  }

  getAddresses(startingIndex?: number, numAddresses?: number, change?: boolean): Promise<Address[]> {
    console.log(startingIndex, numAddresses, change)
    throw new Error('Method not implemented.')
  }

  getUsedAddresses(numAddressPerCall?: number): Promise<Address[]> {
    console.log(numAddressPerCall)
    throw new Error('Method not implemented.')
  }

  getUnusedAddress(change?: boolean, numAddressPerCall?: number): Promise<Address> {
    console.log(change, numAddressPerCall)
    throw new Error('Method not implemented.')
  }

  signMessage(message: string, from: string): Promise<string> {
    console.log(message, from)
    throw new Error('Method not implemented.')
  }

  getConnectedNetwork(): Promise<any> {
    throw new Error('Method not implemented.')
  }

  sendTransaction(options: SendOptions): Promise<Transaction> {
    console.log(options)
    throw new Error('Method not implemented.')
  }
}
