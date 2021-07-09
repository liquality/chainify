import BigNumber from 'bignumber.js'
import { SwapProvider, SwapParams } from './swap'
import { ChainProvider, SendOptions } from './chain'
import { WalletProvider } from './wallet'

import { FeeProvider, FeeDetails, FeeDetail } from './fees'
import { Transaction } from './transaction'
import { Block } from './block'
import { Address } from './address'
import { Network } from './network'

import * as bitcoin from './bitcoin'
import * as ethereum from './ethereum'
import * as near from './near'
import * as solana from './solana'

interface IClient {
  /**
   * Helper method that returns method from a provider.
   * @param {!string} method - Name of the method to look for in the provider stack
   * @param {object} [requestor] - If provided, it returns method from providers only
   *  above the requestor in the stack.
   * @return {function} Returns method from provider instance associated with the requested method
   */
  getMethod(method: string, requestor?: any): () => any

  chain: ChainProvider
  swap: SwapProvider
  wallet: WalletProvider
}

export {
  IClient,
  SwapProvider,
  ChainProvider,
  WalletProvider,
  FeeProvider,
  BigNumber,
  Transaction,
  Block,
  FeeDetails,
  FeeDetail,
  Address,
  Network,
  SendOptions,
  SwapParams,
  bitcoin,
  ethereum,
  near,
  solana
}
