import { version } from '../package.json'

import { Swap } from './swap'
import { Wallet } from './wallet'
import { Chain } from './chain'

import { FeeDetails } from './fees'
import { Transaction } from './transaction'
import { Block } from './block'
import { Address } from './address'

export interface Client {
  /**
   * Add a provider
   * @param {!Provider} provider - The provider instance or RPC connection string
   * @return {Client} Returns instance of Client
   * @throws {InvalidProviderError} When invalid provider is provider
   * @throws {DuplicateProviderError} When same provider is added again
   */
  addProvider (provider: Provider): this

  /**
   * Helper method that returns method from a provider.
   * @param {!string} method - Name of the method to look for in the provider stack
   * @param {object} [requestor] - If provided, it returns method from providers only
   *  above the requestor in the stack.
   * @return {function} Returns method from provider instance associated with the requested method
   */
  getMethod (method: string, requestor: any) : Function

  chain: Chain
  wallet: Wallet
  swap: Swap
}

export interface Provider {
  /**
   * Set client to a provider instance.
   * @param {!ChainAbstractionLayer} client - The ChainAbstractionLayer instance
   */ 
  setClient (client: Client): void

  /**
   * Get method for the provider
   * @param {!string} method - Name of the method
   * @return {function} Returns a method from a provider above current Provider
   *  in the stack.
   */
  getMethod (method: string, requestor: any) : Function
}

export {
  Transaction,
  Block,
  FeeDetails,
  Address,
  Swap,
  Wallet,
  Chain,
  version
}
